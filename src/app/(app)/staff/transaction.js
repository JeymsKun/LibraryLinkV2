// app/(app)/staff/transaction.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function Transaction() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const date = `${now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })} Today`;
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentDate(date);
      setCurrentTime(time);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const transactions = [
    {
      id: "1",
      title: "Atomic Habits",
      borrower: "John Doe",
      borrowedDate: "Apr 1, 2025",
      dueDate: "Apr 7, 2025",
      status: "Borrowed",
    },
    {
      id: "2",
      title: "Deep Work",
      borrower: "Jane Smith",
      borrowedDate: "Mar 28, 2025",
      dueDate: "Apr 3, 2025",
      status: "Overdue",
    },
  ];

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <Text style={styles.transactionText}>
        📖 <Text style={styles.bold}>Book Title:</Text> "{item.title}"
      </Text>
      <Text style={styles.transactionText}>
        👤 <Text style={styles.bold}>Borrower:</Text> {item.borrower}
      </Text>
      <Text style={styles.transactionText}>
        📅 <Text style={styles.bold}>Borrowed:</Text> {item.borrowedDate} |{" "}
        <Text style={styles.bold}>Due:</Text> {item.dueDate}
      </Text>
      <Text style={styles.transactionText}>
        ⏱️ <Text style={styles.bold}>Status:</Text> [{item.status}]
      </Text>
      {item.status === "Borrowed" ? (
        <TouchableOpacity>
          <Text style={styles.actionText}>[ Mark as Returned ]</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity>
          <Text style={styles.actionText}>[ Send Reminder ]</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Introductory Text */}
      <Text style={styles.introText}>
        View your borrowing history and active transactions.
      </Text>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerDay}>Sunday</Text>
          <View style={styles.headerRow}>
            <Text style={styles.headerDate}>{currentDate}</Text>
            <Text style={styles.headerTime}>{currentTime}</Text>
          </View>
        </View>
        <View style={styles.headerWrapperImage}>
          <Image
            source={require("../../../assets/calendar.png")}
            style={styles.headerImage}
          />
        </View>
      </View>
      {/* Filters and Search */}
      <View style={styles.filterSearchRow}>
        <View style={styles.filterBox}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={toggleDropdown}
          >
            <Text style={styles.filterText}>Status filter</Text>
            <View style={styles.wrapperIconContainer}>
              <View style={styles.firstBox}></View>
              <View style={styles.secondBox}>
                <Ionicons name="chevron-down" size={12} color="#000" />
              </View>
            </View>
          </TouchableOpacity>
          {isDropdownVisible && (
            <View style={styles.dropdownOptions}>
              <TouchableOpacity
                style={[
                  styles.option,
                  {
                    backgroundColor: "#F8B919",
                    borderWidth: 1,
                    borderColor: "#F8B919",
                  },
                ]}
              >
                <Text style={styles.optionText}>Borrowed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.option,
                  {
                    backgroundColor: "rgba(71, 177, 0, 0.5)",
                    borderWidth: 1,
                    borderColor: "rgba(71, 177, 0, 0.5)",
                  },
                ]}
              >
                <Text style={styles.optionText}>Returned</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.option,
                  {
                    backgroundColor: "#FF0000",
                    borderWidth: 1,
                    borderColor: "#FF0000",
                  },
                ]}
              >
                <Text style={styles.optionText}>Overdue</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
      </View>
      {/* Recent Transactions */}
      <Text style={styles.sectionTitle}>RECENT TRANSACTIONS</Text>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.transactionList}
      />

      <View style={styles.paginationContainer}>
        <Text style={styles.paginationLabel}>{"<<"} Pagination:</Text>
        <Text style={styles.paginationLabel}>
          [
          <TouchableOpacity style={styles.paginationButton}>
            <Text style={styles.paginationText}>Prev </Text>
          </TouchableOpacity>
          ]
        </Text>
        <Text style={styles.paginationLabel}>
          [
          <TouchableOpacity style={styles.paginationButton}>
            <Text style={styles.paginationText}>1 </Text>
          </TouchableOpacity>
          ]
        </Text>
        <Text style={styles.paginationLabel}>
          [
          <TouchableOpacity style={styles.paginationButton}>
            <Text style={styles.paginationText}>2 </Text>
          </TouchableOpacity>
          ]
        </Text>
        <Text style={styles.paginationLabel}>
          [
          <TouchableOpacity style={styles.paginationButton}>
            <Text style={styles.paginationText}>Next </Text>
          </TouchableOpacity>
          ]
        </Text>
        <Text style={styles.paginationLabel}>{">>"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(169, 222, 255, 0.4)",
    padding: width * 0.04,
  },
  introText: {
    fontSize: width * 0.045,
    textAlign: "center",
    marginBottom: height * 0.02,
    color: "#000",
  },
  headerCard: {
    width: "50%",
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(248, 185, 25, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(248, 185, 25, 0.5)",
    padding: width * 0.03,
    borderRadius: width * 0.02,
    marginBottom: height * 0.02,
    position: "relative",
  },
  headerLeft: {
    flex: 1,
    position: "relative",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  headerDay: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#000",
    marginRight: width * 0.02,
  },
  headerWrapperImage: {
    position: "absolute",
    right: width * 0.01,
    top: width * 0.04,
  },
  headerImage: {
    width: 40,
    height: 40,
  },
  headerDate: {
    fontSize: width * 0.035,
    color: "#000",
    marginRight: width * 0.02,
  },
  headerTime: {
    fontSize: width * 0.036,
    color: "#000",
  },
  filterSearchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 1,
    marginBottom: height * 0.02,
  },
  filterBox: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: "45%",
    position: "relative",
  },
  wrapperIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  firstBox: {
    width: 14,
    height: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
  },
  secondBox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.03,
    height: height * 0.05,
  },
  filterText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  dropdownOptions: {
    position: "absolute",
    top: height * 0.06,
    left: 0,
    right: 0,
    padding: width * 0.03,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    padding: 5,
    margin: 2,
    paddingHorizontal: 15,
    borderRadius: 15,
    justifyContent: "center",
  },
  optionText: {
    fontSize: width * 0.04,
    color: "#000",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.015,
    borderWidth: 1,
    borderColor: "#000",
    width: "50%",
    alignSelf: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: width * 0.02,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    padding: 0,
    color: "#000",
  },
  sectionTitle: {
    fontSize: width * 0.05,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: height * 0.02,
  },
  transactionList: {
    paddingBottom: height * 0.02,
  },
  transactionCard: {
    backgroundColor: "#FFF",
    padding: width * 0.04,
    borderRadius: width * 0.03,
    marginBottom: height * 0.02,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionText: {
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
  },
  bold: {
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  actionText: {
    fontSize: width * 0.04,
    color: "#007BFF",
    marginTop: height * 0.01,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.02,
  },
  paginationLabel: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    marginRight: width * 0.02,
    color: "#000",
  },
  paginationButton: {
    margin: width * 0.001,
  },
  paginationText: {
    marginHorizontal: width * 0.01,
    fontSize: width * 0.04,
    color: "#000",
  },
});
