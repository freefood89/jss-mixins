/* eslint-disable global-require, react/prop-types */

import React from 'react'
import {stripIndent} from 'common-tags'
import preset from 'jss-preset-default'
import {render, unmountComponentAtNode} from 'react-dom'
import {renderToString} from 'react-dom/server'
import jss from 'jss'
import color from 'color'

import injectSheet, {createTheming, ThemeProvider, JssProvider, SheetsRegistry} from 'react-jss'

import { mixThemedStyles } from '../src'

const removeWhitespaces = s => s.replace(/\s/g, '')

const COLOR_A = '#aaa'
const COLOR_B = '#bbb'
const FONT_FAMILY_A = 'lolcats'
const FONT_FAMILY_B = 'ggwp'
const FONT_SIZE_A = 14
const FONT_SIZE_B = 16
const TYPE_SIZE = 'body1'

const ThemeA = {
  color: COLOR_A,
  typography: {
    fontFamily: FONT_FAMILY_A,
    [TYPE_SIZE]: {
      fontSize: FONT_SIZE_A
    }
  }
}
const ThemeB = {
  color: COLOR_B,
  typography: {
    fontFamily: FONT_FAMILY_B,
    [TYPE_SIZE]: {
      fontSize: FONT_SIZE_B
    }
  }
}

const themedTypography = typeSize => theme => ({
  fontSize: theme.typography[typeSize].fontSize,
  fontFamily: theme.typography.fontFamily
})

describe('React-JSS Static:', () => {
  let node

  beforeEach(() => {
    node = document.body.appendChild(document.createElement('div'))
  })

  afterEach(() => {
    unmountComponentAtNode(node)
    node.parentNode.removeChild(node)
  })

  const themedStaticStyles = theme => ({
    rule: mixThemedStyles(theme)(
      themedTypography('body1'),
      { color: theme.color }
    )
  })

  const ThemedStaticComponent = injectSheet(themedStaticStyles)()

  it('one themed instance wo/ dynamic props = 1 style', () => {
    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <ThemedStaticComponent/>
        </ThemeProvider>
      </div>,
      node
    )

    const style = document.styleSheets[0].cssRules[0].style
    expect(document.querySelectorAll('style').length).toBe(1)
    expect(style.color).toBe(COLOR_A)
    expect(style['font-size']).toBe(`${FONT_SIZE_A}px`)
  })

  it('one themed instance wo/ dynamic props = 1 style', () => {
    render(
      <div>
        <ThemeProvider theme={ThemeB}>
          <ThemedStaticComponent/>
        </ThemeProvider>
      </div>,
      node
    )

    const style = document.styleSheets[0].cssRules[0].style
    expect(document.querySelectorAll('style').length).toBe(1)
    expect(style.color).toBe(COLOR_B)
    expect(style['font-size']).toBe(`${FONT_SIZE_B}px`)
  })
})

describe('React-JSS Dynamic:', () => {
  let node
  let MyComponent

  beforeEach(() => {
    node = document.body.appendChild(document.createElement('div'))
    const InnerComponent = ({classes}) => <div id='my-component' className={classes.rule} />

    const themedDynamicStyles = theme => ({
      rule: props => mixThemedStyles(theme)(
        themedTypography(props.typeSize),
        {
          color: theme.color,
          backgroundColor: props.backgroundColor
        }
      )
    })

    MyComponent = injectSheet(themedDynamicStyles)(InnerComponent)
  })

  afterEach(() => {
    unmountComponentAtNode(node)
    node.parentNode.removeChild(node)
  })

  it('one themed instance w/ dynamic props', () => {
    render(
      <div>
        <ThemeProvider theme={ThemeA}>
          <MyComponent typeSize={TYPE_SIZE} backgroundColor={COLOR_A} />
        </ThemeProvider>
      </div>,
      node
    )

    const component = document.getElementById('my-component')
    const style = window.getComputedStyle(component)
    expect(color(style.color).hex()).toBe(color(COLOR_A).hex())
    expect(color(style['background-color']).hex()).toBe(color(COLOR_A).hex())
    expect(style['font-size']).toBe(`${FONT_SIZE_A}px`)
  })
})


