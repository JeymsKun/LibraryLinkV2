import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";
import { supabase } from "../../../lib/supabase";
import { Skeleton } from "moti/skeleton";

const { width: screenWidth } = Dimensions.get("window");

const BorrowingTrendsChart = forwardRef((props, ref) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const barColors = ["#FF7676", "#F8CA8D", "#AED69D", "#95D7FD"];
  const chartHeight = screenWidth * 0.2;
  const barWidth = screenWidth * 0.04;
  const barSpacing = screenWidth * 0.025;

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fetchData = async () => {
    setLoading(true);

    try {
      const { data: bookingCart, error } = await supabase
        .from("booking_cart")
        .select("borrow_date, borrow_return_date")
        .eq("status", "borrowed");

      if (error) {
        console.error("Error fetching booking cart: ", error);
        setLoading(false);
        return;
      }

      const currentDate = new Date();
      const monthlyBorrowed = {};

      bookingCart.forEach((item) => {
        const borrowDate = new Date(item.borrow_date);
        const borrowReturnDate = item.borrow_return_date
          ? new Date(item.borrow_return_date)
          : null;

        if (
          borrowDate <= currentDate &&
          (!borrowReturnDate || borrowReturnDate >= currentDate)
        ) {
          const month = borrowDate.getMonth();
          monthlyBorrowed[month] = (monthlyBorrowed[month] || 0) + 1;
        }
      });

      const now = new Date();
      const months = Array.from({ length: 4 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (3 - i), 1);
        return {
          monthIndex: date.getMonth(),
          monthName: monthNames[date.getMonth()],
        };
      });

      const latestFour = months.map(({ monthIndex, monthName }) => ({
        monthName,
        value: monthlyBorrowed[monthIndex] || 0,
      }));

      setChartData(latestFour);
    } catch (error) {
      console.error("Error fetching borrowing trends data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Expose the fetchData method to the parent component
  useImperativeHandle(ref, () => ({
    fetchData,
  }));

  useEffect(() => {
    fetchData();
  }, []);

  const maxValue = Math.max(...chartData.map((item) => item.value), 1);
  const numberOfBars = chartData.length;
  const chartWidth = numberOfBars * (barWidth + barSpacing) + 30;

  const tickStep = Math.ceil(maxValue / 5);
  const yAxisTicks = Array.from({ length: 6 }, (_, i) => i * tickStep);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: screenWidth * 0.035 }]}>
        Borrowing trends
      </Text>
      {loading ? (
        <View style={styles.skeletonContainer}>
          {[...Array(4)].map((_, index) => (
            <Skeleton
              key={index}
              colorMode="light"
              width={barWidth}
              height={chartHeight}
              radius={4}
              style={[
                styles.skeletonBar,
                { marginLeft: index === 0 ? 0 : barSpacing },
              ]}
            />
          ))}
        </View>
      ) : (
        <View style={styles.chartContainer}>
          <Svg
            height={chartHeight + 25}
            width={Math.min(chartWidth, screenWidth - 40)}
          >
            <Line
              x1="30"
              y1="0"
              x2="30"
              y2={chartHeight}
              stroke="#ccc"
              strokeWidth="1"
            />
            <Line
              x1="30"
              y1={chartHeight}
              x2={chartWidth}
              y2={chartHeight}
              stroke="#ccc"
              strokeWidth="1"
            />

            {yAxisTicks.map((tick, index) => {
              const yPosition = (1 - tick / maxValue) * chartHeight;
              return (
                <React.Fragment key={index}>
                  <Line
                    x1="30"
                    y1={yPosition}
                    x2={chartWidth}
                    y2={yPosition}
                    stroke="#ccc"
                    strokeWidth="1"
                  />
                  <SvgText
                    x="15"
                    y={yPosition}
                    fontSize={screenWidth * 0.025}
                    fill="#000"
                    textAnchor="middle"
                  >
                    {tick}
                  </SvgText>
                </React.Fragment>
              );
            })}

            {chartData.map((item, index) => {
              const { value, monthName } = item;
              const barHeight = (value / maxValue) * chartHeight;
              const x = 40 + index * (barWidth + barSpacing);
              const y = chartHeight - barHeight;

              return (
                <React.Fragment key={index}>
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={barColors[index % barColors.length]}
                  />
                  {value > 0 && (
                    <SvgText
                      x={x + barWidth / 2}
                      y={chartHeight + 15}
                      fontSize={screenWidth * 0.025}
                      fill="#000"
                      textAnchor="middle"
                    >
                      {monthName}
                    </SvgText>
                  )}
                </React.Fragment>
              );
            })}
          </Svg>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  chartContainer: {
    width: "100%",
    alignItems: "center",
  },
  skeletonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    height: screenWidth * 0.2,
  },
  skeletonBar: {
    backgroundColor: "#e0e0e0",
  },
});

export default BorrowingTrendsChart;
