import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBooking } from "../../../context/BookingContext";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabase";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function BookCard() {
  const { userData } = useAuth();
  const { bookings } = useBooking();
  const [lastBookedTitle, setLastBookedTitle] = useState("");
  const [selectedDays, setSelectedDays] = useState("1");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isSuccessVisible, setSuccessVisible] = useState(false);

  const days = [...Array(6).keys()].map((i) => `${i + 1}`);

  useFocusEffect(
    useCallback(() => {
      const loadBookings = async () => {
        const { data: userInfo, error } = await supabase
          .from("users")
          .select("user_id")
          .eq("email", userData?.email)
          .single();

        if (userInfo) {
          await fetchBookings(userInfo.user_id);
        }
      };

      loadBookings();
    }, [userData?.email])
  );

  const handleConfirmBooking = async (book) => {
    try {
      if (!userData?.email) {
        alert("User not authenticated. Please log in.");
        return;
      }

      const { data: userInfo, error: getUserError } = await supabase
        .from("users")
        .select("user_id")
        .eq("email", userData.email)
        .single();

      if (getUserError || !userInfo) {
        console.error("User lookup error: ", getUserError);
        alert("No matching user record found for this email.");
        return;
      }

      const userId = userInfo.user_id;
      console.log("Using user ID from email lookup:", userId);

      const { error: bookingError } = await supabase.from("user_books").insert([
        {
          user_id: userId,
          books_id: book.books_id,
          days: parseInt(selectedDays),
          booking_date: new Date(),
          status: "booked",
        },
      ]);

      if (bookingError) {
        throw new Error(bookingError.message);
      }

      setSuccessVisible(true);
      setLastBookedTitle(book.title);
    } catch (error) {
      console.error("Error booking the book:", error.message);
    }
  };

  const handleSelectDay = (day) => {
    setSelectedDays(day);
    setPickerVisible(false);
  };

  const closeSuccessMessage = () => {
    setSuccessVisible(false);
  };

  return (
    <View style={styles.container}>
      {bookings.length === 0 ? (
        <Text style={{ fontSize: 16, fontStyle: "italic", marginTop: 20 }}>
          You don’t have any bookings right now.
        </Text>
      ) : (
        bookings.map((book) => (
          <View key={book.books_id} style={styles.card}>
            <View style={styles.imagePlaceholder}>
              <Image
                source={{
                  uri: supabase.storage
                    .from("library")
                    .getPublicUrl(book.cover_image_url.trim()).data.publicUrl,
                }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={styles.bookDetails}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.author}>{book.author}</Text>

              <View style={styles.row}>
                <Text style={styles.label}>Select days</Text>
                <TouchableOpacity
                  style={styles.pickerWrapper}
                  onPress={() => setPickerVisible(true)}
                >
                  <Text style={styles.pickerText}>{selectedDays}</Text>
                </TouchableOpacity>
                <Text style={styles.maxText}>(max. 6 days)</Text>
              </View>

              <Text style={styles.moreInfo}>More Information:</Text>
              <Text style={styles.moreInfo}>{book.description}</Text>
              <View style={styles.underline} />
            </View>

            <Modal
              visible={isPickerVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setPickerVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={days}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => handleSelectDay(item)}
                      >
                        <Text style={styles.modalItemText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </Modal>
          </View>
        ))
      )}

      {bookings.length > 0 && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => handleConfirmBooking(bookings[0])}
        >
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={isSuccessVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeSuccessMessage}
      >
        <View style={styles.successOverlay}>
          <View style={styles.successBox}>
            <Text style={styles.successText}>
              <Text style={styles.successBold}>Success!</Text> You have booked{" "}
              <Text style={styles.successItalic}>"{lastBookedTitle}"</Text>.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeSuccessMessage}
            >
              <Ionicons name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A9DEFF",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: height * 0.02,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#F8B919",
    borderRadius: 16,
    padding: width * 0.04,
    margin: width * 0.05,
    alignItems: "center",
    width: width * 0.9,
  },
  imagePlaceholder: {
    width: width * 0.2,
    height: height * 0.15,
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width * 0.04,
    borderWidth: 1,
    borderColor: "#000",
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  lineDiagonal1: {
    position: "absolute",
    width: "170%",
    height: 1,
    backgroundColor: "gray",
    transform: [{ rotate: "58deg" }],
  },
  lineDiagonal2: {
    position: "absolute",
    width: "170%",
    height: 1,
    backgroundColor: "gray",
    transform: [{ rotate: "-58deg" }],
  },
  bookDetails: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
  author: {
    fontSize: width * 0.04,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
    flexWrap: "wrap",
  },
  label: {
    marginRight: width * 0.01,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 4,
    marginHorizontal: width * 0.02,
    width: width * 0.15,
    height: height * 0.025,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  pickerText: {
    fontSize: width * 0.035,
    color: "#000",
  },
  maxText: {
    fontSize: width * 0.03,
    marginLeft: width * 0.02,
  },
  moreInfo: {
    fontSize: width * 0.035,
  },
  underline: {
    height: 1,
    backgroundColor: "#000",
    marginTop: height * 0.005,
    width: "100%",
  },
  confirmButton: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "#F8B919",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: "center",
    elevation: 2,
  },
  confirmButtonText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "80%",
    padding: width * 0.05,
  },
  modalItem: {
    paddingVertical: height * 0.015,
  },
  modalItemText: {
    fontSize: width * 0.04,
    textAlign: "center",
  },
  successOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    padding: width * 0.05,
    width: "80%",
    height: height * 0.12,
    justifyContent: "center",
    position: "relative",
  },
  successText: {
    fontSize: width * 0.04,
    color: "#000",
  },
  successBold: {
    fontWeight: "bold",
  },
  successItalic: {
    fontStyle: "italic",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  closeButton: {
    position: "absolute",
    top: height * 0.01,
    right: width * 0.02,
  },
});
