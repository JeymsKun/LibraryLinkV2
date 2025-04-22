import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

const fetchUserRecord = async (email) => {
  try {
    const { data: userRecord, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user_id from users table:", error);
      return null;
    }

    if (userRecord && userRecord.user_id) {
      return userRecord.user_id;
    } else {
      console.warn("User record or user_id is missing:", userRecord);
      return null;
    }
  } catch (err) {
    console.error("Unexpected error fetching user record:", err);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const authData = {
          token: session.access_token,
          user: session.user,
        };

        await SecureStore.setItemAsync("authData", JSON.stringify(authData));
        setIsAuthenticated(true);
        setUserData(session.user);

        const fetchedUserId = await fetchUserRecord(session.user.email);
        setUserId(fetchedUserId);
      } else {
        const authDataStr = await SecureStore.getItemAsync("authData");
        if (authDataStr) {
          const authData = JSON.parse(authDataStr);
          setIsAuthenticated(true);
          setUserData(authData.user);

          const fetchedUserId = await fetchUserRecord(authData.user.email);
          setUserId(fetchedUserId);
        }
      }
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          const authData = {
            token: session.access_token,
            user: session.user,
          };

          await SecureStore.setItemAsync("authData", JSON.stringify(authData));
          setIsAuthenticated(true);
          setUserData(session.user);

          const fetchedUserId = await fetchUserRecord(session.user.email);
          setUserId(fetchedUserId);
        } else {
          await SecureStore.deleteItemAsync("authData");
          setIsAuthenticated(false);
          setUserData(null);
          setUserId(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const loginStaff = async (credentials) => {
    try {
      const parsedStaffId = parseInt(credentials.staffId, 10);
      if (isNaN(parsedStaffId)) {
        return { success: false, error: "Invalid staff ID format" };
      }

      const { data, error: fetchError } = await supabase
        .from("staff")
        .select("*")
        .eq("staff_id", parsedStaffId)
        .single();

      if (fetchError || !data) {
        return { success: false, error: "Staff ID not found." };
      }

      const { email } = data;

      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password: credentials.password,
        });

      if (loginError) {
        return { success: false, error: loginError.message };
      }

      const authData = {
        token: loginData.session.access_token,
        user: loginData.user,
      };

      await SecureStore.setItemAsync("authData", JSON.stringify(authData));

      setIsAuthenticated(true);
      setUserData(loginData.user);

      const fetchedUserId = await fetchUserRecord(loginData.user.email);
      setUserId(fetchedUserId);

      return { success: true };
    } catch (error) {
      console.log("Unexpected Error:", error);
      return { success: false, error: "Something went wrong during login" };
    }
  };

  const loginUser = async ({ email, password }) => {
    try {
      if (!email || !password) {
        return { success: false, error: "Email and password are required." };
      }

      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        return { success: false, error: loginError.message };
      }

      const authData = {
        token: loginData.session.access_token,
        user: loginData.user,
      };

      await SecureStore.setItemAsync("authData", JSON.stringify(authData));
      setIsAuthenticated(true);
      setUserData(loginData.user);

      const fetchedUserId = await fetchUserRecord(loginData.user.email);
      setUserId(fetchedUserId);

      return { success: true };
    } catch (error) {
      console.log("Login error", error);
      return { success: false, error: "Unexpected error occurred." };
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("authData");
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUserData(null);
      setUserId(null);
    } catch (error) {
      console.log("Logout error", error);
    }
  };

  const signup = async ({ email, password, idNumber, fullName }) => {
    try {
      const { data: existingUser, error: userError } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (userError) {
        return { success: false, error: userError.message };
      }

      if (existingUser) {
        return { success: false, error: "Email already exists." };
      }

      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) {
        return { success: false, error: signupError.message };
      }

      const { error: insertError } = await supabase.from("users").insert([
        {
          email,
          id_number: idNumber,
          full_name: fullName,
        },
      ]);

      if (insertError) {
        return { success: false, error: insertError.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Signup Error:", error);
      return {
        success: false,
        error: "Unexpected error occurred during signup.",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userData,
        userId,
        loginStaff,
        loginUser,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
