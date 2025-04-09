import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DonutChart from "../components/donut";
import BorrowingTrendsChart from "../components/line";

const { width, height } = Dimensions.get("window");

export default function StaffDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.searchBarContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search a book"
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.booksRow}>
          <View style={styles.totalBooksBox}>
            <View style={styles.totalBooksTextContainer}>
              <Text style={styles.totalBooksText}>Total Books</Text>
              <View style={styles.percentageContainer}>
                <Text style={styles.percentage}>75.5%</Text>
                <Image
                  source={require("../../../assets/book.png")}
                  style={styles.bookImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          <View style={styles.borrowedBooksBox}>
            <View style={styles.borrowedBooksTextContainer}>
              <Text style={styles.borrowedBooksText}>Borrowed</Text>
              <View style={styles.percentageBorrowedContainer}>
                <Text style={styles.percentageBorrowed}>50.5%</Text>
                <Image
                  source={require("../../../assets/box.png")}
                  style={styles.borrowedBookImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.secondBooksRow}>
          {/* Unreturned */}
          <View
            style={[
              styles.statusBox,
              {
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                borderColor: "rgba(255, 0, 0, 0.5)",
              },
            ]}
          >
            <View style={styles.statusContent}>
              <Text style={styles.statusLabel}>Unreturned</Text>
              <View style={styles.percentageIconContainer}>
                <Text style={styles.statusPercentage}>30.2%</Text>
                <Image
                  source={require("../../../assets/clock.png")}
                  style={styles.statusImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          {/* Returned */}
          <View
            style={[
              styles.statusBox,
              {
                backgroundColor: "rgba(71, 177, 0, 0.5)",
                borderColor: "rgba(71, 177, 0, 0.5)",
              },
            ]}
          >
            <View style={styles.statusContent}>
              <Text style={styles.statusLabel}>Returned</Text>
              <View style={styles.percentageIconContainer}>
                <Text style={styles.statusPercentage}>45.8%</Text>
                <Image
                  source={require("../../../assets/check.png")}
                  style={styles.statusImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          {/* Registered Users */}
          <View
            style={[
              styles.statusBox,
              {
                backgroundColor: "rgba(191, 0, 208, 0.5)",
                borderColor: "rgba(191, 0, 208, 0.5)",
              },
            ]}
          >
            <View style={styles.statusContent}>
              <Text style={styles.statusLabel}>Registered Users</Text>
              <View style={styles.percentageIconContainer}>
                <Text style={styles.statusNumber}>50</Text>
                <Image
                  source={require("../../../assets/people.png")}
                  style={styles.statusImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.thirdRow}>
          {/* Donut Chart */}
          <View style={styles.donutContainer}>
            <DonutChart radius={50} strokeWidth={40} />
          </View>

          {/* Borrowing Trend (Line Chart) */}
          <View style={styles.chartContainer}>
            <BorrowingTrendsChart />
          </View>
        </View>

        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Recent Activity Feed</Text>
          <View style={styles.recentContent}>
            <Text style={styles.contentText}>
              John Doe borrowed "Flutter Guide Book"
            </Text>
            <Text style={styles.contentText}>2 hours ago</Text>
            <Text></Text>
            <Text style={styles.contentText}>
              System synced water meter data
            </Text>
            <Text style={styles.contentText}>3 hours ago</Text>
            <Text></Text>
            <Text style={styles.contentText}>New user "Anna" registered</Text>
            <Text style={styles.contentText}>4 hours ago</Text>
            <Text></Text>
            <Text style={styles.contentText}>
              Book "Data Science 101" returned
            </Text>
            <Text style={styles.contentText}>5 hours ago</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(169, 222, 255, 0.4)",
  },
  content: {
    flex: 1,
    padding: width * 0.05,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    width: 220,
    alignSelf: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: height * 0.02,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    padding: 0,
    color: "#000",
  },
  booksRow: {
    marginTop: height * 0.02,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  totalBooksBox: {
    backgroundColor: "rgba(45, 173, 253, 0.5)",
    borderRadius: 12,
    borderColor: "rgba(45, 173, 253, 0.5)",
    borderWidth: 1,
    padding: width * 0.03,
    width: "65%",
    marginRight: width * 0.02,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "rgba(45, 173, 253, 0.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  totalBooksTextContainer: {
    flexDirection: "column",
    flex: 1,
  },
  totalBooksText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  percentageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  percentage: {
    fontSize: width * 0.13,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    lineHeight: width * 0.16,
    marginRight: width * 0.05,
  },
  bookImage: {
    width: width * 0.15,
    height: width * 0.15,
  },
  borrowedBooksBox: {
    backgroundColor: "rgba(248, 185, 25, 0.5)",
    borderColor: "rgba(248, 185, 25, 0.5)",
    borderWidth: 1,
    borderRadius: 8,
    padding: width * 0.02,
    width: "30%",
    height: height * 0.08,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(248, 185, 25, 0.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  percentageBorrowedContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  borrowedBooksTextContainer: {
    flexDirection: "column",
  },
  borrowedBooksText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  percentageBorrowed: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginRight: 8,
  },
  borrowedBookImage: {
    width: 20,
    height: 20,
  },
  secondBooksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statusBox: {
    width: "30%",
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    borderWidth: 1,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusContent: {
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  percentageIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusPercentage: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  statusNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  statusImage: {
    width: 24,
    height: 24,
  },
  recentContainer: {
    justifyContent: "center",
  },
  recentContent: {
    paddingHorizontal: 10,
  },
  contentText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000",
  },
  recentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 40,
    padding: 15,
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#fff",
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
