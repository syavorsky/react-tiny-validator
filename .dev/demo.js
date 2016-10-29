import React, {Component} from 'react'
import {render} from 'react-dom'

import Validate from '../'

function required (value, values) {
  if (!value) return 'Empty'
}

function minlen (len) {
  return function (value, name) {
    if (!value || (value + '').length < len) return `${name} expects ${len} chars`
  }
}

function email (value) {
  if (!/^\w+@\w+/.test(value + '')) return 'Not an email'
}

class App extends Component {

  state = {value: ''}

  submit () {
    console.log('Submitted!')
  }

  render () {
    const stateValue = this.state.value
    return (
      <div>
        <xmp>{`
state.value: ${JSON.stringify(stateValue)}
        `}</xmp>

        <h3>simple</h3>
        <Validate validators={[required, email, minlen(4)]}
          value={stateValue}
          onChange={value => this.setState({value})}>
          {({name, value, onChange, errors, valid, pristine}) => (
            <div>
              <input type='text' value={value} onChange={e => onChange(e.target.value)} />
              <xmp>{`
name:     ${JSON.stringify(name)}
value:    ${JSON.stringify(value)}
valid:    ${JSON.stringify(valid)}
pristine: ${JSON.stringify(pristine)}
errors:   ${JSON.stringify(errors)}
              `}</xmp>
            </div>
          )}
        </Validate>

        <h3>not so simple</h3>
        <Validate name='group'>
          {({name, check, value, valid, pristine, errors, children, group}) => (
            <div>
              <Validate validators={[required, email, minlen(4)]}
                name='field'
                parent={group}
                value={stateValue}>
                {({name, value, values, onChange, errors, valid, pristine}) => (
                  <div>
                    <input type='text' value={value} onChange={e => onChange(e.target.value)} />{!pristine && ' dirty'}
                    <xmp>{`
name:     ${JSON.stringify(name)}
value:    ${JSON.stringify(value)}
valid:    ${JSON.stringify(valid)}
pristine: ${JSON.stringify(pristine)}
errors:   ${JSON.stringify(errors)}
                    `}</xmp>
                  </div>
                )}
              </Validate>
              <button onClick={() => { check() && this.submit() }}>Submit</button>
              <xmp>{`
group.name:     ${JSON.stringify(name)}
group.value:    ${JSON.stringify(value)}
group.valid:    ${JSON.stringify(valid)}
group.pristine: ${JSON.stringify(pristine)}
group.errors:   ${JSON.stringify(errors)}
group.children: ${JSON.stringify(children)}
              `}</xmp>
            </div>
          )}
        </Validate>
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))
