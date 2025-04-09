// src/app/index.js
import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";

// This is your app's entry point
export default function Index() {
  const { isAuthenticated, isLoading, userRole } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Redirect based on authentication state
  // If authenticated, go to appropriate dashboard based on user role
  if (isAuthenticated) {
    if (userRole === "staff") {
      return <Redirect href="/staff" />;
    } else {
      return <Redirect href="/user" />;
    }
  }

  // If not authenticated, go to login options screen
  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
