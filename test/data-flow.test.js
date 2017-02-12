describe('data flow', function () {
  let props

  beforeEach(() => {
    props = {}
    global.__VALIDATOR_WARN__ = undefined
  })

  it('triggers onChange', function (done) {
    const result = {}
    const onChange = (v, valid) => { result[v] = valid }
    const validate = v => v === 'aaa' ? undefined : 'failed'

    mount(
      <Validate onChange={onChange} validators={[validate]}>
        {_ => { props = _ }}
      </Validate>
    )

    setTimeout(() => props.onChange('a'), 1)
    setTimeout(() => props.onChange('aa'), 2)
    setTimeout(() => props.onChange('aaa'), 3)
    setTimeout(() => props.onChange('aaaa'), 4)

    setTimeout(() => {
      expect(result).to.eql({
        a    : false,
        aa   : false,
        aaa  : true,
        aaaa : false
      })
      done()
    }, 7)
  })

  it('does not trigger onChange if explicit', function (done) {
    let called = false
    const onChange = () => { called = true }
    const validate = v => 'failed'

    mount(
      <Validate explicit onChange={onChange} validators={[validate]}>
        {_ => { props = _ }}
      </Validate>
    )

    props.onChange('a')
    props.onChange('aa')
    props.onChange('aaa')
    props.onChange('aaaa')

    setTimeout(() => {
      expect(called).to.be.false
      expect(props.valid).to.true
      expect(props.errors).to.eql([])
      done()
    }, 7)
  })

  it('does not trigger onChange() for aborted validation', function (done) {
    const result = {}
    const onChange = (v, valid) => { result[v] = valid }
    const validate = v => v === 'aaa' ? undefined : 'failed'

    mount(
      <Validate onChange={onChange} validators={[validate]}>
        {_ => { props = _ }}
      </Validate>
    )

    props.onChange('a')
    props.onChange('aa')
    props.onChange('aaa')
    props.onChange('aaaa')

    setTimeout(() => {
      expect(result).to.eql({
        aaaa: false
      })
      done()
    }, 5)
  })

  it('resolves check() with true if valid', function (done) {
    mount(
      <Validate explicit validators={[() => Promise.resolve()]}>
        {_ => { props = _ }}
      </Validate>
    )
    props.check().then(valid => {
      expect(valid).to.be.true
      done()
    }).catch(done)
  })

  it('resolves check() with false if invalid', function (done) {
    mount(
      <Validate explicit validators={[() => Promise.reject()]}>
        {_ => { props = _ }}
      </Validate>
    )
    props.check().then(valid => {
      expect(valid).to.be.false
      done()
    }).catch(done)
  })

  it('aborts skipped async check()', function (done) {
    const result = {}

    const validate = () => new Promise(resolve => {
      setTimeout(resolve, 1)
    })

    mount(
      <Validate explicit validators={[validate]}>
        {_ => { props = _ }}
      </Validate>
    )

    props.check()
      .then(() => { result.r1 = true })
      .catch(() => { result.r1 = false })

    props.check()
      .then(() => { result.r2 = true })
      .catch(() => { result.r2 = false })

    props.check()
    .then(() => { result.r3 = true })
    .catch(() => { result.r3 = false })

    setTimeout(() => {
      expect(result).to.eql({
        r1 : false,
        r2 : false,
        r3 : true
      })
      done()
    }, 5)
  })
})
