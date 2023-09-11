/**
 * @param {Function} install 
 * @param {Array<any>} dependencies 
 * @returns {import('react').MutableRefObject}
 */
export function useNodeRef(install, dependencies) {
  const ref = React.useRef()

  React.useEffect(() => {
    const node = ref.current
    const uninstall = install(node)

    return () => {
      if (uninstall) {
        uninstall()
      }
    };
  }, dependencies)

  return ref
}
