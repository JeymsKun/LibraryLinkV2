import React from "react";
import { Stack } from "expo-router";
import { TouchableOpacity, Image, View } from "react-native";

export default function UserLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: "#000",
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="about"
        options={{
          headerTitle: "About This Book",
          headerRight: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
            >
              <TouchableOpacity
                onPress={() => {
                  console.log("Icon pressed!");
                }}
              >
                <Image
                  source={require("../../../assets/heart.png")}
                  style={{ width: 25, height: 25 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  console.log("Icon pressed!");
                }}
              >
                <Image
                  source={require("../../../assets/cart.png")}
                  style={{ width: 25, height: 25 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Stack>
  );
}
