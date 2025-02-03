const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Testi Testaaja',
            username: 'testi',
            password: 'testisalainen'
          }
        })
    
        await page.goto('http://localhost:5173')
      })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {

            await page.getByTestId('username').fill('testi')
            await page.getByTestId('password').fill('testisalainen')

            await page.getByRole('button', { name: 'login' }).click()
        
            await expect(page.getByText('Testi Testaaja logged in')).toBeVisible()
        
        })
    
        test('fails with wrong credentials', async ({ page }) => {
          
            await page.getByTestId('username').fill('failtesti')
            await page.getByTestId('password').fill('failtestisalainen')

            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByText('wrong username or password')).toBeVisible()
        })
    })
    describe('When logged in', () => {
        beforeEach(async ({ page }) => {

            await page.getByTestId('username').fill('testi')
            await page.getByTestId('password').fill('testisalainen')

            await page.getByRole('button', { name: 'login' }).click()
        })
    
        test('a new blog can be created', async ({ page }) => {
        
            await page.getByRole('button', { name: 'create a new blog' }).click()

            await page.getByTestId('title').fill('testiTitle')
            await page.getByTestId('author').fill('testiAuthor')
            await page.getByTestId('url').fill('testiUrl')

            await page.getByRole('button', { name: 'create' }).click()
            await expect(page.getByText('a new blog testiTitle added')).toBeVisible()
            expect(page.locator('.blog')).toContainText('testiTitle')
            expect(page.locator('.blog')).toContainText('testi')
        })
        test('a blog can be liked', async ({ page }) => {
        
            await page.getByRole('button', { name: 'create a new blog' }).click()

            await page.getByTestId('title').fill('testiTitle')
            await page.getByTestId('author').fill('testiAuthor')
            await page.getByTestId('url').fill('testiUrl')

            await page.getByRole('button', { name: 'create' }).click()
            await expect(page.getByText('a new blog testiTitle added')).toBeVisible()
            expect(page.locator('.blog')).toContainText('testiTitle')
            expect(page.locator('.blog')).toContainText('testiAuthor')

            await page.getByRole('button', { name: 'show' }).click()
            expect(page.locator('.blog')).toContainText('Likes: 0')
            await page.getByRole('button', { name: 'like' }).click()
            expect(page.locator('.blog')).toContainText('Likes: 1')
        })
        test('a blog can be deleted', async ({ page }) => {
        
            await page.getByRole('button', { name: 'create a new blog' }).click()

            await page.getByTestId('title').fill('testiTitle')
            await page.getByTestId('author').fill('testiAuthor')
            await page.getByTestId('url').fill('testiUrl')

            await page.getByRole('button', { name: 'create' }).click()
            await expect(page.getByText('a new blog testiTitle added')).toBeVisible()
            expect(page.locator('.blog')).toContainText('testiTitle')
            expect(page.locator('.blog')).toContainText('testiAuthor')

            await page.getByRole('button', { name: 'show' }).click()
            page.on('dialog', dialog => dialog.accept())
            await page.getByRole('button', { name: 'delete' }).click()
            expect(page.locator('.blog')).not.toContainText('testiAuthor')
        })
    })
})