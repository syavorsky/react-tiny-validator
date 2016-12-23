import {Component, PropTypes} from 'react'

const defaultName = () => 'validate-' + (Math.random() + '').slice(2, 7)

const warn = (...args) => {
  if (typeof console !== 'undefined' && console.warn) console.warn(...args)
}

const missingPromise = () => {
  const msg = [
    'Missing a Promise binding!',
    'You should either have global \'Promise\' available',
    'or introduce custom one as \'Validate.usePromise(Promise)\''
  ].join('\n')

  warn(msg)
  throw new Error('Missing a Promise binding')
}

missingPromise.all = missingPromise

const validateMembers = (value, members) => {
  const errors = Object.keys(members)
    .reduce((errors, name) => {
      return [...errors, ...members[name].errors]
    }, [])
  return errors
}

const aborted = new Error('validation aborted')

class Validate extends Component {

  static propTypes = {
    children : PropTypes.func.isRequired,
    explicit : PropTypes.bool,
    name     : PropTypes.string,
    parent   : PropTypes.shape({
      name     : PropTypes.string,
      onChange : PropTypes.func
    }),
    onChange   : PropTypes.func,
    pristine   : PropTypes.bool,
    valid      : PropTypes.bool,
    validators : PropTypes.arrayOf(PropTypes.func),
    value      : PropTypes.any
  }

  static defaultProps = {
    parent     : null,
    validators : [validateMembers],
    value      : '',
    explicit   : false,
    onChange   : () => undefined
  }

  static Promise = typeof Promise === 'undefined' ? missingPromise : Promise

  static usePromise = Promise => {
    Validate.Promise = Promise
    return Validate
  }

  constructor (...args) {
    super(...args)

    const {name, value} = this.props

    this.name = name || defaultName()
    this.state = {
      value,
      members  : {},
      pristine : true,
      pending  : false,
      valid    : this.props.value !== undefined ? this.props.value : true,
      errors   : []
    }

    this._validationRun = 0
  }

  check = () => {
    this.setState({pristine: false})
    const {value, members} = this.state
    return this._validate(value, members).then(() => {
      this.props.onChange(value, this.state.valid)
      return this.state.valid
    })
  }

  onChange = (value, silent = false) => {
    const {explicit, onChange} = this.props
    if (explicit) return this.setState({value})

    const {pristine, members} = this.state

    this.setState(state => ({...state,
      value,
      pristine: pristine && silent
    }), () => {
      this._validate(value, members).then(() => {
        onChange(this.state.value, this.state.valid)
      })
    })
  }

  onReport = (name, member, pristine) => {
    const {explicit} = this.props

    this.setState(state => ({...state,
      members  : {...state.members, [name]: member},
      pristine : explicit ? state.pristine : (state.pristine && pristine)
    }), () => {
      if (!explicit) this._validate(this.state.value, this.state.members)
    })
  }

  onLeave = name => {
    const {explicit} = this.props
    const {members} = this.state

    if (!members[name]) return

    const nextMembers = {...members}
    delete nextMembers[name]

    this.setState({
      members: nextMembers
    }, () => {
      if (!explicit) this._validate(this.state.value, this.state.members)
    })
  }

  componentDidMount () {
    const {explicit, valid, value} = this.props
    if (!explicit && valid === undefined) this._validate(value, {}, true)
  }

  componentWillUnmount () {
    const {parent} = this.props
    parent && parent.leave(this.name)
  }

  componentWillReceiveProps (nextProps) {
    if (!(value in nextProps) || nextProps.value === this.state.value) return

    const {value, parent, onChange} = nextProps
    this._validate(value, this.state.members).then(() => {
      onChange(this.state.value, this.state.valid)
      parent && parent.report(this.name, this.state)
    })
  }

  render () {
    const {parent, children: render} = this.props
    const opts = {
      name     : this.name,
      check    : this.check,
      errors   : this.state.errors,
      members  : this.state.members,
      onChange : this.onChange,
      pending  : this.state.pending,
      pristine : (!parent || parent.pristine) && this.state.pristine,
      valid    : this.state.valid,
      value    : this.state.value
    }

    opts.group = {
      pristine : opts.pristine,
      report   : this.onReport,
      check    : this.check
    }

    return render(opts)
  }

  _validate (value, members, pristine) {
    let isAsync = false
    const run = ++this._validationRun
    const {validators, parent} = this.props

    const errors = validators.reduce((errors, validate) => {
      const error = validate(value, members || {})
      if (error !== undefined && error !== null) {
        isAsync = isAsync || !!error.then
        return errors.concat(error) // either one or Array of errors
      }
      return errors
    }, [])

    if (isAsync) {
      this.setState({pending: true})
      return Promise.all(
        errors.concat(run)
      ).then(errors => {
        if (errors.pop() !== this._validationRun) throw aborted
        this.setState({
          errors,
          valid   : errors.length === 0,
          pending : false
        }, () => parent && parent.report(this.name, this.state, pristine))
      }).catch(err => {
        this.setState({pending: false})
        if (err === aborted) return
        warn('Validation failed', err)
      })
    } else {
      this.setState({
        errors,
        valid: errors.length === 0
      }, () => parent && parent.report(this.name, this.state, pristine))
      return Promise.resolve()
    }
  }
}

export default Validate
