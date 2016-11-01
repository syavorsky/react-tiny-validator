# react-tiny-validator

Handy validation helper for React. What makes it different:
- Extremely flexible, not introducing any markup, not making code assumptions
- Allows to validate a single input as well as build a complex set of fields
- Supports sync/async validation flows
- Completely separate from input components and agnostic of input type
- Isomorphic. I have to mention this just to look cool ;)

## Install

As usually `npm install react-tiny-validator --save`

Then in ES6 environment go with

```js
import Validate from 'react-tiny-validator'
```

or with pre-compiled ES5 UMD module otherwise

```html
<script src="react-tiny-validator/es5/index.js"></script>
<script>
  // AMD
  define(['react-tiny-validator'], function () { ... })
  // CommonJS
  var Validate = require('react-tiny-validator').default
  // Global
  var Validate = window['react-tiny-validator'].default
</script>
```

## Principal pattern

Here is one pattern this lib utilizes. It is extremely powerful but may look unfamiliar.

```jsx
<Validate value={...} validators={...}>
  {({value, onChange}) => (
    <input type="text" value={value}
      onChange={e => onChange(e.target.value)}
  )}
</Validate>
```

As you see instead of usual JSX chunk `Validate` takes a function returning JSX. Function is called with arguments exposing validation API. This is totally safe and is not hacking into React internals.

As you see function notation is `({value, onChange})` which means `function(options)` we just use handy ES6 syntax to ubpack the options we need.

Here are some key options:

- `value` - initial value
- `onChange` - function to be called whenever user comes
- `pristine` - either user input was ever made
- `errors` - array of errors validators produced, you may probably want to use it in conjunction with `pristine` for better UX experience. It's populated from very beginning based on `value` prop on `Validate`

see full list of available options in API section

## Examples

### Single field

Let's have a stateful component holding user email. For example simplicity we will assume email is any string longer then `5` chars having `@` at the middle.

`Validate` is taking array of validators – `function(value)` returning error message or nothing if value is good

```js
const minlen = len => value => {
  if (value.length < len) return 'Should be longer then ' + len
}

const emaillike = value => {
  if (/\w+@\w+/.test(value)) return 'Does not look like email'
}
```

Now let's build a component

```js
import React, {Component} from 'react'
import Validate from 'react-tiny-validator'

class Form extends Component {
  state = {email: ''}

  render() {
    return (
      <div>
        <div>Email is "{this.state.email}"</div>
        <Validate value={this.state.value}
          onChange={goodValue => this.seatState(value: goodValue)}
          validators={[minlen(5), emaillike]}>
          {(value, onChange, pristine, valid) => (
            <div>
              Email:
              <input type="text"
                value={value}
                onChange={e => onChange(e.target.value)} />
              {!pristine && !valid && (
                <ul>
                  {errors.map(error => <li>{error}</li>)}
                </ul>
              )}
            </div>
          )}
        </Validate>
      </div>
    )
  }
}
```

If you [run this example] you notice that value is never leaving `Validate` until passes validation. Once user input satisfies all `validators` the `Validate.onChange` is being called, the rest of the flow is encapsulated in `Validate` and being handled for you.
