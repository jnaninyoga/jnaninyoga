import PropTypes from "prop-types"

Wrapper.propTypes = {
    children: PropTypes.node
}

export default function Wrapper(props) {
  return (
    <section className="w-screen flex flex-1 justify-center items-center flex-col overflow-hidden">
        {props.children}
    </section>
  )
}
