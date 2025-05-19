import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { useBooking } from "../../../context/BookingContext";

const { width, height } = Dimensions.get("window");

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const BUCKET_NAME = "library";

const makePublicUrl = (path) =>
  `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${path}`;

export default function AboutBook() {
  const { id } = useLocalSearchParams();
  const { addBooking } = useBooking();
  const [book, setBook] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("books_id", id)
        .single();

      if (error) {
        console.error("Error fetching book:", error);
      } else {
        console.log("Fetched book:", data);
        setBook(data);
      }

      setLoading(false);
    };

    fetchBook();
  }, [id]);

  const images = book
    ? [
        makePublicUrl(book.cover_image_url),
        ...(book.image_urls || []).map(makePublicUrl),
      ].filter(Boolean)
    : [];

  const barcodeImageUrl = book ? makePublicUrl(book.barcode_url) : null;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Loading book details...</Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Book not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.carouselContainer}>
          <Carousel
            width={width * 0.6}
            height={width * 0.6 * 1.5}
            data={images}
            scrollAnimationDuration={500}
            onSnapToItem={(index) => setCurrentIndex(index)}
            renderItem={({ item }) => (
              <View style={styles.bookContainer}>
                <Image
                  source={{ uri: item }}
                  style={{ width: "100%", height: "100%", borderRadius: 12 }}
                  resizeMode="cover"
                />
              </View>
            )}
          />

          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, currentIndex === index && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        <View style={styles.mainDetailsContainer}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <View style={styles.divider} />

          <Text style={styles.bookInfo}>
            <Text style={styles.boldLabel}>Author: </Text>
            {book.author}
          </Text>

          <Text style={styles.bookInfo}>
            <Text style={styles.boldLabel}>Publisher: </Text>
            {book.publisher}
          </Text>

          <Text style={styles.bookInfo}>
            <Text style={styles.boldLabel}>Published Date: </Text>
            {new Date(book.published_date).toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>

          <Text style={styles.bookInfo}>
            <Text style={styles.boldLabel}>Total Copies: </Text>
            {book.copies}
          </Text>

          <Text style={styles.bookDescription}>{book.description}</Text>

          {barcodeImageUrl && (
            <View style={styles.barcodeContainer}>
              <Text style={styles.barcodeLabel}>Barcode:</Text>
              <Image
                source={{ uri: barcodeImageUrl }}
                style={styles.barcodeImage}
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() => addBooking(book)}
        >
          <Text style={styles.bookingButtonText}>Add to Booking Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  carouselContainer: {
    width: width * 0.6,
    aspectRatio: 2 / 3,
    alignSelf: "center",
    marginBottom: 30,
  },
  bookContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#000",
  },
  mainDetailsContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 24,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 12,
    width: "100%",
  },
  bookInfo: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  boldLabel: {
    fontWeight: "bold",
  },
  bookDescription: {
    fontSize: 16,
    color: "#444",
    marginTop: 12,
    lineHeight: 22,
  },
  barcodeContainer: {
    margin: 10,
    alignItems: "center",
  },
  barcodeLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  barcodeImage: {
    width: 200,
    height: 80,
  },
  bookingButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
  },
  bookingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
