import React from "react";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { View, Image, Text } from "react-native";

export default function StaffLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerType: "front",
        headerShown: true,
        drawerStyle: {
          backgroundColor: "#0078D7",
          width: 240,
        },
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#e0e0e0",
        drawerItemStyle: {
          marginVertical: 4,
          borderRadius: 10,
          paddingLeft: 10,
        },
        drawerLabelStyle: {
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../../assets/library-logo.png")}
                style={{ width: 30, height: 30, marginRight: 10 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Dashboard
              </Text>
            </View>
          ),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="add"
        options={{
          title: "Add Book",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../../assets/library-logo.png")}
                style={{ width: 30, height: 30, marginRight: 10 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Add New Book
              </Text>
            </View>
          ),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="scan"
        options={{
          title: "Scan Barcode",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../../assets/library-logo.png")}
                style={{ width: 30, height: 30, marginRight: 10 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Scan Barcode
              </Text>
            </View>
          ),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="barcode-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="transaction"
        options={{
          title: "Transaction",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../../assets/library-logo.png")}
                style={{ width: 30, height: 30, marginRight: 10 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Transaction
              </Text>
            </View>
          ),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="logout"
        options={{
          title: "Log Out",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
