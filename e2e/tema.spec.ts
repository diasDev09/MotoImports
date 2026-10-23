import { test, expect } from '@playwright/test'

test('a paleta Ivory está aplicada', async ({ page }) => {
    await page.goto('/')
    // Ivory = #F9F8F7 = rgb(249, 248, 247)
    await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(249, 248, 247)')
})