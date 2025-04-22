import React, { useRef, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import { CameraView } from "expo-camera";
import { useQuery } from "@tanstack/react-query";
import { fetchBookInfo } from "../../../queries/bookInfo";

const { width, height } = Dimensions.get("window");

export default function BarcodeScan() {
  const [showBookInfo, setShowBookInfo] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const scanLineAnimation = useRef(new Animated.Value(0)).current;
  const manualInputRef = useRef(null);
  const [scanning, setScanning] = useState(true);
  const [barcode, setBarcode] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    if (isError) {
      setErrorVisible(true);
      const timer = setTimeout(() => {
        setErrorVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isError]);

  const {
    data: bookInfo,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["bookInfo", barcode],
    queryFn: () => fetchBookInfo(barcode),
    enabled: !!barcode,
    onError: (error) => {
      console.error(error.message);
      setErrorVisible(true);
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);

    setBarcode("");
    setManualBarcode("");
    setScanning(true);
    setShowBookInfo(false);

    await refetch();

    setRefreshing(false);
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scanLineAnimation]);

  const translateY = scanLineAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height * 0.4],
  });

  const handleBarcodeScanned = (data) => {
    if (scanning) {
      setScanning(false);
      setBarcode(data);
    }
  };

  const handleManualInput = () => {
    if (manualBarcode.trim()) {
      setBarcode(manualBarcode);
      refetch();
    } else {
      console.log("No barcode entered");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <SafeAreaView style={styles.container}>
          <Text style={styles.instructionText}>
            Align the barcode within the frame to scan.
          </Text>

          <CameraView
            style={styles.camStyle}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: [
                "ean13",
                "ean8",
                "upc_a",
                "upc_e",
                "code128",
                "code39",
                "itf",
                "codabar",
              ],
            }}
            onBarcodeScanned={({ data }) => handleBarcodeScanned(data)}
          >
            <View style={styles.overlay}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            <Animated.View
              style={[styles.scanLine, { transform: [{ translateY }] }]}
            />
          </CameraView>

          <View style={styles.manualInputRow}>
            <Text style={styles.manualInputText}>Enter barcode manually:</Text>
            <View style={{ flex: 1, position: "relative" }}>
              <TextInput
                style={styles.input}
                value={manualBarcode}
                onChangeText={setManualBarcode}
                placeholder=""
                keyboardType="default"
              />
              <View style={styles.line} />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.cancelButton,
              { backgroundColor: manualBarcode ? "#F8B919" : "#B3B3B3" },
            ]}
            onPress={() => {
              if (manualBarcode.trim()) {
                handleManualInput();
              } else {
                setBarcode("");
                setManualBarcode("");
                setScanning(true);
                setShowBookInfo(false);
                if (manualInputRef.current) {
                  manualInputRef.current.clear();
                }
              }
            }}
          >
            <Text style={styles.cancelButtonText}>
              {manualBarcode ? "Enter" : "CANCEL"}
            </Text>
          </TouchableOpacity>

          {errorVisible && (
            <Text style={styles.errorText}>
              This book could not be found in the system.
            </Text>
          )}

          {bookInfo && (
            <TouchableOpacity
              style={styles.viewInfoButton}
              onPress={() => setShowBookInfo(!showBookInfo)}
            >
              <Text style={styles.viewInfoButtonText}>
                {showBookInfo ? "Hide Book Info" : "View Book Info"}
              </Text>
            </TouchableOpacity>
          )}

          {showBookInfo && bookInfo ? (
            <View style={styles.bookInfoContainer}>
              {bookInfo.coverUrl && (
                <View style={{ padding: 10, alignItems: "center" }}>
                  <Image
                    key={bookInfo.coverUrl}
                    source={{ uri: bookInfo.coverUrl }}
                    style={{
                      width: 200,
                      height: 300,
                      resizeMode: "cover",
                    }}
                  />
                </View>
              )}
              <View style={{ padding: 10 }}>
                <Text style={styles.bookTitle}>{bookInfo.title}</Text>
                <Text style={styles.bookAuthor}>By: {bookInfo.author}</Text>
                <Text style={styles.bookDetails}>Genre: {bookInfo.genre}</Text>

                {bookInfo.isbn && (
                  <Text style={styles.bookDetails}>ISBN: {bookInfo.isbn}</Text>
                )}

                <Text style={styles.bookDetails}>
                  Published: {new Date(bookInfo.published_date).toDateString()}
                </Text>
                <Text style={styles.bookDescription}>
                  {bookInfo.description}
                </Text>
              </View>
            </View>
          ) : null}
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(169, 222, 255, 0.4)",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: height * 0.05,
  },
  camStyle: {
    width: width * 0.8,
    height: height * 0.4,
    marginTop: height * 0.02,
    borderWidth: 2,
    borderColor: "gray",
  },
  instructionText: {
    fontSize: width * 0.047,
    marginBottom: height * 0.01,
    color: "#000",
    textAlign: "center",
  },
  bookInfoContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    margin: height * 0.05,
  },
  bookTitle: {
    fontSize: width * 0.05,
    marginVertical: height * 0.03,
    textAlign: "center",
    fontWeight: "bold",
    color: "#000",
  },
  bookAuthor: {
    fontSize: width * 0.04,
    fontStyle: "italic",
    color: "#333",
  },
  bookDetails: {
    fontSize: width * 0.04,
    color: "#555",
  },
  bookDescription: {
    fontSize: width * 0.04,
    color: "#444",
    marginTop: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  manualInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.04,
    width: "70%",
  },
  manualInputText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    fontWeight: "bold",
    fontSize: width * 0.04,
    color: "#000",
  },
  line: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#000",
  },
  cancelButton: {
    marginTop: height * 0.04,
    backgroundColor: "#B3B3B3",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.05,
  },
  cancelButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: width * 0.04,
  },
  viewInfoButton: {
    marginTop: height * 0.02,
    backgroundColor: "#0078D7",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: width * 0.05,
  },
  viewInfoButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: width * 0.04,
  },
  overlay: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  corner: {
    position: "absolute",
    width: width * 0.08,
    height: width * 0.08,
    borderColor: "gray",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  scanLine: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: "gray",
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    fontSize: width * 0.04,
    textAlign: "center",
    marginTop: height * 0.02,
  },
});
