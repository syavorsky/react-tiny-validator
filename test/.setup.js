require('babel-register')()

global.expect = require('chai').expect
global.React = require('react')
global.Validate = require('../')
global.mount = require('enzyme').mount

var jsdom = require('jsdom').jsdom

var exposedProperties = ['window', 'navigator', 'document']

global.navigator = {userAgent: 'node.js'}
global.document = jsdom('')
global.window = document.defaultView

Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property)
    global[property] = document.defaultView[property]
  }
})

documentRef = document
