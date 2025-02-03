import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

const userTest = {
  username: 'Test User',
  name: 'Test Name'
}

const blog = {
  title: 'Test Title',
  author: 'Test Author',
  url: 'www.testblog.com',
  likes: 100,
  user: userTest
}

const defaultProps = {
  blog: blog,
  user: userTest,
  deleteBlog: vi.fn,
  updateBlogLike: vi.fn
}

test('renders title and author', () => {

  const { container } = render(<Blog {...defaultProps} />)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Test Author'
  )
  expect(div).toHaveTextContent(
    'Test Title'
  )

  expect(div).not.toHaveTextContent(
    'www.testblog.com'
  )

  expect(div).not.toHaveTextContent(
    100
  )
}
)

test('clicking the button for shown details shows URL and likes', async () => {

  const { container } = render(<Blog {...defaultProps} />)

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'www.testblog.com'
  )
  expect(div).toHaveTextContent(
    100
  )
})

test('clicking the like button twice calls twice event handler', async () => {

  const mockHandler = vi.fn()

  render(<Blog {...defaultProps} updateBlogLike={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)

  await user.click(likeButton)
  expect(mockHandler).toHaveBeenCalledTimes(2)
})