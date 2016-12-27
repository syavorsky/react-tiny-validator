
describe('validation mechanics', function () {
  let props

  beforeEach(() => {
    props = {}
    global.__VALIDATOR_WARN__ = undefined
  })

  it('uses props.validators', function (done) {
    let called1, called2
    mount(
      <Validate validators={[
        v => { called1 = true },
        v => { called2 = true }
      ]}>{() => <span />}</Validate>
    )
    setTimeout(() => {
      expect(called1 && called2).to.be.true
      done()
    }, 5)
  })

  it('catches sync errors', function (done) {
    mount(
      <Validate validators={[
        v => {},
        v => { return 'failed' }
      ]}>{_ => { props = _ }}</Validate>
    )
    setTimeout(() => {
      expect(props.errors).to.eql(['failed'])
      done()
    }, 5)
  })

  it('catches async errors', function (done) {
    mount(
      <Validate validators={[
        v => {},
        v => Promise.resolve('failed')
      ]}>{_ => { props = _ }}</Validate>
    )
    expect(props.errors).to.eql([])
    setTimeout(() => {
      expect(props.errors).to.eql(['failed'])
      done()
    }, 5)
  })

  it('sets pending prop', function (done) {
    mount(
      <Validate validators={[
        v => {},
        v => Promise.resolve('failed')
      ]}>{_ => { props = _ }}</Validate>
    )
    expect(props.pending).to.be.true
    setTimeout(() => {
      expect(props.pending).to.be.false
      done()
    }, 5)
  })

  it('runs initial validation', function (done) {
    mount(
      <Validate value={42} validators={[
        v => v === 42 ? 'failed' : undefined
      ]}>{_ => { props = _ }}</Validate>
    )
    setTimeout(() => {
      expect(props.valid).to.be.false
      expect(props.errors).to.eql(['failed'])
      done()
    }, 5)
  })

  it('warns if async validator rejected', function (done) {
    let warning, err
    global.__VALIDATOR_WARN__ = (_warning, _err) => {
      warning = _warning
      err = _err
    }

    mount(
      <Validate value={42} validators={[
        v => new Promise(() => { throw new Error('oops') })
      ]}>{_ => { props = _ }}</Validate>
    )
    setTimeout(() => {
      expect(props.valid).to.be.true
      expect(props.errors).to.eql([])
      expect(warning).to.equal('Validation failed')
      expect(err).to.match(/oops/)
      done()
    }, 5)
  })
})
