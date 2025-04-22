import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { supabase } from "../../../lib/supabase";
import { Skeleton } from "moti/skeleton";

const timeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays === 1) return `1 day ago`;
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

const truncateTitle = (title, maxLength = 30) => {
  return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
};

const RecentActivity = forwardRef((props, ref) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    try {
      const { data: borrowedBooks, error: borrowError } = await supabase
        .from("booking_cart")
        .select(
          `borrow_date,
          borrow_return_date,
          user_id,
          books:books_id (title)`
        )
        .eq("status", "borrowed");

      const { data: users, error: userError } = await supabase
        .from("users")
        .select("user_id, full_name, created_at");

      if (borrowError || userError) {
        console.error("Error fetching activity data", borrowError || userError);
        setLoading(false);
        return;
      }

      const borrowedActivities = (borrowedBooks || []).map((item) => {
        const borrowTime = new Date(item.borrow_date);
        const returnTime = item.borrow_return_date
          ? new Date(item.borrow_return_date)
          : null;
        const user = (users || []).find((u) => u.user_id === item.user_id);
        const bookTitle = item.books?.title || "Unknown Book Title";

        const activityText = returnTime
          ? `Book "${truncateTitle(bookTitle)}" returned`
          : `${user?.full_name || "Unknown"} borrowed "${truncateTitle(
              bookTitle
            )}"`;

        return {
          text: activityText,
          time: borrowTime,
        };
      });

      const userRegistrations = (users || []).map((user) => ({
        text: `New user "${user.full_name}" registered`,
        time: new Date(user.created_at),
      }));

      const combined = [...borrowedActivities, ...userRegistrations];
      const oneDayAgo = new Date().setHours(new Date().getHours() - 24);

      const recent = combined.filter((item) => item.time >= oneDayAgo);
      recent.sort((a, b) => b.time - a.time);

      setActivities(recent.slice(0, 4));
    } catch (error) {
      console.error("Error fetching recent activities:", error);
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.recentTitle}>Recent Activity Feed</Text>
      {loading ? (
        <View>
          {[...Array(4)].map((_, index) => (
            <Skeleton
              key={index}
              colorMode="light"
              width="100%"
              height={20}
              radius={4}
              style={styles.skeletonItem}
            />
          ))}
        </View>
      ) : activities.length > 0 ? (
        activities.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <Text style={styles.contentText}>{activity.text}</Text>
            <Text style={styles.timestamp}>{timeAgo(activity.time)}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noActivity}>No recent activities available.</Text>
      )}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  recentTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  activityItem: {
    marginBottom: 16,
  },
  contentText: {
    fontSize: 15,
    color: "#000",
  },
  timestamp: {
    fontSize: 13,
    color: "gray",
  },
  noActivity: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  skeletonItem: {
    marginBottom: 16,
  },
});

export default RecentActivity;
