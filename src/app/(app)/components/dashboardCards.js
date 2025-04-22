import React, {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
} from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { supabase } from "../../../lib/supabase";
import { Skeleton } from "moti/skeleton";

const { width, height } = Dimensions.get("window");

const DashboardCards = forwardRef((props, ref) => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    borrowed: 0,
    returned: 0,
    unreturned: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    try {
      const { count: bookCount } = await supabase
        .from("books")
        .select("*", { count: "exact", head: true });

      const { count: userCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      const { data: userBooks } = await supabase.from("booking_cart").select();

      const borrowed =
        userBooks?.filter((b) => b.status === "borrowed").length || 0;

      const now = new Date();
      const returned =
        userBooks?.filter((b) => {
          const borrowReturnDate = new Date(b.borrow_return_date);
          return borrowReturnDate <= now;
        }).length || 0;

      const unreturned =
        userBooks?.filter((b) => {
          const borrowReturnDate = new Date(b.borrow_return_date);
          return (
            b.status === "borrowed" &&
            (isNaN(borrowReturnDate) || borrowReturnDate > now)
          );
        }).length || 0;

      setStats({
        totalBooks: bookCount || 0,
        borrowed,
        returned,
        unreturned,
        users: userCount || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
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

  const percent = (value) => {
    if (!stats.totalBooks || stats.totalBooks === 0) return "0%";
    return `${((value / stats.totalBooks) * 100).toFixed(1)}%`;
  };

  return (
    <>
      {/* First Row: Total Books & Borrowed */}
      <View style={styles.booksRow}>
        <View style={styles.totalBooksBox}>
          <View style={styles.totalBooksTextContainer}>
            <Text style={styles.totalBooksText}>Total Books</Text>
            <View style={styles.percentageContainer}>
              {loading ? (
                <Skeleton
                  colorMode="light"
                  width="100%"
                  height={50}
                  radius={8}
                />
              ) : (
                <>
                  <Text style={styles.percentage}>{stats.totalBooks}</Text>
                  <Image
                    source={require("../../../assets/book.png")}
                    style={styles.bookImage}
                    resizeMode="contain"
                  />
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.borrowedBooksBox}>
          <View style={styles.borrowedBooksTextContainer}>
            <Text style={styles.borrowedBooksText}>Borrowed</Text>
            <View style={styles.percentageBorrowedContainer}>
              {loading ? (
                <Skeleton
                  colorMode="light"
                  width="100%"
                  height={20}
                  radius={8}
                />
              ) : (
                <>
                  <Text style={styles.percentageBorrowed}>
                    {percent(stats.borrowed)}
                  </Text>
                  <Image
                    source={require("../../../assets/box.png")}
                    style={styles.borrowedBookImage}
                    resizeMode="contain"
                  />
                </>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Second Row: Unreturned, Returned, Registered Users */}
      <View style={styles.secondBooksRow}>
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
              {loading ? (
                <Skeleton
                  colorMode="light"
                  width="100%"
                  height={20}
                  radius={8}
                />
              ) : (
                <>
                  <Text style={styles.statusPercentage}>
                    {percent(stats.unreturned)}
                  </Text>
                  <Image
                    source={require("../../../assets/clock.png")}
                    style={styles.statusImage}
                    resizeMode="contain"
                  />
                </>
              )}
            </View>
          </View>
        </View>

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
              {loading ? (
                <Skeleton
                  colorMode="light"
                  width="100%"
                  height={20}
                  radius={8}
                />
              ) : (
                <>
                  <Text style={styles.statusPercentage}>
                    {percent(stats.returned)}
                  </Text>
                  <Image
                    source={require("../../../assets/check.png")}
                    style={styles.statusImage}
                    resizeMode="contain"
                  />
                </>
              )}
            </View>
          </View>
        </View>

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
              {loading ? (
                <Skeleton
                  colorMode="light"
                  width="100%"
                  height={20}
                  radius={8}
                />
              ) : (
                <>
                  <Text style={styles.statusNumber}>{stats.users}</Text>
                  <Image
                    source={require("../../../assets/people.png")}
                    style={styles.statusImage}
                    resizeMode="contain"
                  />
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  booksRow: {
    marginTop: height * 0.02,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  skeletonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  skeletonItem: {
    marginBottom: 16,
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
    justifyContent: "center",
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
  percentageBorrowed: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginRight: 8,
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
  borrowedBooksText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  percentageBorrowedContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "center",
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
    marginLeft: 8,
    width: 24,
    height: 24,
  },
});

export default DashboardCards;
