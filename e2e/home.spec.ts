import { test, expect } from '@playwright/test'

test('a página inicial carrega', async ({ page }) => {
    await page.goto('/') // usa o baseURL do config

    // no projeto recém-criado pelo Vite, o título da aba vem do index.html
    await expect(page).toHaveTitle(/.+/)
    await expect(page.locator('#root')).toBeVisible()
})