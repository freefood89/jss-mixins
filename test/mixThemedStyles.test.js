import React from 'react'
import {stripIndent} from 'common-tags'
import preset from 'jss-preset-default'
import {render, unmountComponentAtNode} from 'react-dom'
import {renderToString} from 'react-dom/server'
import jss from 'jss'
import color from 'color'
import assert from 'assert'
import injectSheet, {createTheming, ThemeProvider, JssProvider, SheetsRegistry} from 'react-jss'
// import {JSDOM} from 'jsdom';
import { mixThemedStyles } from '../src'

const COLOR = color('#aaa')
const FONT_FAMILY = 'lolcats'
const FONT_SIZE = 14
const TYPE_SIZE = 'body1'

const theme = {
  color: COLOR.hex(),
  typography: {
    fontFamily: FONT_FAMILY,
    [TYPE_SIZE]: {
      fontSize: FONT_SIZE
    }
  }
}

const themedTypography = typeSize => theme => ({
  fontSize: theme.typography[typeSize].fontSize,
  fontFamily: theme.typography.fontFamily
})

describe('mixThemedStyles', () => {
  let node

  before(() => {
    node = document.body.appendChild(document.createElement('div'))
  })

  after(() => {
    unmountComponentAtNode(node)
    node.parentNode.removeChild(node)
  })

  it('should inject theme into static style', () => {
    const ThemedStaticComponent = injectSheet(theme => ({
      rule: mixThemedStyles(theme)(
        themedTypography('body1'),
        { color: theme.color }
      )
    }))()

    render(
      <div>
        <ThemeProvider theme={theme}>
          <ThemedStaticComponent/>
        </ThemeProvider>
      </div>,
      node
    )

    const sheet = document.styleSheets[0]
    const style = sheet.cssRules[0].style

    assert.equal(document.querySelectorAll('style').length, 1)
    assert.equal(style.color, COLOR.hex())
    assert.equal(style['font-size'], `${FONT_SIZE}px`)
  })

  // TODO: fix this test
  // it('should inject theme into dynamic style', () => {
  //   const InnerComponent = ({classes}) => <div id='my-component' className={classes.rule} />
  //   const styles = theme => ({
  //     rule: props => mixThemedStyles(theme)(
  //       themedTypography('body1'),
  //       { backgroundColor: props.backgroundColor }
  //     )
  //   })

  //   const MyComponent = injectSheet(styles)(InnerComponent)

  //   render(
  //     <div>
  //       <ThemeProvider theme={theme}>
  //         <MyComponent typeSize={TYPE_SIZE} backgroundColor={COLOR} />
  //       </ThemeProvider>
  //     </div>,
  //     node
  //   )

  //   const sheet = document.styleSheets[0]
  //   const style = sheet.cssRules[0].style

  //   assert.equal(style.color, COLOR.hex())
  //   assert.equal(style['color'], COLOR.hex())
  //   assert.equal(style['font-size'], `${FONT_SIZE}px`)
  // })
})
