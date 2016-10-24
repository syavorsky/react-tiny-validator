import React, {Component} from 'react'
import {render} from 'react-dom'

import Validate from '../'

function required (value) {
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
    const {value} = this.state
    return (
      <div>
        Hello
        <Validate>
          {({check, pristine}) => (
            <div>
              <Validate name='fff'
                pristine={pristine}
                value={value}
                onChange={value => this.setState({value})}
                validators={[required, email, minlen(4)]}>
                {({value, onChange, errors, pristine}) => (
                  <div>
                    <input type='text' value={value} onChange={e => onChange(e.target.value)} />
                    <p>{pristine ? 'pristine' : 'dirty'}</p>
                    {!pristine && <p>Errors: {errors.join(', ')}</p>}
                  </div>
                )}
              </Validate>
              <button onClick={() => { check() && this.submit() }}>Submit</button>
            </div>
          )}
        </Validate>
      </div>
    )
  }
}

render(<App />, document.getElementById('app'))
