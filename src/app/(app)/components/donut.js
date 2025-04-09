import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { G, Circle } from "react-native-svg";

const { width } = Dimensions.get("window");

const DonutChart = ({
  availablePercentage = 60,
  borrowedPercentage = 40,
  radius = width * 0.2,
  strokeWidth = width * 0.05,
  availableLabel = "Available Books",
  borrowedLabel = "Borrowed Books",
}) => {
  if (availablePercentage + borrowedPercentage !== 100) {
    borrowedPercentage = 100 - availablePercentage;
  }

  const circleCircumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  const availableStrokeDasharray =
    (circleCircumference * availablePercentage) / 100;
  const borrowedStrokeDasharray =
    (circleCircumference * borrowedPercentage) / 100;

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
            {/* Render the borrowed portion */}
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

            {/* Render the available portion */}
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
};

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
