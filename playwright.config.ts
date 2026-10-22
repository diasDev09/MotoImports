import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    // pasta onde ficam os testes E2E (fora de src/, para o Vitest não pegá-los)
    testDir: './e2e',

    // falha o build se alguém esquecer um test.only
    forbidOnly: !!process.env.CI,
    // no CI, tenta de novo uma vez antes de dar erro (testes de navegador oscilam)
    retries: process.env.CI ? 1 : 0,

    use: {
        // com isso, page.goto('/') abre http://localhost:5173/
        baseURL: 'http://localhost:5173',
        // guarda o rastro da execução só quando um teste falha
        trace: 'on-first-retry',
    },

    projects: [
        // só Chromium no começo: roda mais rápido
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],

    // sobe o app antes dos testes e desliga no final
    webServer: {
        command: 'npm run dev -- --port 5173 --strictPort',
        url: 'http://localhost:5173',
        // localmente reaproveita o servidor se você já estiver com `npm run dev` aberto
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
    },
})