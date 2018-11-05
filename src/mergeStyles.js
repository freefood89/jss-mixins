export const mergeStyles = (styles, overrides) => {
  Object.keys(overrides).map((k) => {
    if (typeof styles[k] === 'object' && !Array.isArray(styles[k])) {
      return styles[k] = Object.assign(styles[k] || {}, overrides[k])
    }
    return styles[k] = overrides[k]
  })

  return styles
}
