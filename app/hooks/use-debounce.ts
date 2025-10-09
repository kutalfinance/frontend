import { useEffect, useRef } from "react";

type Timer = ReturnType<typeof setTimeout>;
type FnConstraint = (...args: any[]) => void;

/**
 *
 * @param fn The original, non debounced function (You can pass any number of args to it)
 * @param delay The delay (in ms) for the function to return
 * @returns The debounced function, which will run only if the debounced function has not been called in the last (delay) ms
 */
export function useDebounce<T extends FnConstraint>(fn: T, delay = 1000) {
  const timer = useRef<Timer | null>(null);

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, []);

  const debouncedFunction = ((...args) => {
    const newTimer = setTimeout(() => {
      fn(...args);
    }, delay);

    if (timer.current) clearTimeout(timer.current);
    timer.current = newTimer;
  }) as T;

  return debouncedFunction;
}
