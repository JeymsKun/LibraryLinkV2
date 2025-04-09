import React, { useRef, useEffect } from "react";
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
} from "react-native";
import { CameraView } from "expo-camera";

const { width, height } = Dimensions.get("window");

export default function qrScan() {
  const scanLineAnimation = useRef(new Animated.Value(0)).current;

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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.instructionText}>
            Align the barcode within the frame to scan.
          </Text>

          <CameraView
            style={styles.camStyle}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: "qr",
            }}
            onBarcodeScanned={({ data }) => {
              console.log(data);
            }}
          >
            {/* Overlay for corner markers */}
            <View style={styles.overlay}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            {/* Scanning line */}
            <Animated.View
              style={[styles.scanLine, { transform: [{ translateY }] }]}
            />
          </CameraView>

          {/* Row with text and Line */}
          <View style={styles.manualInputRow}>
            <Text style={styles.manualInputText}>Enter barcode manually:</Text>
            <View style={{ flex: 1, position: "relative" }}>
              <TextInput
                style={styles.input}
                placeholder=""
                keyboardType="default"
              />
              <View style={styles.line} />
            </View>
          </View>

          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
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
});
