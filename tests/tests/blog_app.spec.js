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
    
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Kakkos Testaaja',
                username: 'testi2',
                password: 'testi2salainen'
            }
            })
            const response = await request.post('http://localhost:3003/api/login', {
                data: {
                    "username": "testi2",
                    "password": "testi2salainen"
                }
            })
            const data = await response.json()
    
        await request.post('http://localhost:3003/api/blogs', {
            data: {
                title: 'testi2Title',
                author: 'testi2Author',
                url: 'testi2salainen',
                likes: 77,
            },
            headers: {
                authorization: 'Bearer ' + data.token
            }
        })
        await request.post('http://localhost:3003/api/blogs', {
            data: {
                title: 'testi3Title',
                author: 'testi2Author',
                url: 'testi2salainen',
                likes: 11,
            },
            headers: {
                authorization: 'Bearer ' + data.token
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
        beforeEach(async ({ page, request }) => {
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
            const listElement = page.getByTestId('testiTitle')
            expect(listElement).toContainText('testiTitle')
            expect(listElement).toContainText('testiAuthor')
        })
        test('a blog can be liked', async ({ page }) => {
        
            await page.getByRole('button', { name: 'create a new blog' }).click()

            await page.getByTestId('title').fill('testiTitle')
            await page.getByTestId('author').fill('testiAuthor')
            await page.getByTestId('url').fill('testiUrl')

            await page.getByRole('button', { name: 'create' }).click()
            await expect(page.getByText('a new blog testiTitle added')).toBeVisible()
            const listElement = page.getByTestId('testiTitle')
            expect(listElement).toContainText('testiTitle')
            expect(listElement).toContainText('testiAuthor')

            await listElement.getByRole('button', { name: 'show' }).click()
            expect(listElement).toContainText('Likes: 0')
            await listElement.getByRole('button', { name: 'like' }).click()
            expect(listElement).toContainText('Likes: 1')
        })
        test('a blog can be deleted', async ({ page }) => {
        
            await page.getByRole('button', { name: 'create a new blog' }).click()

            await page.getByTestId('title').fill('testiTitle')
            await page.getByTestId('author').fill('testiAuthor')
            await page.getByTestId('url').fill('testiUrl')

            await page.getByRole('button', { name: 'create' }).click()
            await expect(page.getByText('a new blog testiTitle added')).toBeVisible()
            const listElement = page.getByTestId('testiTitle')
            expect(listElement).toContainText('testiTitle')
            expect(listElement).toContainText('testiAuthor')

            await listElement.getByRole('button', { name: 'show' }).click()
            page.on('dialog', dialog => dialog.accept())
            await listElement.getByRole('button', { name: 'delete' }).click()
            expect(listElement).not.toBeVisible()
        })
        test('delete button is seen only by user who has created it', async ({ page }) => {

            const listElement = page.getByTestId('testi2Title')
            expect(listElement).toContainText('testi2Title')
            expect(listElement).toContainText('testi2Author')

            await listElement.getByRole('button', { name: 'show' }).click()
            expect(listElement).not.toContainText("delete")
        })
        test('blogs are arranged in the order according to the likes, the blog with the most likes first', async ({ page, request }) => {
            await page.getByRole('button', { name: 'create a new blog' }).click()

            await page.getByTestId('title').fill('testiTitle')
            await page.getByTestId('author').fill('testiAuthor')
            await page.getByTestId('url').fill('testiUrl')

            await page.getByRole('button', { name: 'create' }).click()
            await expect(page.getByText('a new blog testiTitle added')).toBeVisible()
            const nameList = await page.locator('li');
            const expectedNamesAscending = ['testi2Title', 'testi3Title', 'testiTitle'];
            await expect(nameList).toContainText(expectedNamesAscending);
        })
    })
})