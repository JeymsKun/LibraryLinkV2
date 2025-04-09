import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width, height } = Dimensions.get("window");

export default function AboutBook() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const books = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    title: `BOOK TITLE`,
    description: `Description of Book.
Including its availability.`,
  }));

  return (
    <View style={styles.container}>
      <Carousel
        width={width}
        height={height * 0.45}
        data={books}
        scrollAnimationDuration={500}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ item }) => (
          <View style={styles.bookContainer}>
            <View style={styles.cross}>
              <View style={styles.crossLine1} />
              <View style={styles.crossLine2} />
            </View>
          </View>
        )}
      />

      <View style={styles.pagination}>
        {books.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      <Text style={styles.bookTitle}>{books[currentIndex].title}</Text>
      <Text style={styles.bookDescription}>
        {books[currentIndex].description}
      </Text>

      {/* Add to Booking Card Button */}
      <TouchableOpacity style={styles.bookingButton}>
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
  bookContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: width * 0.6,
    height: height * 0.4,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: "center",
  },
  cross: {
    position: "relative",
    width: "160%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  crossLine1: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "gray",
    transform: [{ rotate: "55deg" }],
  },
  crossLine2: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "gray",
    transform: [{ rotate: "-55deg" }],
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  bookTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: height * 0.02,
  },
  bookDescription: {
    fontSize: width * 0.04,
    color: "#333",
    margin: height * 0.01,
    paddingHorizontal: width * 0.1,
  },
  bookingButton: {
    position: "absolute",
    bottom: height * 0.05,
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
});
