import { mergeStyles } from './mergeStyles'

export const mixThemedStyles = theme => (...styles) => {
  let outputStyles = {}

  for (const style of styles) {
    const overrides = typeof style === 'function' ? style(theme) : style
    outputStyles = mergeStyles(outputStyles, overrides)
  }

  return outputStyles
}
