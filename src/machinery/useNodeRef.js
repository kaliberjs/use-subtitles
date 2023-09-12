/**
 * @param {Function} install 
 * @param {import('react').DependencyList} dependencies 
 * @returns {import('react').MutableRefObject<HTMLMediaElement>}
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
