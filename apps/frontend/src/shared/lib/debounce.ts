export const debounce = (func: CallableFunction, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: unknown[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
};
