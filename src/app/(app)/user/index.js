import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function UserDashboard() {
  const router = useRouter();

  const handleBookPress = (id) => {
    console.log(`Book container ${id} clicked!`);
    router.push("../screens/about");
  };

  const bookContainers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.bookGrid}>
          {bookContainers.map((id) => (
            <TouchableOpacity
              key={id}
              style={styles.bookContainer}
              onPress={() => handleBookPress(id)}
            >
              <View style={styles.cross}>
                <View style={styles.crossLine1} />
                <View style={styles.crossLine2} />
              </View>
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
    aspectRatio: 0.7,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  cross: {
    position: "relative",
    width: "170%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  crossLine1: {
    position: "absolute",
    width: "100%",
    bottom: 100,
    height: 1,
    backgroundColor: "gray",
    transform: [{ rotate: "56deg" }],
  },
  crossLine2: {
    position: "absolute",
    width: "100%",
    top: 104,
    height: 1,
    backgroundColor: "gray",
    transform: [{ rotate: "-55deg" }],
  },
});
