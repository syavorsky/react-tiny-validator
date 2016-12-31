
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

  it('runs default member validation', function (done) {
    mount(
      <Validate>
        {_ => {
          props = _
          return (
            <div>
              <Validate name='member1' parent={_.group}>{() => <span />}</Validate>
              <Validate name='member2' parent={_.group}>{() => <span />}</Validate>
            </div>
          )
        }}
      </Validate>
    )
    setTimeout(() => {
      expect(props.errors).to.eql([])
      expect(props.members).to.have.keys({
        member1 : {valid: true, errors: []},
        member2 : {valid: true, errors: []}
      })
      done()
    }, 5)
  })

  it('passes members data to validators', function (done) {
    let members
    mount(
      <Validate validators={[(_, _members) => { members = _members }]}>
        {_ => {
          props = _
          return (
            <div>
              <Validate name='member1'
                parent={_.group}
                validators={[() => 'member err 1']}>
                {() => <span />}
              </Validate>
              <Validate name='member2'
                parent={_.group}
                validators={[() => 'member err 2', () => 'member err 3']}>
                {() => <span />}
              </Validate>
            </div>
          )
        }}
      </Validate>
    )
    setTimeout(() => {
      expect(members).to.have.keys({
        member1 : {valid: false, errors: ['member err 1']},
        member2 : {valid: false, errors: ['member err 2', 'member err 3']}
      })
      done()
    }, 5)
  })

  it('runs sync validation only once', function (done) {
    let calls = 0
    mount(
      <Validate validators={[v => { calls++ }]}>
        {() => <span />}
      </Validate>
    )
    setTimeout(() => {
      expect(calls).to.equal(1)
      done()
    }, 5)
  })

  it('runs sync validation only num of members + 1 times', function (done) {
    let calls = 0
    mount(
      <Validate validators={[v => { calls++ }]}>
        {({group}) => (
          <div>
            <Validate name='member1' parent={group}>{() => <span />}</Validate>
            <Validate name='member2' parent={group}>{() => <span />}</Validate>
          </div>
        )}
      </Validate>
    )
    setTimeout(() => {
      expect(calls).to.equal(3)
      done()
    }, 5)
  })

  it('runs async validation only once', function (done) {
    let calls = 0
    const validate = () => new Promise(resolve => {
      setTimeout(() => {
        calls++
        resolve()
      }, 1)
    })
    mount(
      <Validate validators={[validate]}>{() => <span />}</Validate>
    )
    setTimeout(() => {
      expect(calls).to.equal(1)
      done()
    }, 5)
  })

  it('runs async validation only num of members + 1 times', function (done) {
    let calls = 0
    const validate = () => new Promise(resolve => {
      setTimeout(() => {
        calls++
        resolve()
      }, 1)
    })
    mount(
      <Validate validators={[validate]}>
        {({group}) => (
          <div>
            <Validate name='member1' parent={group}>{() => <span />}</Validate>
            <Validate name='member2' parent={group}>{() => <span />}</Validate>
          </div>
        )}
      </Validate>
    )
    setTimeout(() => {
      expect(calls).to.equal(3)
      done()
    }, 5)
  })

  it.only('reacts on members addition/removal', function (done) {
    const runs = []

    class Validators extends React.Component {
      state = {num: 0}
      componentDidMount () {
        const rerender = nums => {
          console.log('rerender', nums[0])
          this.setState({num: nums.shift()})
          if (nums.length) setTimeout(rerender, 5, nums)
        }
        rerender([2, 1])
      }
      render () {
        const {num} = this.state
        const validate = () => {
          console.log('  validate', num)
          return `failed on num:${num}`
        }

        console.log('  render', num)
        return (
          <div>
            {
              Array.from(Array(num || 0)).map((_, i) => {
                return (
                  <Validate key={num + ':' + i} parent={this.props.group}
                    validators={[validate]}>
                    {() => <span />}
                  </Validate>
                )
              })
            }
          </div>
        )
      }
    }

    mount(
      <Validate validators={[(val, members) => { runs.push({val, members}) }]}>
        {({group}) => <Validators goup={group} />}
      </Validate>
    )

    // assume [0,2,1], first render will be ran
    // before first rerender() call

    setTimeout(() => {
      console.log('--->', runs)
      done()
    }, 50)
  })
})
