import { test, expect } from '@playwright/test'

test('o tema grunge está aplicado', async ({ page }) => {
    await page.goto('/')
    // tinta = #2E2E2E = rgb(46, 46, 46)
    await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(46, 46, 46)')
})