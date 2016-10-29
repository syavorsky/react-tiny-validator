import {Component, PropTypes} from 'react'

const defaultName = () => 'validate-' + (Math.random() + '').slice(2, 7)

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
    validators : [],
    value      : null,
    onChange   : () => undefined
  }

  constructor (...args) {
    super(...args)

    const {name, value} = this.props
    const errors = this._getError(this.props.value)

    this.name = name || defaultName()
    this.state = {
      value,
      errors,
      members  : {},
      pristine : true,
      valid    : errors.length === 0
    }
  }

  check = () => {
    this.setState({pristine: false})
    return this.state.errors.length > 0
  }

  onChange = (value, silent = false) => {
    const {parent, onChange} = this.props

    const errors = this._getError(value)
    const valid = errors.length === 0 && this._validateMembers(this.state.members)
    const pristine = this.state.pristine && silent

    this.setState({errors, pristine, valid, value})

    if (valid) onChange(value)
    if (parent) parent.report(this.name, {...this.state, errors, pristine, valid, value})
  }

  onReport = (name, state) => {
    const {parent} = this.props

    const members = {...this.state.members, [name]: state}
    const valid = this.state.errors.length === 0 && this._validateMembers(members)

    this.setState({members, valid})
    if (parent) parent.report(this.name, {...this.state, members, valid})
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
    const {value, parent} = nextProps

    if (value === this.props.value) return

    const errors = this._getError(value)
    const valid = errors.length === 0 && this._validateMembers(this.state.members)
    const pristine = true

    this.setState({errors, pristine, valid, value})
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

  _validateMembers (members) {
    for (let name in members) if (!members[name].valid) return false
    return true
  }

  _getError (value) {
    return this.props.validators
      .reduce((errors, validate) => {
        const error = validate(value, this.name)
        if (error !== undefined) errors.push(error + '')
        return errors
      }, [])
  }
}

export default Validate
