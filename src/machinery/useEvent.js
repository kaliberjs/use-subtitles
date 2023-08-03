export function useEvent(fn) {
  const fnRef = React.useRef(null);
  fnRef.current = fn;

  return React.useCallback((...args) => fnRef.current(...args), []);
}
