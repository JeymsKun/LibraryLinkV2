import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";

const { width, height } = Dimensions.get("window");

export default function MoreSettings() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option}>
        <Ionicons name="settings" size={height * 0.03} color="#000" />
        <Text style={styles.optionText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Ionicons name="help-circle" size={height * 0.03} color="#000" />
        <Text style={styles.optionText}>Help</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Ionicons name="information-circle" size={height * 0.03} color="#000" />
        <Text style={styles.optionText}>About</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error("Error logging out:", error.message);
            return;
          }
          router.replace("/(auth)/login/");
        }}
      >
        <Ionicons name="log-out" size={height * 0.03} color="#000" />
        <Text style={styles.optionText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A9DEFF",
    padding: width * 0.05,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  optionText: {
    fontSize: width * 0.041,
    fontWeight: "500",
    marginLeft: width * 0.03,
    color: "#000",
  },
});
