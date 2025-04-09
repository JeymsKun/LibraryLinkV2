import React, { useEffect } from "react";
import { useRouter } from "expo-router";

export default function LogoutScreen() {
  const router = useRouter();

  useEffect(() => {
    // Clear authentication tokens or user data here
    // Example: AsyncStorage.removeItem('auth_token');

    router.push("/(auth)/login"); // Redirect to login screen
  }, []);

  return null;
}
