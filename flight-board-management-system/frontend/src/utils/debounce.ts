export const debounce = <T extends (...args: any[]) => void>(
  callback: T,
  waitTime: number
) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      callback(...args);
    }, waitTime);
  };
};
