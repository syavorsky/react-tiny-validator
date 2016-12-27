
describe('render', function () {
  it('throws if props.children is not a function', function () {
    expect(() => mount(<Validate />))
      .to.throw(/Missing a render function/)

    expect(() => mount(<Validate><span /></Validate>))
      .to.throw(/Missing a render function/)
  })

  it('renders children', function () {
    const wrapper = mount(
      <Validate>{() => <span>rendered</span>}</Validate>
    )
    expect(wrapper.contains(<span>rendered</span>))
      .to.equal(true)
  })
})
