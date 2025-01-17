const BlogForm = ({
    handleCreate,
    handleTitleChange,
    handleAuthorChange,
    handleUrlChange,
    newTitle,
    newAuthor,
    newUrl
   }) => {
   return (
     <div>
       <h2>Login</h2>
 
       <form onSubmit={handleCreate}>
         <div>
           title:
           <input
           type="text"
             value={newTitle}
             onChange={handleTitleChange}
           />
         </div>
         <div>
           author:
           <input
             type="text"
             value={newAuthor}
             onChange={handleAuthorChange}
           />
       </div>
       <div>
           url:
           <input
             type="text"
             value={newUrl}
             onChange={handleUrlChange}
           />
       </div>
         <button type="submit">create</button>
       </form>
     </div>
   )
 }
 
 export default BlogForm