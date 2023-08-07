import { noop } from "./utilities";

export function useCallbackRef({ onMount = noop, onUnmount = noop }) {
  const internalRef = React.useRef(null);

  React.useEffect(
    () => {
      return () => onUnmount(internalRef.current)
    },
    []
  )

  return {
    get current() {
      return internalRef.current;
    },
    set current(x) {
      const last = internalRef.current;

      if (last) {
        onUnmount(last)
      }

      if (last !== x) {
        internalRef.current = x
        onMount(x)
      }
    },
  }
}
