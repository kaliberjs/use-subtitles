import { useDestroy } from "./useDestroy";
import { noop } from "./utilities";

/** 
 * @param {{ onMount: Function, onUnmount: Function }} _
 * @returns {import('react').RefObject<HTMLMediaElement>}
 */
export function useCallbackRef({ onMount = noop, onUnmount = noop }) {
  const internalRef = React.useRef(null);

  useDestroy(() => {
    onUnmount(internalRef.current)
  })

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
