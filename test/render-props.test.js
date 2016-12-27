
describe('render props', function () {
  let props

  beforeEach(function () { props = {} })

  it('value defaults to ""', function () {
    mount(<Validate>{_ => { props = _ }}</Validate>)
    expect(props.value = '').to.equal('')
  })

  it('respects props.value', function () {
    mount(<Validate>{_ => { props = _ }}</Validate>)
    expect(props.value).to.equal('')
  })

  it('valid defaults to true', function () {
    mount(<Validate>{_ => { props = _ }}</Validate>)
    expect(props.valid).to.be.true
  })

  it('respects props.valid', function () {
    mount(<Validate valid={false}>{_ => { props = _ }}</Validate>)
    expect(props.valid).to.be.false
  })

  it('pristine by default', function () {
    mount(<Validate valid={false}>{_ => { props = _ }}</Validate>)
    expect(props.pristine).to.be.true
  })

  it('has default name', function () {
    mount(<Validate>{_ => { props = _ }}</Validate>)
    expect(props.name).to.match(/^validate-\d+/)
  })

  it('respects props.name', function () {
    mount(<Validate name='thename'>{_ => { props = _ }}</Validate>)
    expect(props.name).to.equal('thename')
  })

  it('members empty by default', function () {
    mount(<Validate>{_ => { props = _ }}</Validate>)
    expect(props.members).to.eql({})
  })

  it('collects members', function () {
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
    expect(props.members).to.include.keys('member1', 'member2')
  })

  it('errors are empty by default', function () {
    mount(<Validate>{_ => { props = _ }}</Validate>)
    expect(props.errors).to.eql([])
  })
})
