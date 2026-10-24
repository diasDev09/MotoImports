# MotoImports v2

Site de uma loja de motos importadas: catálogo, ficha com preço final, simulador de financiamento e consórcio, reserva com voucher, oficina e boutique. Projeto acadêmico de demonstração: nenhuma reserva ou pedido gera cobrança.

- Relatório do projeto: https://diasdev09.github.io/MotoImports/
- Mapa interativo do código: https://diasdev09.github.io/MotoImports/mapa/
- Versão 1 (legado): branch `v1-legado`

## Stack

Vite 8, React 19, TypeScript estrito, React Router 7, Tailwind CSS 4, React Hook Form com Zod, Firebase (Authentication e Firestore), Vitest, Testing Library, Playwright e oxlint.

## Como rodar

```bash
git clone https://github.com/diasDev09/MotoImports.git
cd MotoImports
npm install
cp .env.example .env.local   # preencha as 4 variáveis VITE_FIREBASE_*
npm run dev
```

Sem o `.env.local` o site funciona, mas sem login nem gravação de dados. Configuração do Firebase: [docs/LOGIN-GOOGLE.md](docs/LOGIN-GOOGLE.md) e [docs/FIRESTORE.md](docs/FIRESTORE.md).

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm test` | Testes unitários e de componentes (Vitest) |
| `npm run lint` | oxlint |
| `npm run build` | Checagem de tipos e build de produção |
| `npx playwright test` | Testes E2E |

## Telas

| Rota | Tela | Requisitos |
| --- | --- | --- |
| `/` | Início | RF-01 |
| `/catalogo` | Catálogo com filtros na URL | RF-03 |
| `/moto/:id` | Ficha, preço composto e simulador | RF-02, RF-07 |
| `/checkout` | Reserva e voucher (exige login) | RF-08 |
| `/oficina` | Agendamento de serviço (exige login) | RF-10 |
| `/boutique` | Equipamentos e carrinho | |
| `/contato` | Contato e proposta | RF-01, RF-05, RF-06 |
| `*` | Página não encontrada | |

## Estrutura

```
src/
  pages/        uma página por rota
  components/   menu, formulários, cartões, modal, voucher
  context/      estado global (moto, acessórios, lead, simulação)
  features/     filtros do catálogo
  domain/       regras puras: preço, financiamento, reserva
  utils/        validações, agenda, formatadores
  data/         motos, acessórios, boutique, serviços, alíquotas
  auth/         login com Google e barreira ExigeLogin
  storage/      interface Repositorio e implementação em Firestore
  lib/          inicialização do Firebase
  test/         utilitários de teste (login e repositório falsos)
public/img/     fotos em WebP (motos 4:3, boutique 1:1)
e2e/            testes Playwright
site/           relatório e mapa do código (GitHub Pages)
```

Regra de negócio fica em funções puras, sem React. As telas só conhecem as interfaces de login e de `Repositorio`, ambas injetáveis, por isso os testes rodam sem rede.

## Login e dados

O login usa o Google. Ele é exigido para reservar, confirmar pedido na boutique e agendar na oficina. Os dados vão para o Firestore:

- `users/{uid}/reservas/{código}`
- `users/{uid}/pedidosBoutique/{id}`
- `users/{uid}/agendamentos/{id}`
- `leads/{id}` (contato, criação pública)

As regras estão em `firestore.rules`: cada pessoa lê e cria só o que está sob o próprio `uid`; não há edição nem exclusão. As chaves do Firebase não são segredos, quem protege os dados são as regras.

## Visual

Paleta Ivory `#F9F8F7` (página), Almond `#EDEAE4` (cartões), Mist `#ADB8BB`, Navy `#153147` (ação e faixas) e Noir `#232A2F` (texto). Títulos em Georgia, texto na fonte do sistema. Os tokens ficam em `src/index.css`.

## Qualidade

343 testes em 35 arquivos, mais E2E. O Husky roda lint e testes no commit. O CI (`.github/workflows/ci.yml`) roda lint, testes e build em todo push e PR para a `main`. A pasta `site/` é publicada pelo workflow `pages.yml`.

## Como contribuir

1. Crie uma branch a partir da `main` (`feat/...`, `fix/...`, `docs/...`).
2. Um commit por passo, com mensagem no padrão Conventional Commits.
3. Rode `npm test`, `npm run lint` e `npm run build` antes do PR.
4. Versões são tags no formato `vX.Y.Z`, criadas na `main` depois do merge.

## Pendências

Do cliente: WhatsApp e e-mail comerciais, lojas de retirada reais, alíquotas e taxas reais, vídeos de test-ride, serviços e dias da oficina.

Técnicas: testar as regras do Firestore no emulador e publicá-las; proteger o formulário de contato (App Check ou login); validar preços no servidor se os pedidos deixarem de ser demonstração; política de privacidade e retenção (LGPD); página de minhas reservas; agenda real da oficina; reduzir o pacote principal (cerca de 556 kB); revisar as fotos, que são geradas por IA; escolher a licença. Lista completa no [relatório](https://diasdev09.github.io/MotoImports/#pendencias).

## Equipe

Projeto do grupo MotoImports. A v1 foi feita em grupo e a v2 reconstrói o projeto passo a passo, mantendo o crédito de quem escreveu cada parte portada.
