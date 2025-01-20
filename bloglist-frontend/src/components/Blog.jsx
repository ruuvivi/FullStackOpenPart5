import { useState } from 'react'

const Blog = ({ blog, props }) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (

    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
      </div>
      <div style={hideWhenVisible}>
      <button onClick={toggleVisibility}>{props.buttonLabel}</button>
    </div>
    <div style={showWhenVisible}>
      {props.children}
      <button onClick={toggleVisibility}>hide</button>
    </div>
  </div>
)}

export default Blog