const Notification = ({ notification, error }) => {
    if (notification, error === null) {
      return null
    }
    if (error) {
        return (
            <div className='error'>
              {error}
            </div>
          )
    }
    else if (notification) {
        return (
            <div className='notification'>
                {notification}
            </div>
    )
  }
}

  export default Notification