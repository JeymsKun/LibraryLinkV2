import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'staff' or 'user'
  const [userData, setUserData] = useState(null);

  // Check for stored authentication on app load
  useEffect(() => {
    async function loadStoredAuth() {
      try {
        // Load authentication data from secure storage
        const authDataStr = await SecureStore.getItemAsync("authData");

        if (authDataStr) {
          const authData = JSON.parse(authDataStr);

          // Validate token or refresh if needed
          // ...

          setIsAuthenticated(true);
          setUserRole(authData.role);
          setUserData(authData.user);
        }
      } catch (error) {
        console.log("Failed to load auth data", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredAuth();
  }, []);

  // Login function
  const login = async (credentials, role) => {
    setIsLoading(true);

    try {
      // Call your API here
      // const response = await fetch('your-api-endpoint', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(credentials),
      // });
      // const data = await response.json();

      // For demo purposes, simulate successful login
      const fakeAuthData = {
        token: "fake-jwt-token",
        role: role, // 'staff' or 'user'
        user: { id: "123", name: "Test User", email: credentials.email },
      };

      // Store auth data securely
      await SecureStore.setItemAsync("authData", JSON.stringify(fakeAuthData));

      setIsAuthenticated(true);
      setUserRole(fakeAuthData.role);
      setUserData(fakeAuthData.user);

      return { success: true };
    } catch (error) {
      console.log("Login error", error);
      return { success: false, error: "Invalid credentials" };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("authData");
      setIsAuthenticated(false);
      setUserRole(null);
      setUserData(null);
    } catch (error) {
      console.log("Logout error", error);
    }
  };

  // signup function
  const signup = async (userData) => {
    setIsLoading(true);

    try {
      // Call your API here for registration
      // const response = await fetch('your-signup-endpoint', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userData),
      // });
      // const data = await response.json();

      // For demo purposes, simulate successful registration
      return { success: true };
    } catch (error) {
      console.log("Signup error", error);
      return { success: false, error: "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userRole,
        userData,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
