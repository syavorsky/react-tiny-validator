
describe('render', function () {
  it('throws if props.children is not a function', function () {
    const re = /Expected props\.children to be a function/

    expect(() => mount(<Validate />)).to.throw(re)
    expect(() => mount(<Validate><span /></Validate>)).to.throw(re)
  })

  it('renders children', function () {
    const wrapper = mount(
      <Validate>{() => <span>rendered</span>}</Validate>
    )
    expect(wrapper.contains(<span>rendered</span>))
      .to.equal(true)
  })
})
