import { useEvent } from "./useEvent";

export function useEventListener({ element, eventName, handler }) {
  const onEvent = useEvent(handler);

  React.useEffect(() => {
    void element?.addEventListener(eventName, onEvent);

    return () => {
      void element?.removeEventListener(eventName, onEvent);
    };
  }, [element, eventName, onEvent]);
}
