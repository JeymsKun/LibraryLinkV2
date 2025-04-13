import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { useFocusEffect } from "@react-navigation/native";

export default function UserDashboard() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  useFocusEffect(
    useCallback(() => {
      const fetchBooks = async () => {
        const { data, error } = await supabase
          .from("books")
          .select("books_id, title, cover_image_url");

        if (error) {
          console.error("Error fetching books:", error);
          return;
        }

        const booksWithCoverUrls = data.map((book) => {
          const coverUrl = supabase.storage
            .from("library")
            .getPublicUrl(book.cover_image_url.trim()).data.publicUrl;

          return {
            ...book,
            coverUrl,
          };
        });

        setBooks(booksWithCoverUrls);
      };

      fetchBooks();
    }, [])
  );

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("books_id, title, cover_image_url");

      if (error) {
        console.error("Error fetching books:", error);
        return;
      }

      const booksWithCoverUrls = data.map((book) => {
        const coverUrl = supabase.storage
          .from("library")
          .getPublicUrl(book.cover_image_url.trim()).data.publicUrl;

        return {
          ...book,
          coverUrl,
        };
      });

      setBooks(booksWithCoverUrls);
    };

    fetchBooks();
  }, []);

  const handleBookPress = (id) => {
    console.log(`Book ${id} clicked`);
    router.push(`../screens/about?id=${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.bookGrid}>
          {books.map((book) => (
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
  },
  scrollView: {
    padding: 10,
  },
  bookGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    margin: 20,
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
