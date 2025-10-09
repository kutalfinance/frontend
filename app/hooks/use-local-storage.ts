import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

/**
 * synchronie reactive state with local storage listener.
 * @template T The type of the state value.
 * @param {string} key The key under which the state will be stored in local storage.
 * @param {T} initialValue The initial value of the state.
 * @returns {[T, Dispatch<SetStateAction<T>>]} An array containing the current state value and a function to update that value.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(getItem(key) ?? initialValue);

  useEffect(() => {
    // Initialize the state
    try {
      const value = getItem(key);
      // Check if the local storage already has any values,
      // otherwise initialize it with the passed initialValue
      const valueToStore = value ?? initialValue;
      setState(valueToStore);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", () => {
      try {
        const value = getItem(key);
        // Check if the local storage already has any values,
        // otherwise initialize it with the passed initialValue
        const valueToStore = value ?? initialValue;
        setState(valueToStore);
      } catch (error) {
        console.error(error);
      }
    });
  }, []);

  /**
   * Function to set a new value for the state, updating both the state and local storage.
   * @param {T | SetStateAction<T>} value The new value for the state, or a function that returns the new value.
   */
  const setValue = (value: T | SetStateAction<T>) => {
    try {
      // If the passed value is a callback function,
      //  then call it with the existing state.
      const valueToStore = value instanceof Function ? value(state) : value;
      setItem(key, valueToStore);
      window.dispatchEvent(new Event("storage"));
      setState(value);
    } catch (error) {
      console.error(error);
    }
  };

  return [state, setValue];
}

const FILTER_KEY = "__FILTER_CACHE";
function getStore() {
  const filters = window.localStorage.getItem(FILTER_KEY);
  if (!filters) return null;
  return JSON.parse(filters);
}
function getItem(key: string) {
  const s = getStore();
  return s?.[key];
}
function setItem<T>(key: string, value: T) {
  const s = getStore() ?? {};
  const filters = { ...s, [key]: value };
  window.localStorage.setItem(FILTER_KEY, JSON.stringify(filters));
}
