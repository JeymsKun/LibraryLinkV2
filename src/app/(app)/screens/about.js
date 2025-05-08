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
    <View style={styles.container}>
      <Carousel
        width={width}
        height={height * 0.45}
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookInfo}>Author: {book.author}</Text>
        <Text style={styles.bookInfo}>Publisher: {book.publisher}</Text>
        <Text style={styles.bookInfo}>
          Published Date: {book.published_date}
        </Text>
        <Text style={styles.bookInfo}>Total Copies: {book.total_copies}</Text>
        <Text style={styles.bookDescription}>{book.description}</Text>
        {barcodeImageUrl && (
          <View style={styles.barcodeContainer}>
            <Text style={styles.barcodeLabel}>Barcode Image:</Text>
            <Image
              source={barcodeImageUrl}
              style={styles.barcodeImage}
              resizeMode="contain"
            />
          </View>
        )}
        <View style={{ height: 80 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.bookingButton}
        onPress={() => addBooking(book)}
      >
        <Text style={styles.bookingButtonText}>Add to Booking Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A9DEFF",
    paddingTop: height * 0.05,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A9DEFF",
  },
  bookContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: width * 0.7,
    height: height * 0.4,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: "center",
    overflow: "hidden",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#3b82f6",
  },
  scrollContent: {
    paddingBottom: 100,
    alignItems: "center",
  },
  bookTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: height * 0.02,
  },
  bookInfo: {
    fontSize: width * 0.04,
    color: "#333",
    marginVertical: height * 0.005,
    textAlign: "center",
  },
  bookDescription: {
    fontSize: width * 0.04,
    color: "#333",
    margin: height * 0.01,
    paddingHorizontal: width * 0.1,
    textAlign: "center",
  },
  bookingButton: {
    position: "absolute",
    bottom: height * 0.03,
    backgroundColor: "#F8B919",
    borderRadius: 15,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    alignItems: "center",
  },
  bookingButtonText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#000",
  },
  barcodeContainer: {
    marginTop: height * 0.02,
    alignItems: "center",
  },
  barcodeLabel: {
    fontSize: width * 0.04,
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  barcodeImage: {
    width: width * 0.6,
    height: width * 0.2,
    borderRadius: 12,
  },
});
