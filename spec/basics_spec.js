import jss from 'jss'
import preset from 'jss-preset-default'
import color from 'color'
import mixStyles from '../src'

jss.setup(preset())

const typographyBody = {
  fontSize: 14
}

const lineHeight = size => ({
  lineHeight: `${size}px`
})

const hoverColor = textColor => ({
  '&:hover': {
    color: color(textColor).hex()
  }
})

describe("mixStyles", function() {
  let sheet, rules, classes
  let button, buttonHover, extendedButton, extendedButtonHover

  const styles = {
    button: mixStyles(
      {
        fontSize: 12,
        '&:hover': {
          background: 'blue'
        }
      },
      typographyBody,
      lineHeight(14),
      hoverColor('green'),
      hoverColor('red')
    ),
    extendedButton: {
      extend: 'button',
      '&:hover': {
        background: color('blue')
        .darken(0.3)
        .hex()
      }
    },
  }

  beforeEach(() => {
    sheet = jss.createStyleSheet(styles)
    rules = sheet.rules
    classes = sheet.classes

    button = rules.get(`.${classes.button}`).style
    buttonHover = rules.get(`.${classes.button}:hover`).style
    extendedButton = rules.get(`.${classes.extendedButton}`).style
    extendedButtonHover = rules.get(`.${classes.extendedButton}:hover`).style
  })

  it("overrides styles in order from top to bottom", function() {
    expect(button['font-size']).toBe('14px');
    expect(buttonHover['color']).toBe(color('red').hex());
  });

  it("works with jss-extend", function() {
    expect(extendedButton['font-size']).toBe('14px');
    expect(extendedButtonHover['background']).toBe(
      color('blue').darken(0.3).hex()
    )
  });
});
