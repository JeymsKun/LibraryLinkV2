import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

export default function LibraryUserSignup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const handleRegister = async () => {
    if (!username || !password || !idNumber) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(
        { email: username, password, idNumber },
        "user"
      );
      if (!result.success) {
        Alert.alert("Signup Failed", result.error || "Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#3b82f6" />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.logoContainer,
            { display: keyboardVisible ? "none" : "flex" },
          ]}
        >
          <Image
            source={require("../../assets/library-text.png")}
            style={styles.logoText}
            resizeMode="contain"
          />
          <Image
            source={require("../../assets/library-logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {keyboardVisible ? (
          <View style={styles.logoOfficialContainer}>
            <Image
              source={require("../../assets/library-official-logo.png")}
              style={styles.logoOfficial}
              resizeMode="contain"
            />
          </View>
        ) : null}

        <View style={[styles.formContainer, { flex: keyboardVisible ? 0 : 1 }]}>
          <View style={styles.inputWrapper}>
            {/* Username */}
            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-outline" size={20} color="#777" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#777" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={styles.passwordIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#777"
                />
              </TouchableOpacity>
            </View>

            {/* ID Number */}
            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="card-outline" size={20} color="#777" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="ID Number"
                value={idNumber}
                onChangeText={setIdNumber}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            disabled={isLoading}
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
    padding: 24,
  },
  backButton: {
    padding: 10,
    marginTop: 10,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    width: 170,
    height: 60,
    marginBottom: 10,
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  logoOfficial: {
    width: 200,
    height: 150,
  },
  formContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
  },
  inputContainer: {
    position: "relative",
    marginBottom: 14,
  },
  logoOfficialContainer: {
    marginVertical: -10,
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    left: 12,
    top: 14,
    zIndex: 1,
  },
  passwordIcon: {
    position: "absolute",
    right: 12,
    top: 14,
    zIndex: 1,
  },
  input: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 50,
    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 25,
    width: "80%",
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
