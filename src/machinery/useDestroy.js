import { noop } from "./utilities";

/** @param {Function} callback */
export function useDestroy(callback = noop) {
  React.useEffect(
    () => () => callback(),
    []
  )
}
