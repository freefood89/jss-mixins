import { mergeStyles } from './mergeStyles'

export const mixStyles = (...styles) => {
  let outputStyles = {}

  for (const style of styles) {
    const overrides = typeof style === 'function' ? style() : style
    outputStyles = mergeStyles(outputStyles, overrides)
  }

  return outputStyles
}
