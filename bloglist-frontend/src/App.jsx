import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

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

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }
  
    blogService
    .create(blogObject)
    .then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setnewTitle('')
      setnewAuthor('')
      setnewUrl('')
      setNotificationMessage(`a new blog ${user.name} added`);
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    })
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
        'loggedNoteappUser', JSON.stringify(user)
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
    window.localStorage.clear()
    console.log("Logout clicked");
}

const blogForm = () => (
  <form onSubmit={addBlog}>
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

  if (user === null) {
    return (
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
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notificationMessage} error={errorMessage}/>
      <p>{user.name} logged in
        <form>
          <button onClick={handleLogout}>logout</button>
        </form>
      </p>
      <h2>create new</h2>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App