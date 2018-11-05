import jss from 'jss'
import preset from 'jss-preset-default'
import color from 'color'
import mixStyles from '../src'

import * as assert from 'assert'

jss.setup(preset())

const typographyBody = {
  fontSize: 14
}

const lineHeight = (size, units='px') => ({
  lineHeight: `${size}${units}`
})

const hoverColor = textColor => ({
  '&:hover': {
    color: color(textColor).hex()
  }
})

const getStyleForClass = (sheet, className) => {
  const { rules } = sheet
  return rules.get(`.${className}`).style
}

describe('mixStyles', () => {
  it("should work without input", () => {
    const sheet = jss.createStyleSheet({ test: mixStyles() })
    const testStyle = getStyleForClass(sheet, sheet.classes.test)
    assert.deepEqual(testStyle, {})
  })

  it("should work with null input", () => {
    const sheet = jss.createStyleSheet({ test: mixStyles(null) })
    const testStyle = getStyleForClass(sheet, sheet.classes.test)
    assert.deepEqual(testStyle, {})
  })

  it("should work with empty input", () => {
    const sheet = jss.createStyleSheet({ test: mixStyles({}) })
    const testStyle = getStyleForClass(sheet, sheet.classes.test)
    assert.deepEqual(testStyle, {})
  })

  it("should override styles in order from top to bottom", () => {
    const sheet = jss.createStyleSheet({
      body1: mixStyles(
        { fontSize: 12 },
        typographyBody,
      ),
      body2: mixStyles(
        typographyBody,
        { fontSize: 12 },
      ),
    })

    let body1Styles = getStyleForClass(sheet, sheet.classes.body1)
    let body2Styles = getStyleForClass(sheet, sheet.classes.body2)

    assert.equal(body1Styles['font-size'], '14px')
    assert.equal(body2Styles['font-size'], '12px')
  })

  it("should merge nested styles in selectors", () => {
    const sheet = jss.createStyleSheet({
      button: mixStyles(
        {
          '&:hover': {
            background: color('blue').hex(),
          }
        },
        hoverColor(color('green').hex()),
      ),
    })

    const buttonStyles = getStyleForClass(sheet, sheet.classes.button + ':hover')
    assert.equal(buttonStyles['background'], color('blue').hex())
    assert.equal(buttonStyles['color'], color('green').hex())
  })

  it("should work in extensions using jss-extend", function() {
    const sheet = jss.createStyleSheet({
      button: mixStyles(
        lineHeight(12)
      ),
      extendedButton: mixStyles(
        { extend: 'button' },
        lineHeight(14),
      ),
    })

    const buttonStyles = getStyleForClass(sheet, sheet.classes.button)
    assert.equal(buttonStyles['line-height'], '12px');

    const extendedButtonStyles = getStyleForClass(sheet, sheet.classes.extendedButton)
    assert.equal(extendedButtonStyles['line-height'], '14px');
  });
})
