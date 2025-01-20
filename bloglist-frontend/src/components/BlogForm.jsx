const BlogForm = ({ onSubmit, handleChange, newTitle, newAuthor, newUrl }) => {
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          title:
          <input
            type="text"
            name="title"
            value={newTitle}
            onChange={handleChange}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            name="author"
            value={newAuthor}
            onChange={handleChange}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            name="url"
            value={newUrl}
            onChange={handleChange}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;