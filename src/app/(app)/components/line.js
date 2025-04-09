import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

const BorrowingTrendsChart = () => {
  const chartData = [10, 20, 150, 50];
  const barColors = ["#FF7676", "#F8CA8D", "#AED69D", "#95D7FD"];
  const chartHeight = screenWidth * 0.2;
  const barWidth = screenWidth * 0.04;
  const barSpacing = screenWidth * 0.025;

  const maxValue = Math.max(...chartData);
  const numberOfBars = chartData.length;
  const chartWidth = numberOfBars * (barWidth + barSpacing) + 30;

  const tickStep = Math.ceil(maxValue / 5);
  const yAxisTicks = Array.from({ length: 6 }, (_, i) => i * tickStep);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: screenWidth * 0.035 }]}>
        Borrowing trends
      </Text>
      <View style={styles.chartContainer}>
        <Svg
          height={chartHeight + 10}
          width={Math.min(chartWidth, screenWidth - 40)}
        >
          {/* Y-Axis line (background) */}
          <Line
            x1="30"
            y1="0"
            x2="30"
            y2={chartHeight}
            stroke="#ccc"
            strokeWidth="1"
          />

          {/* X-Axis line (background) */}
          <Line
            x1="30"
            y1={chartHeight}
            x2={chartWidth}
            y2={chartHeight}
            stroke="#ccc"
            strokeWidth="1"
          />

          {/* Y-Axis Lines and Labels */}
          {yAxisTicks.map((tick, index) => {
            const yPosition = (1 - tick / maxValue) * chartHeight;
            return (
              <React.Fragment key={index}>
                {/* Y-Axis Line (background) */}
                <Line
                  x1="30"
                  y1={yPosition}
                  x2={chartWidth}
                  y2={yPosition}
                  stroke="#ccc"
                  strokeWidth="1"
                />
                {/* Y-Axis Label */}
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

          {/* Bars */}
          {chartData.map((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = 40 + index * (barWidth + barSpacing);
            const y = chartHeight - barHeight;

            return (
              <React.Fragment key={index}>
                {/* Bar (drawn last, after the lines) */}
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={barColors[index % barColors.length]}
                />
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
};

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
    marginBottom: 6,
  },
  chartContainer: {
    width: "100%",
    alignItems: "center",
  },
});

export default BorrowingTrendsChart;
