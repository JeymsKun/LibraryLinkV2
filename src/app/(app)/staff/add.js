import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { setField, resetForm } from "../../../redux/slices/bookFormSlice";
import { useQuery } from "@tanstack/react-query";
import { fetchGenres } from "../../../queries/genres";
import { fetchStaffData } from "../../../queries/staff";
import { useAddBookMutation } from "../../../hooks/useAddBookMutation";

export default function AddBook() {
  const { mutate: uploadFiles } = useAddBookMutation();
  const {
    title,
    author,
    genre,
    genreId,
    isbn,
    publisher,
    publishedDate,
    copies,
    description,
    barcode,
    barcodeCode,
    coverImage,
    images,
  } = useSelector((state) => state.bookForm);
  const dispatch = useDispatch();
  const { userData } = useAuth();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDateSet, setIsDateSet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: staffData,
    error: staffError,
    refetch: refetchStaffData,
  } = useQuery({
    queryKey: ["staff", userData?.email],
    queryFn: () => fetchStaffData(userData?.email),
    enabled: !!userData?.email,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchStaffData();
    setRefreshing(false);
  };

  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (userData) {
      console.log("User  data:", userData);
    }
  }, [userData]);

  const handleSave = async () => {
    if (!title) {
      alert("Please fill in the required field: Title.");
      return;
    } else if (!author) {
      alert("Please fill in the required field: Author.");
      return;
    } else if (!genre) {
      alert("Please select a genre.");
      return;
    } else if (!copies) {
      alert("Please specify the number of copies.");
      return;
    } else if (!publisher) {
      alert("Please fill in the required field: Publisher.");
      return;
    } else if (!publishedDate) {
      alert("Please set the published date.");
      return;
    }

    try {
      if (!userData?.email) {
        alert("User not authenticated. Please log in.");
        return;
      }

      if (staffError) {
        alert("Failed to fetch staff data. Please try again.");
        console.error("Staff data error:", staffError);
        return;
      }

      if (!staffData?.staff_uuid) {
        alert("No matching staff record found for this email.");
        return;
      }

      const staffUuid = staffData.staff_uuid;

      uploadFiles(
        {
          coverImage,
          images,
          barcode,
        },
        {
          onSuccess: async ({ coverUrl, imageUrls }) => {
            console.log("Upload successful. Saving to database...");
            const { data: insertedBook, error: dbError } = await supabase
              .from("books")
              .insert([
                {
                  title,
                  author,
                  genre_id: genreId,
                  isbn,
                  publisher,
                  published_date: publishedDate
                    ? new Date(publishedDate).toISOString()
                    : null,
                  copies: parseInt(copies),
                  description,
                  barcode_code: barcodeCode,
                  cover_image_url: coverUrl,
                  image_urls: imageUrls,
                  staff_uuid: staffUuid,
                },
              ])
              .select();

            const bookId = insertedBook?.[0]?.books_id;

            if (bookId) {
              const { error: bookGenreError } = await supabase
                .from("book_genres")
                .insert([
                  {
                    books_id: bookId,
                    genre_id: genreId,
                  },
                ]);

              if (bookGenreError) {
                console.error("Error linking book to genre:", bookGenreError);
              }
            }

            if (dbError) {
              console.error("Error inserting book:", dbError);
              alert("Error saving book.");
              setIsUploading(false);
              return;
            }

            alert("Book added successfully!");
            handleClear();
          },
          onError: (error) => {
            console.error("Upload failed:", error);
            alert("Something went wrong while saving the book.");
          },
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong while saving the book.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    dispatch(resetForm());

    const code = isbn || generateFallbackBarcode();
    dispatch(setField({ field: "barcodeCode", value: code }));
    const url = getBarcodeUrl(code);
    dispatch(setField({ field: "barcode", value: url }));
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    alert("Barcode copied to clipboard!");
  };

  const downloadBarcode = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + "barcode.jpg";
      const downloadResumable = FileSystem.createDownloadResumable(
        barcode,
        fileUri
      );

      const { uri } = await downloadResumable.downloadAsync();

      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        console.log("Barcode file saved:", uri);
      } else {
        console.error("File not downloaded properly.");
      }

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        await MediaLibrary.saveToLibraryAsync(uri);
        alert("Barcode image saved to gallery!");
      } else {
        alert("Permission to access media library is required.");
      }
    } catch (error) {
      console.error("Error downloading barcode:", error);
    }
  };

  const generateFallbackBarcode = () => {
    const fallbackCode = `${
      title?.slice(0, 3)?.toUpperCase() || "BK"
    }-${Date.now()}`;
    return fallbackCode;
  };

  const getBarcodeUrl = (code) => {
    return `https://bwipjs-api.metafloor.com/?bcid=code128&text=${code}&scale=3&includetext&backgroundcolor=ffffff`;
  };

  useEffect(() => {
    const code = isbn || generateFallbackBarcode();
    dispatch(setField({ field: "barcodeCode", value: code }));
    const url = getBarcodeUrl(code);
    dispatch(setField({ field: "barcode", value: url }));
  }, [isbn, title, dispatch]);

  const openCameraForCover = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.Images,
      quality: 1,
    });

    if (!result.canceled) {
      dispatch(setField({ field: "coverImage", value: result.assets[0].uri })); // Update coverImage in Redux
    }
  };

  const openCameraForImages = async () => {
    if (images.length >= 5) {
      alert("You can only upload up to 5 images.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.Images,
      quality: 1,
    });

    if (!result.canceled) {
      dispatch(
        setField({
          field: "images",
          value: [...images, result.assets[0].uri],
        })
      );
    }
  };

  const pickCoverImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled) {
      dispatch(setField({ field: "coverImage", value: result.assets[0].uri }));
    }
  };

  const pickImages = async () => {
    if (images.length < 5) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => asset.uri);
        dispatch(
          setField({
            field: "images",
            value: [...images, ...selectedImages].slice(0, 5),
          })
        );
      }
    } else {
      alert("You can upload a maximum of 5 images.");
    }
  };

  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      dispatch(
        setField({ field: "publishedDate", value: selectedDate.toISOString() })
      );
      setIsDateSet(true);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Text style={styles.header}>
        Fill in the details to add a new book to the library collection.
      </Text>

      <Text style={styles.label}>Book Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={(text) =>
          dispatch(setField({ field: "title", value: text }))
        }
        placeholder="Enter book title"
      />

      <Text style={styles.label}>Author Name:</Text>
      <TextInput
        style={styles.input}
        value={author}
        onChangeText={(text) =>
          dispatch(setField({ field: "author", value: text }))
        }
        placeholder="Enter author name"
      />

      <Text style={styles.label}>Genre:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={genreId}
          onValueChange={(selectedId) => {
            const selectedGenre = genres.find((g) => g.genre_id === selectedId);
            dispatch(
              setField({ field: "genre", value: selectedGenre?.name || "" })
            );
            dispatch(setField({ field: "genreId", value: selectedId }));
          }}
        >
          <Picker.Item label="Select a genre" value="" />
          {genres.map((g) => (
            <Picker.Item key={g.genre_id} label={g.name} value={g.genre_id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>ISBN Number (optional):</Text>
      <TextInput
        style={styles.input}
        value={isbn}
        onChangeText={(text) =>
          dispatch(setField({ field: "isbn", value: text }))
        }
        placeholder="Enter ISBN number"
      />

      <Text style={styles.label}>Publisher:</Text>
      <TextInput
        style={styles.input}
        value={publisher}
        onChangeText={(text) =>
          dispatch(setField({ field: "publisher", value: text }))
        }
        placeholder="Enter publisher"
      />

      <Text style={styles.label}>Published Date:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text
          style={[styles.dateInput, { color: isDateSet ? "#000" : "#999" }]}
        >
          {isDateSet && publishedDate
            ? new Date(publishedDate).toDateString()
            : "Set Published Date"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={publishedDate ? new Date(publishedDate) : new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={styles.label}>Upload Book Cover:</Text>
      <TouchableOpacity
        style={styles.uploadCoverContainer}
        onPress={pickCoverImage}
        activeOpacity={0.9}
      >
        {coverImage ? (
          <>
            <Image
              source={{ uri: coverImage }}
              style={styles.coverPreviewBox}
            />
            <View style={styles.coverOverlayButtons}>
              <TouchableOpacity onPress={openCameraForCover}>
                <MaterialIcons name="photo-camera" size={22} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={pickCoverImage}>
                <MaterialIcons
                  name="add-photo-alternate"
                  size={22}
                  color="#333"
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.uploadContent}>
            <Image
              source={require("../../../assets/upload.png")}
              style={styles.uploadIcon}
              resizeMode="contain"
            />
            <Text style={styles.uploadButtonText}>Upload book cover</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Upload Book Image(s) (optional):</Text>
      <TouchableOpacity
        style={styles.uploadImagesContainer}
        onPress={pickImages}
        activeOpacity={0.9}
      >
        {images.length > 0 ? (
          <>
            <View style={styles.imageGallery}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageBox}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteImage(index)}
                  >
                    <MaterialIcons name="delete" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.imagesOverlayButtons}>
              <TouchableOpacity onPress={openCameraForImages}>
                <MaterialIcons name="photo-camera" size={22} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={pickImages}>
                <MaterialIcons
                  name="add-photo-alternate"
                  size={22}
                  color="#333"
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.uploadContent}>
            <Image
              source={require("../../../assets/upload.png")}
              style={styles.uploadIcon}
              resizeMode="contain"
            />
            <Text style={styles.uploadButtonText}>Upload book images</Text>
          </View>
        )}
      </TouchableOpacity>

      {barcode ? (
        <>
          <Text style={styles.label}>Generated Barcode:</Text>
          <View style={styles.barcodeContainer}>
            <Image
              source={{ uri: barcode }}
              style={{
                height: 80,
                width: 300,
                alignSelf: "center",
              }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.barcodeInputWrapper}>
            <TextInput
              style={styles.barcodeInput}
              value={barcodeCode}
              editable={false}
              selectTextOnFocus={false}
              placeholder="Barcode"
              placeholderTextColor="#999"
            />
            <View style={styles.barcodeIcons}>
              <TouchableOpacity onPress={() => copyToClipboard(barcodeCode)}>
                <MaterialIcons
                  name="content-copy"
                  size={22}
                  color="#666"
                  style={styles.iconSpacing}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={downloadBarcode}>
                <MaterialIcons name="file-download" size={22} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <Text style={{ textAlign: "center", color: "#999" }}>
          Barcode will be generated here.
        </Text>
      )}

      <Text style={styles.label}>Number of Copies:</Text>
      <TextInput
        style={styles.input}
        value={copies}
        onChangeText={(text) =>
          dispatch(setField({ field: "copies", value: text }))
        }
        placeholder="Enter number of copies"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Description (optional):</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={(text) =>
          dispatch(setField({ field: "description", value: text }))
        }
        placeholder="Add a short description..."
        multiline
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE BOOK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleClear}>
          <Text style={styles.cancelButtonText}>CLEAR</Text>
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
  imageGallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  imagePreview: {
    width: 50,
    height: 70,
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
  barcodeInputWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  barcodeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    paddingRight: 70,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  barcodeIcons: {
    position: "absolute",
    right: 10,
    top: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  iconSpacing: {
    marginRight: 10,
  },
  coverPreview: {
    width: 100,
    height: 150,
    resizeMode: "cover",
    alignSelf: "center",
    borderRadius: 5,
    marginBottom: 15,
  },
  barcodeContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 15,
    height: 100,
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  uploadImagesContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
    height: 100,
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  uploadCoverContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
    height: 100,
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  coverPreviewBox: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
    resizeMode: "contain",
  },
  coverOverlayButtons: {
    position: "absolute",
    right: 10,
    top: 10,
    flexDirection: "row",
    gap: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 5,
    borderRadius: 8,
  },
  imagesOverlayButtons: {
    position: "absolute",
    right: 5,
    top: 10,
    gap: 15,
    padding: 5,
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 15,
    padding: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    height: 40,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});
