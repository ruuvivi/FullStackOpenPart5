import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { expect } from 'vitest'


test('creates a blog with right details', async () => {

  const mockHandler = vi.fn()

  const { container } = render(<BlogForm createBlog={mockHandler} />)

  const user = userEvent.setup()
  const inputTitle = container.querySelector('input[name="title"]')
  const inputAuthor = container.querySelector('input[name="author"]')
  const inputUrl = container.querySelector('input[name="url"]')

  await user.type(inputTitle, 'TestTitle2')
  await user.type(inputAuthor, 'TestAuthor2')
  await user.type(inputUrl, 'TestUrl2')

  const sendButton = screen.getByText('create')
  await user.click(sendButton)
  console.log(mockHandler.mock.calls[0][0])
  expect(mockHandler.mock.calls[0][0].title).toBe('TestTitle2')
  expect(mockHandler.mock.calls[0][0].author).toBe('TestAuthor2')
  expect(mockHandler.mock.calls[0][0].url).toBe('TestUrl2')
}
)