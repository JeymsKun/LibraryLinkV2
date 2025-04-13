import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";

export default function LogoutScreen() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();

      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 200);
    };

    logout();
  }, []);

  return null;
}
