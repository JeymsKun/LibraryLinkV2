import React, { useState, useEffect } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Image, TouchableOpacity, Text } from "react-native";

export default function UserLayout() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
      setTime(formattedTime);
    };

    updateTime(); // set initial time
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "index") {
            iconName = "library";
          } else if (route.name === "booking") {
            iconName = "calendar";
          } else if (route.name === "browse") {
            iconName = "search";
          } else if (route.name === "more") {
            iconName = "ellipsis-horizontal-circle";
          }

          return <Ionicons name={iconName} size={20} color={color} />;
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Library",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../../assets/library-official-logo.png")}
                style={{ width: 120, height: 30, marginRight: 10 }}
                resizeMode="contain"
              />
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                console.log("Icon pressed!");
              }}
            >
              <Image
                source={require("../../../assets/sort.png")}
                style={{ width: 30, height: 30, marginRight: 10 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          tabBarLabel: "Booking",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../../assets/library-logo.png")}
                style={{ width: 30, height: 30, marginRight: 10 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>Booking</Text>
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 14, marginRight: 10 }}>{time}</Text>
              <Image
                source={require("../../../assets/calendar-icon.png")}
                style={{ width: 28, height: 28, marginRight: 10 }}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          tabBarLabel: "Browse",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../../assets/library-logo.png")}
                style={{ width: 30, height: 30, marginRight: 10 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>Browse</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          tabBarLabel: "More",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../../assets/library-logo.png")}
                style={{ width: 30, height: 30, marginRight: 10 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>More</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
