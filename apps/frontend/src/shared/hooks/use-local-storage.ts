import { useCallback, useEffect, useState } from "react";

export type UseLocalStorageProps<T> = {
  key: string;
  initialState: T;
  serialize?: (state: T) => string;
  deserialize?: (value: string) => T;
};

export type UseLocalStorageReturn<T> = [T, (state: T) => void];

export const useLocalStorage = <T>({
  key,
  initialState,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}: UseLocalStorageProps<T>) => {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialState;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialState;
    } catch {
      return initialState;
    }
  });

  const removeState = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem(key);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, setState, removeState] as const;
};
