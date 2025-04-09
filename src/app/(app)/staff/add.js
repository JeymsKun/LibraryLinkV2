// app/(app)/staff/add_book.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publishedDate, setPublishedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [copies, setCopies] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleSave = () => {
    console.log({
      title,
      author,
      genre,
      isbn,
      publisher,
      publishedDate,
      image,
      copies,
    });
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPublishedDate(selectedDate);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>
        Fill in the details to add a new book to the library collection.
      </Text>

      <Text style={styles.label}>Book Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter book title"
      />

      <Text style={styles.label}>Author Name:</Text>
      <TextInput
        style={styles.input}
        value={author}
        onChangeText={setAuthor}
        placeholder="Enter author name"
      />

      <Text style={styles.label}>Category/Genre:</Text>
      <Picker
        selectedValue={genre}
        onValueChange={(itemValue) => setGenre(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a genre" value="" />
        <Picker.Item label="Fiction" value="fiction" />
        <Picker.Item label="Non-Fiction" value="non-fiction" />
        <Picker.Item label="Science" value="science" />
        <Picker.Item label="History" value="history" />
      </Picker>

      <Text style={styles.label}>ISBN Number (optional):</Text>
      <TextInput
        style={styles.input}
        value={isbn}
        onChangeText={setIsbn}
        placeholder="Enter ISBN number"
      />

      <Text style={styles.label}>Publisher:</Text>
      <TextInput
        style={styles.input}
        value={publisher}
        onChangeText={setPublisher}
        placeholder="Enter publisher"
      />

      <Text style={styles.label}>Published Date:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateInput}>{publishedDate.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={publishedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={styles.label}>Book Cover Upload (optional):</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <View style={styles.uploadContent}>
          <Image
            source={require("../../../assets/upload.png")}
            style={styles.uploadIcon}
            resizeMode="contain"
          />
          <Text style={styles.uploadButtonText}>Upload image input</Text>
        </View>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <Text style={styles.label}>Number of Copies:</Text>
      <TextInput
        style={styles.input}
        value={copies}
        onChangeText={setCopies}
        placeholder="Enter number of copies"
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE BOOK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(169, 222, 255, 0.4)",
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  uploadButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  uploadContent: {
    alignItems: "center",
  },
  uploadIcon: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: "gray",
    fontSize: 14,
    textAlign: "center",
  },
  imagePreview: {
    width: 50,
    height: 50,
    marginBottom: 15,
    alignSelf: "center",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#F8B919",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  saveButtonText: {
    color: "black",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#B3B3B3",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    flex: 1,
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
});
