import { createContext, useContext, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useApp } from "./AppContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const app = useApp();
  const [session, setSession] = useLocalStorage("school_stock_session", {
    isAuthenticated: false,
    userId: null,
    rememberMe: false,
  });

  const login = (email, password, rememberMe = false) => {
    const profile = app.appData.profile || {};
    const users = app.appData.users || [];
    const matchedUser =
      users.find(
        (user) =>
          String(user.email).toLowerCase() === String(email).toLowerCase() &&
          String(user.password) === String(password)
      ) ||
      (String(profile.email).toLowerCase() === String(email).toLowerCase() &&
        String(profile.password) === String(password)
        ? { id: "profile-user", fullName: profile.fullName, email: profile.email, role: profile.role, photo: profile.photo }
        : null);

    if (!matchedUser) {
      return { ok: false, message: "Email or password is incorrect." };
    }

    setSession({
      isAuthenticated: true,
      userId: matchedUser.id,
      rememberMe,
    });

    return { ok: true, user: matchedUser };
  };

  const logout = () => {
    setSession({ isAuthenticated: false, userId: null, rememberMe: false });
  };

  const currentUser = useMemo(() => {
    const profile = app.appData.profile || {};
    if (!session.isAuthenticated) return null;
    if (session.userId === "profile-user") {
      return {
        id: "profile-user",
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        photo: profile.photo,
      };
    }
    return app.appData.users?.find((user) => user.id === session.userId) || {
      id: "fallback-user",
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      photo: profile.photo,
    };
  }, [app.appData, session]);

  const value = {
    session,
    login,
    logout,
    currentUser,
    isAuthenticated: session.isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
