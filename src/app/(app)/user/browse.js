import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const genres = ["Fiction", "Mystery", "Romance", "Fantasy", "Sci-Fi", "..."];
const recentlyBrowsed = Array.from({ length: 2 });

const Browse = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={height * 0.025} color="#333" />
        <TextInput
          placeholder="Search a book"
          placeholderTextColor="#666"
          style={styles.searchInput}
        />
      </View>

      <Text style={styles.sectionTitle}>Genres</Text>
      <View style={styles.genreContainer}>
        {genres.map((genre, index) => (
          <TouchableOpacity key={index} style={styles.genrePill}>
            <Text style={styles.genreText}>{genre}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Recently browse</Text>
      <View style={styles.recentContainer}>
        {recentlyBrowsed.map((_, index) => (
          <View key={index} style={styles.recentCard}>
            <View style={styles.lineDiagonal1} />
            <View style={styles.lineDiagonal2} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Browse;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A9DEFF",
    padding: width * 0.04,
  },
  content: {
    padding: width * 0.04,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.004,
    marginBottom: height * 0.02,
  },
  searchInput: {
    marginLeft: width * 0.02,
    fontSize: width * 0.04,
    flex: 1,
  },
  sectionTitle: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#000",
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: width * 0.02,
    marginBottom: height * 0.02,
  },
  genrePill: {
    backgroundColor: "#fff",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    borderRadius: width * 0.05,
    elevation: 2,
  },
  genreText: {
    fontSize: width * 0.035,
    color: "#000",
  },
  recentContainer: {
    marginTop: height * 0.02,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: width * 0.05,
  },
  recentCard: {
    width: width * 0.4,
    height: width * 0.5,
    backgroundColor: "#fff",
    borderRadius: width * 0.03,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  lineDiagonal1: {
    position: "absolute",
    width: "160%",
    height: height * 0.001,
    backgroundColor: "gray",
    transform: [{ rotate: "52deg" }],
  },
  lineDiagonal2: {
    position: "absolute",
    width: "160%",
    height: height * 0.001,
    backgroundColor: "gray",
    transform: [{ rotate: "-52deg" }],
  },
});
