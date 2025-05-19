import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../../context/AuthContext";
import { useViewToggle } from "../../../context/ViewToggleContext";

const fetchUserRecord = async (userId) => {
  try {
    const { data: userRecord, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user record:", error);
      return null;
    }

    if (userRecord) {
      return userRecord;
    } else {
      console.warn("User record not found for userId:", userId);
      return null;
    }
  } catch (err) {
    console.error("Unexpected error fetching user record:", err);
    return null;
  }
};

export default function UserDashboard() {
  const router = useRouter();
  const { userId } = useAuth();
  const [recentBooks, setRecentBooks] = useState([]);
  const [userRecord, setUserRecord] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pendingBooks, setPendingBooks] = useState([]);
  const { showPending, toggleView } = useViewToggle();

  const fetchPendingBooks = async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from("booking_requests")
        .select("*, books(*)")
        .eq("user_id", userId)
        .eq("status", "waiting");

      if (error) {
        console.error("Error fetching pending books:", error);
        return;
      }

      const resolved = await Promise.all(
        data.map(async ({ books }) => {
          const { data: urlData } = supabase.storage
            .from("library")
            .getPublicUrl(books.cover_image_url.trim());
          return {
            ...books,
            coverUrl: urlData.publicUrl,
          };
        })
      );

      setPendingBooks(resolved);
    } catch (err) {
      console.error("Error fetching pending books:", err);
    }
  };

  const fetchRecentViewedBooks = async () => {
    console.log("Fetching recent viewed books for userId:", userId);

    if (!userId) return;

    try {
      const userData = await fetchUserRecord(userId);
      setUserRecord(userData);

      const { data: recentViewData, error: recentError } = await supabase
        .from("user_library")
        .select("books_id, viewed_at")
        .eq("user_id", userId)
        .order("viewed_at", { ascending: false });

      if (recentError) {
        console.error("Error fetching recent views:", recentError);
        return;
      }

      const bookIds = recentViewData.map((item) => item.books_id);
      if (bookIds.length === 0) {
        setRecentBooks([]);
        return;
      }

      const { data: booksData, error: booksError } = await supabase
        .from("books")
        .select("books_id, title, cover_image_url")
        .in("books_id", bookIds);

      if (booksError) {
        console.error("Error fetching books:", booksError);
        return;
      }

      const booksWithUrls = booksData.map((book) => {
        const coverUrl = supabase.storage
          .from("library")
          .getPublicUrl(book.cover_image_url.trim()).data.publicUrl;

        return {
          ...book,
          coverUrl,
        };
      });

      setRecentBooks(booksWithUrls);
    } catch (err) {
      console.error("Error fetching recent books:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecentViewedBooks();
      fetchPendingBooks();
    }, [userId])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecentViewedBooks();
    setRefreshing(false);
  };

  const handleBookPress = (id) => {
    router.push(`../screens/about?id=${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 10,
          }}
        >
          <Text style={styles.sectionTitle}>
            {showPending ? "My Pending" : "Recently Viewed"}
          </Text>
        </View>

        <View style={styles.bookGrid}>
          {(showPending ? pendingBooks : recentBooks).map((book) => (
            <TouchableOpacity
              key={book.books_id}
              style={styles.bookContainer}
              onPress={() => handleBookPress(book.books_id)}
            >
              <Image
                source={{ uri: book.coverUrl }}
                style={styles.coverImage}
                resizeMode="cover"
              />
              <Text style={styles.bookTitle} numberOfLines={2}>
                {book.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A9DEFF",
    paddingBottom: 50,
  },
  scrollView: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 14,
    margin: 10,
    color: "#222",
  },
  bookGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  bookContainer: {
    width: "45%",
    aspectRatio: 0.65,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "80%",
  },
  bookTitle: {
    fontSize: 14,
    padding: 8,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
});
