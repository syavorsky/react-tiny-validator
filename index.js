import {Component, PropTypes} from 'react'

const defaultName = () => 'validate-' + (Math.random() + '').slice(2, 7)

const validateMembers = (value, members) => Object.keys(members)
  .reduce((errors, name) => {
    console.log(name, members[name].errors)
    return [...errors, ...members[name].errors]
  }, [])

class Validate extends Component {

  static propTypes = {
    children : PropTypes.func.isRequired,
    name     : PropTypes.string,
    parent   : PropTypes.shape({
      name     : PropTypes.string,
      onChange : PropTypes.func
    }),
    onChange   : PropTypes.func,
    pristine   : PropTypes.bool,
    validators : PropTypes.arrayOf(PropTypes.func),
    value      : PropTypes.any
  }

  static defaultProps = {
    parent     : null,
    validators : [validateMembers],
    value      : null,
    onChange   : () => undefined
  }

  constructor (...args) {
    super(...args)

    const {name, value} = this.props

    this.name = name || defaultName()
    this.state = {
      value,
      members  : {},
      pristine : true
    }

    const errors = this._getError(this.props.value)
    this.state.errors = errors
    this.state.valid = errors.length === 0
  }

  check = () => {
    this.setState({pristine: false})
    return this.state.valid
  }

  onChange = (value, silent = false) => {
    const {parent, onChange} = this.props

    const errors = this._getError(value, this.state.members)
    const valid = errors.length === 0
    const pristine = this.state.pristine && silent

    this.setState({errors, pristine, valid, value})

    onChange(value, valid)
    if (parent) parent.report(this.name, {...this.state, errors, pristine, valid, value})
  }

  onReport = (name, member) => {
    const {parent} = this.props

    this.setState(state => {
      const members = {...state.members, [name]: member}
      const errors = this._getError(state.value, members)
      const valid = errors.length === 0

      if (parent) parent.report(this.name, {...state, errors, members, valid})
      return {errors, members, valid}
    })
  }

  onLeave = name => {
    if (!this.state.members[name]) return
    const members = {...this.state.members}
    delete members[name]
    this.setState({members})
  }

  componentDidMount () {
    const {parent} = this.props
    if (parent) parent.report(this.name, this.state)
  }

  componentWillUnmount () {
    const {parent} = this.props
    if (parent) parent.leave(this.name)
  }

  componentWillReceiveProps (nextProps) {
    if (
      !(value in nextProps) ||
      nextProps.value === this.state.value
    ) return

    const {value, parent, onChange} = nextProps

    const errors = this._getError(value)
    const valid = errors.length === 0
    const pristine = true

    this.setState({errors, pristine, valid, value})

    onChange(value, valid)
    if (parent) parent.report(this.name, {...this.state, errors, pristine, valid, value})
  }

  render () {
    const {parent, children: render} = this.props
    const opts = {
      name     : this.name,
      check    : this.check,
      errors   : this.state.errors,
      members  : this.state.members,
      onChange : this.onChange,
      pristine : (!parent || parent.pristine) && this.state.pristine,
      valid    : this.state.valid,
      value    : this.state.value
    }

    opts.group = {
      pristine : opts.pristine,
      report   : this.onReport
    }

    return render(opts)
  }

  _getError (value, members) {
    return this.props.validators
      .reduce((errors, validate) => {
        const error = validate(value, members || {})
        if (error !== undefined) errors.push(error + '')
        return errors
      }, [])
  }
}

export default Validate
