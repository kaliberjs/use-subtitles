import { noop } from "./utilities";

export function useCallbackRef({ onMount = noop, onUnmount = noop }) {
  const nodeRef = React.useRef(null);

  const setRef = React.useCallback(node => {
    if (nodeRef.current) {
      onUnmount(nodeRef.current);
    }

    nodeRef.current = node;

    if (nodeRef.current) {
      onMount(nodeRef.current);
    }
  }, [onMount, onUnmount]);

  return [nodeRef, setRef];
}
