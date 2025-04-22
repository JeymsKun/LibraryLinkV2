import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { G, Circle } from "react-native-svg";
import { supabase } from "../../../lib/supabase";
import { Skeleton } from "moti/skeleton";

const { width } = Dimensions.get("window");

const DonutChart = forwardRef(
  (
    {
      radius = width * 0.2,
      strokeWidth = width * 0.05,
      availableLabel = "Available Books",
      borrowedLabel = "Borrowed Books",
    },
    ref
  ) => {
    const [availablePercentage, setAvailablePercentage] = useState(0);
    const [borrowedPercentage, setBorrowedPercentage] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
      setLoading(true);

      try {
        const { data: books, error: booksError } = await supabase
          .from("books")
          .select("*");

        const { data: bookingCart, error: bookingError } = await supabase
          .from("booking_cart")
          .select("books_id, borrow_date, borrow_return_date, status");

        if (booksError || bookingError) {
          console.error("Error:", booksError || bookingError);
          setLoading(false);
          return;
        }

        let totalCopies = 0;
        let totalBorrowed = 0;
        const now = new Date();

        books.forEach((book) => {
          const copies = book.copies || 1;
          totalCopies += copies;

          const borrowedForThisBook = bookingCart.filter(
            (entry) =>
              entry.books_id === book.books_id &&
              entry.status === "borrowed" &&
              new Date(entry.borrow_date) <= now &&
              new Date(entry.borrow_return_date) >= now
          ).length;

          totalBorrowed += borrowedForThisBook;
        });

        const totalAvailable = totalCopies - totalBorrowed;
        const total = totalCopies || 1;

        setAvailablePercentage(
          Number(((totalAvailable / total) * 100).toFixed(1))
        );
        setBorrowedPercentage(
          Number(((totalBorrowed / total) * 100).toFixed(1))
        );
      } catch (error) {
        console.error("Error fetching donut chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      fetchData,
    }));

    useEffect(() => {
      fetchData();
    }, []);

    const circleCircumference = 2 * Math.PI * radius;
    const halfCircle = radius + strokeWidth;
    const availableStrokeDasharray =
      (circleCircumference * availablePercentage) / 100;
    const borrowedStrokeDasharray =
      (circleCircumference * borrowedPercentage) / 100;

    if (loading) {
      return (
        <View style={styles.container}>
          <Skeleton
            colorMode="light"
            width={radius * 2}
            height={radius * 2}
            radius={radius}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {/* Left side label */}
        <View style={styles.leftSide}>
          <Text style={[styles.label, { fontSize: width * 0.017 }]}>
            {availableLabel}
          </Text>
          <Text style={[styles.percentage, { fontSize: width * 0.03 }]}>
            {availablePercentage}%
          </Text>
        </View>

        {/* Donut chart */}
        <View style={styles.donutContainer}>
          <Svg
            width={radius * 2}
            height={radius * 2}
            viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
          >
            <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
              {/* Borrowed ring */}
              <Circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="#9DB3C1"
                strokeWidth={strokeWidth}
                strokeDasharray={`${borrowedStrokeDasharray} ${circleCircumference}`}
                strokeDashoffset={0}
                fill="transparent"
                strokeLinecap="butt"
              />
              {/* Available ring */}
              <Circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="#008000"
                strokeWidth={strokeWidth}
                strokeDasharray={`${availableStrokeDasharray} ${circleCircumference}`}
                strokeDashoffset={-borrowedStrokeDasharray}
                fill="transparent"
                strokeLinecap="butt"
              />
            </G>
          </Svg>
        </View>

        {/* Right side label */}
        <View style={styles.rightSide}>
          <Text style={[styles.label, { fontSize: width * 0.019 }]}>
            {borrowedLabel}
          </Text>
          <Text style={[styles.percentage, { fontSize: width * 0.03 }]}>
            {borrowedPercentage}%
          </Text>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  donutContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "50%",
    height: "50%",
  },
  leftSide: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    left: "2%",
    bottom: "50%",
    transform: [{ translateY: width * 0.1 }],
  },
  rightSide: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: "5%",
    top: "50%",
    transform: [{ translateY: -width * 0.1 }],
  },
  label: {
    fontWeight: "bold",
    color: "#003366",
    textAlign: "center",
  },
  percentage: {
    fontWeight: "bold",
    color: "#003366",
  },
});

export default DonutChart;
