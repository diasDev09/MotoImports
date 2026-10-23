import { test, expect } from '@playwright/test'

test('o tema musgo está aplicado', async ({ page }) => {
    await page.goto('/')
    // musgo-50 = #E4E6DA = rgb(228, 230, 218)
    await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(228, 230, 218)')
})