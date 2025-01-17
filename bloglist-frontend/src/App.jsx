import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState('')
  const [newTitle, setnewTitle] = useState('')
  const [newAuthor, setnewAuthor] = useState('')
  const [newUrl, setnewUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [createVisible, setCreateVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const createBlog = async (event) => {
    event.preventDefault()
    
    try {
      const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }
  
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setnewTitle('')
    setnewAuthor('')
    setnewUrl('')
    setNotificationMessage(`a new blog ${returnedBlog.title} added`);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  } catch (error) {
    setErrorMessage(error)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
  }
  
  const handleBlogChange = (event) => {
    const { name, value } = event.target

    if (name === 'title') {
      setnewTitle(value)
    } else if (name === 'author') {
      setnewAuthor(value)
    } else if (name === 'url') {
      setnewUrl(value)
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage('wrong  username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null);
    console.log("Logout clicked");
}

const blogForm = () => (
  <form onSubmit={createBlog}>
    <div>
      title:
      <input
          type="text"
          name="title"
          value={newTitle}
          onChange={handleBlogChange}
        />
    </div>
    <div>
      author:
      <input
          type="text"
          name="author"
          value={newAuthor}
          onChange={handleBlogChange}
        />
    </div>
    <div>
      url:
      <input
          type="text"
          name="url"
          value={newUrl}
          onChange={handleBlogChange}
        />
    </div>
    <button type="submit">create</button>
  </form>
  )

  /*const blogForm = () => {
    const hideWhenVisible = { display: createVisible ? 'none' : '' }
    const showWhenVisible = { display: createVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setCreateVisible(true)}>create</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm
            title={title}
            author={author}
            url={url}
            handleTitleChange={({ target }) => setnewTitle(target.value)}
            handleAuthorChange={({ target }) => setnewAuthor(target.value)}
            handleUrlChange={({ target }) => setnewUrl(target.value)}
            handleCreate={handleBlogChange}
          />
          <button onClick={() => setCreateVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }*/

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  return (
    <div>
      <Notification notification={notificationMessage} error={errorMessage}/>
      {!user && loginForm()}
      {user && <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <h2>create new</h2>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
    }
    </div>
  )
}

export default App