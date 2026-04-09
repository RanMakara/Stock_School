import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) return JSON.parse(item);
      return typeof initialValue === "function" ? initialValue() : initialValue;
    } catch (error) {
      return typeof initialValue === "function" ? initialValue() : initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      // localStorage can fail in private browsing; the UI still works in memory.
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
