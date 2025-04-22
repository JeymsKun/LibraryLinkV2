import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import DonutChart from "../components/donut";
import BorrowingTrendsChart from "../components/line";
import DashboardCards from "../components/dashboardCards";
import RecentActivity from "../components/recentActivity";

const { width } = Dimensions.get("window");

export default function StaffDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const dashboardCardsRef = useRef(null);
  const donutChartRef = useRef(null);
  const borrowingTrendsRef = useRef(null);
  const recentActivityRef = useRef(null);

  const onRefresh = async () => {
    setRefreshing(true);

    if (dashboardCardsRef.current) await dashboardCardsRef.current.fetchData();
    if (donutChartRef.current) await donutChartRef.current.fetchData();
    if (borrowingTrendsRef.current)
      await borrowingTrendsRef.current.fetchData();
    if (recentActivityRef.current) await recentActivityRef.current.fetchData();

    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <DashboardCards ref={dashboardCardsRef} />

          <View style={styles.thirdRow}>
            {/* Donut Chart */}
            <View style={styles.donutContainer}>
              <DonutChart ref={donutChartRef} radius={50} strokeWidth={40} />
            </View>

            {/* Borrowing Trend (Line Chart) */}
            <View style={styles.chartContainer}>
              <BorrowingTrendsChart ref={borrowingTrendsRef} />
            </View>
          </View>

          <View style={styles.recentContainer}>
            <RecentActivity ref={recentActivityRef} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(169, 222, 255, 0.4)",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: width * 0.05,
  },
  thirdRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  donutContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    height: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 16,
    width: "45%",
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
