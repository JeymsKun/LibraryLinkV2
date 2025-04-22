import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { StatusBar } from "expo-status-bar";
import { SupabaseProvider } from "../context/SupabaseProvider";
import { BookingProvider } from "../context/BookingContext";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "../redux/store";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SupabaseProvider>
            <BookingProvider>
              <StatusBar style="auto" />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: "#f5f5f5" },
                  animation: "slide_from_right",
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen
                  name="(auth)"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="(app)"
                  options={{
                    headerShown: false,
                    gestureEnabled: false,
                  }}
                />
              </Stack>
            </BookingProvider>
          </SupabaseProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}
