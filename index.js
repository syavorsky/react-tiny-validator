import {Component, PropTypes} from 'react'

const errorsArr = (groups = {}) => {
  const errors = Object.keys(groups)
    .reduce((errors, group) => errors.concat(groups[group]), [])

  return Object.assign(errors, {groups})
}

class Validate extends Component {

  static propTypes = {
    children   : PropTypes.func.isRequired,
    name       : PropTypes.string,
    onChange   : PropTypes.func,
    onError    : PropTypes.func,
    pristine   : PropTypes.bool,
    validators : PropTypes.arrayOf(PropTypes.func),
    value      : PropTypes.any
  }

  static defaultProps = {
    onError    : () => undefined,
    pristine   : true,
    validators : [],
    value      : null
  }

  constructor (...args) {
    super(...args)
    this.name = this.props.name || 'validate-' + Math.random().toString().slice(2, 7)
    this.state = {
      value    : this.props.value,
      errors   : this.getErrors(this.props.value),
      pristine : true
    }
  }

  check = () => {
    this.setState({pristine: false})
    return this.state.errors.length > 0
  }

  onChange = value => {
    const errors = this.getErrors(value)

    this.setState({value, errors, pristine: false})
    this.onError(errors, this.name)
  }

  onError = (errors, group = this.name) => {
    const groups = {...this.state.errors.groups, [group]: errors}

    this.setState({errors: errorsArr(groups)})
    this.props.onError(this.state.errors, this.name)
  }

  getErrors (value) {
    const {validators} = this.props
    return validators.reduce((errors, validate) => {
      const error = validate(value, this.name)
      if (error !== undefined) errors.push(error + '')
      return errors
    }, [])
  }

  render () {
    const {children: render} = this.props

    return render({
      value    : this.state.value,
      errors   : this.state.errors,
      pristine : this.props.pristine && this.state.pristine,
      check    : this.check,
      onChange : this.onChange,
      onError  : this.onError
    })
  }
}

export default Validate
