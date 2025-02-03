import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlogLike, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  console.log(user)
  console.log(blog)
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  return (
    <li className='blog'>
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>
            {visible ? 'hide' : 'show'}
          </button>
        </div>
        {visible && (
          <div>
            <p>{blog.url}</p>
            <p>Likes: {blog.likes} <button onClick={() => updateBlogLike(blog)}> like</button></p>
            <p>{blog.author}</p>
            {user.username === blog.user.username && <p><button onClick={() => deleteBlog(blog)}> delete</button></p>}
          </div>
        )}
      </div>
    </li>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlogLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog