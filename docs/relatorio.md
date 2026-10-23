# MotoImports v2 — Relatório do projeto

Relatório de estudo do projeto **MotoImports v2**: como clonar e rodar, a história de como ele foi construído, as tecnologias (para que servem e onde foram usadas) e uma descrição **arquivo por arquivo**, com o que cada `import` e cada `export` faz e quais boas práticas aparecem no código.

> **Como ler:** a Parte 1 é prática (clonar e rodar). A Parte 2 conta a história. A Parte 3 explica as tecnologias. A Parte 4 mostra a arquitetura. A Parte 5 é o mapa de arquivos, o coração do relatório. As Partes 6 a 8 fecham com testes, boas práticas e pendências.
>
> **Sobre a precisão:** a descrição dos arquivos de `src/` foi feita lendo o código da v2 como ele está ao final do Passo 41 (268 testes passando). Os arquivos de configuração que não repliquei no meu ambiente (Playwright, Husky, GitHub Actions, configuração do oxlint) estão descritos pelo papel que têm no roadmap, e isso está sinalizado onde aparece.

## Sumário

1. [Como clonar e rodar o projeto](#parte-1--como-clonar-e-rodar-o-projeto)
2. [A história do projeto](#parte-2--a-história-do-projeto)
3. [Tecnologias: para que servem e onde foram usadas](#parte-3--tecnologias)
4. [Arquitetura e fluxo dos dados](#parte-4--arquitetura-e-fluxo-dos-dados)
5. [Arquivo por arquivo](#parte-5--arquivo-por-arquivo)
6. [Testes](#parte-6--testes)
7. [Boas práticas aplicadas](#parte-7--boas-práticas-aplicadas)
8. [Pendências e decisões em aberto](#parte-8--pendências-e-decisões-em-aberto)
9. [Glossário](#glossário)

---

# Parte 1 — Como clonar e rodar o projeto

## 1.1 O que instalar antes

| Ferramenta                     | Para quê                                 | Como conferir    |
| ------------------------------ | ---------------------------------------- | ---------------- |
| **Git**                        | Baixar o código e versionar as mudanças  | `git --version`  |
| **Node.js** (versão LTS atual) | Executa o Vite, os testes e o lint       | `node --version` |
| **npm** (vem com o Node)       | Instala as bibliotecas do `package.json` | `npm --version`  |
| **VS Code** (opcional)         | Editor usado pela equipe                 | —                |

## 1.2 Clonar

No PowerShell, escolha a pasta onde ficam seus projetos (o nosso é `C:\Documents\dev`) e rode:

```powershell
cd C:\Documents\dev
git clone https://github.com/diasDev09/MotoImports.git motoimports
cd motoimports
```

O `motoimports` no final é o nome da pasta que será criada. Sem ele, o Git usa o nome do repositório (`MotoImports`).

## 1.3 Em qual branch está a v2?

A v2 foi construída do zero, **sem relação de histórico com a v1**. Por isso o GitHub mostrou "entirely different commit histories" ao tentar abrir um Pull Request. Depois que o grupo decidir o caminho (veja o item 1.8), o branch da v2 será um destes:

| Situação                              | Comando para ficar na v2                                   |
| ------------------------------------- | ---------------------------------------------------------- |
| A `main` já é a v2                    | nada a fazer; `git branch` deve mostrar `main`             |
| A v2 ainda está no branch de trabalho | `git checkout feat/motoimports-v2`                         |
| Quer ver a v1                         | `git checkout v1-legado` (branch criado para guardar a v1) |

Para listar todos os branches, inclusive os remotos: `git branch -a`.

## 1.4 Instalar e rodar

```powershell
npm install        # baixa as bibliotecas do package.json (cria node_modules/)
npm run dev        # sobe o servidor de desenvolvimento
```

O terminal mostra um endereço parecido com `http://localhost:5173`. Abra no navegador. Alterou um arquivo? A página atualiza sozinha (HMR, _hot module replacement_).

## 1.5 Comandos do dia a dia

| Comando         | O que faz                                         | Quando usar          |
| --------------- | ------------------------------------------------- | -------------------- |
| `npm run dev`   | Servidor de desenvolvimento                       | Enquanto programa    |
| `npm test`      | Roda os testes uma vez (Vitest)                   | Antes de cada commit |
| `npm run lint`  | Procura erros e más práticas (oxlint)             | Antes de cada commit |
| `npx tsc -b`    | Confere os tipos do TypeScript sem gerar arquivos | Antes de cada commit |
| `npm run build` | Gera a versão de produção em `dist/`              | Antes de publicar    |

**Regra da casa:** os três primeiros (`lint`, `test`, `tsc`) precisam passar **sem erro e sem aviso** antes do commit. O Husky (pre-commit) existe para barrar o commit quando isso não acontece.

## 1.6 Problemas comuns

| Sintoma                                  | Causa provável                                                        | Solução                                                      |
| ---------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------ |
| `npm` não é reconhecido                  | Node não instalado ou terminal aberto antes da instalação             | Instale o Node e abra um terminal novo                       |
| `Cannot find module ...`                 | Faltou `npm install`, ou uma biblioteca nova entrou no `package.json` | Rode `npm install` de novo                                   |
| Módulo `react-day-picker` não encontrado | O Passo 39 pede essa biblioteca                                       | `npm install react-day-picker`                               |
| Porta 5173 ocupada                       | Outro servidor Vite aberto                                            | Feche o outro terminal; o Vite sugere a próxima porta        |
| O commit é recusado                      | O Husky rodou lint/testes e algo falhou                               | Leia a mensagem, corrija e tente de novo                     |
| `error TS2322` em arquivo `.tsx`         | Tipo incompatível (ex.: trocar `string` por uma URL literal)          | Restaure o tipo `string` e ponha o valor no arquivo de dados |

## 1.7 Contribuindo com um passo novo

```powershell
git checkout main
git pull
git checkout -b feat/nome-do-passo
# ... programa, testa ...
npm run lint; npm test; npx tsc -b
git add .
git commit -m "feat(area): o que mudou" -m "Co-authored-by: Nome <email>"
git push -u origin feat/nome-do-passo
```

O `Co-authored-by` só entra quando o código foi portado de uma colega. Mudanças nossas ficam em commit separado e sem essa linha.

## 1.8 Unindo a v2 ao repositório (histórico diferente)

Como a v2 não descende da v1, não existe "merge" comum. Opções discutidas:

1. **Trocar o branch padrão do GitHub para o da v2.** Seguro, não apaga nada.
2. **Fazer a `main` virar a v2, guardando antes a v1:**

```powershell
git fetch origin
git push origin origin/main:refs/heads/v1-legado          # guarda a v1
git checkout feat/motoimports-v2
git push origin feat/motoimports-v2:main --force-with-lease   # a main passa a ser a v2
```

3. Merge com `--allow-unrelated-histories`: não recomendado, mistura arquivos das duas versões e gera conflitos em quase tudo.

Depois da opção 2, quem tem a v1 clonada precisa clonar de novo (ou `git fetch origin` e `git reset --hard origin/main`, que descarta o que não estiver commitado).

---

# Parte 2 — A história do projeto

## 2.1 A v1

A v1 foi feita em grupo, cada pessoa com sua parte, num repositório único ([diasDev09/MotoImports](https://github.com/diasDev09/MotoImports)). Ela provou o conceito (catálogo, simulador, checkout, pós-venda, boutique), mas acumulou problemas típicos de projeto acadêmico: validações com `alert()`, lógica de negócio misturada nos componentes, CSS por página, textos fixos dentro das funções e poucos testes.

## 2.2 Por que reconstruir (a v2)

O Caio decidiu reconstruir o projeto **do zero, passo a passo**, migrando o trabalho da equipe com três objetivos:

1. **Aprender a fazer direito:** TypeScript estrito, testes desde o primeiro passo, lint com regras de React, acessibilidade, commits pequenos.
2. **Manter o crédito da equipe:** cada parte portada da v1 mantém o comportamento original e é assinada com `Co-authored-by` da pessoa que a escreveu. Melhorias nossas entram em commits separados, sem a assinatura.
3. **Seguir a especificação:** o roadmap (um documento no Drive) lista os requisitos funcionais (**RF**), as regras de negócio (**RN**) e os requisitos não funcionais (**RNF**), organizados em iterações de 0 a 4.

## 2.3 A linha do tempo (por passos)

Cada passo gerou **um commit**. Os guias em Markdown (Partes 1 a 5) trazem os arquivos completos de cada passo.

| Fase                                   | Passos            | O que foi construído                                                                                                                                                                        | Autoria portada                  |
| -------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| **Iteração 0 — fundação**              | início do roadmap | Projeto Vite + React + TypeScript estrito, Vitest, lint, Husky, CI e E2E (Playwright)                                                                                                       | —                                |
| **Parte 1 — base e vitrine**           | 12–25             | Tema musgo (Tailwind v4), layout (Navbar, Footer), `AppContext`, formatadores, dados das motos, Home, conta-giros, cartão de destaque, selo de estoque, filtros do catálogo, preço composto | Emilly                           |
| **Parte 2 — domínio do simulador**     | 26–28             | `acessorios.ts`, `financing.ts` (Tabela Price e consórcio), `reservation.ts` (loja, voucher)                                                                                                | Santos                           |
| **Parte 3 — conversão**                | 29–34             | Formulário de lead com validação, modal acessível, vídeo de test-ride, proposta por WhatsApp/e-mail, página de Contato                                                                      | Mylena                           |
| **Parte 4 — telas de venda e serviço** | 35–38             | Simulador, Checkout com voucher, Pós-venda, Boutique                                                                                                                                        | Santos (35, 36), Ariely (37, 38) |
| **Parte 5 — fechamento**               | 39–41             | Calendário com horários ocupados (RF-10), ficha da moto `/moto/:id`, correções no domínio do Santos                                                                                         | Nossas (sem assinatura)          |

> A numeração dos passos 1 a 11 (fundação) segue o roadmap da iteração 0; os guias detalhados começam no Passo 12.

## 2.4 O que foi sendo aprendido pelo caminho

Os erros que apareceram viraram regras da casa. Vale conhecer cada um:

| O que aconteceu                                                                 | Por que aconteceu                                                                                         | Regra que ficou                                                                       |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `TS2322` no `VideoTestRide`: a prop `urlVideo` virou o texto literal de uma URL | Ao editar, o tipo `string` foi trocado pelo valor                                                         | Tipo descreve a _forma_ do dado (`string`); o valor mora em `data/`                   |
| Teste do `App` falhou no Passo 35                                               | A rota `/simulador` ainda apontava para um Placeholder, mas o teste esperava a página real                | Toda página nova entra também em `App.tsx` e no `App.test.tsx`                        |
| Lint reclamou de `setState` dentro de `useEffect` e de dependências faltando    | O `oxlint` sem `--react-plugin` não enxerga essas regras; com o plugin, enxerga                           | Rodar o lint **com as regras de React**, como no `npm run lint` do projeto            |
| Aviso "incompatible library" no Pós-venda                                       | `watch()` do React Hook Form não é compatível com o compilador do React                                   | Usar `subscribe`/`useWatch` em vez de `watch`                                         |
| Teste do Checkout capturava o estado antes do efeito rodar                      | O estado inicial vinha de um `useEffect`                                                                  | `AppProvider` aceita `inicial` (estado de partida) e os testes não dependem de efeito |
| Build falhou no meu ambiente por causa do `@fontsource`                         | A fonte não estava instalada no ambiente de validação                                                     | Detalhe do ambiente de teste, não do projeto; conferir no `npm run build` real        |
| O hook de segurança bloqueou comandos destrutivos                               | Comandos com `rm -rf`                                                                                     | Reescrever sem apagar; explicar o que o comando faz antes de rodar                    |
| Preço duplicado no teste da ficha                                               | O valor aparecia no cabeçalho e na tabela, e o espaço entre `R$` e o número é um espaço **não separável** | Comparar textos normalizando espaços e escolher a consulta por papel (`role`)         |

## 2.5 Decisões de projeto importantes

- **`preco` é sempre o valor final.** O catálogo guarda o preço com frete, despacho e impostos. A composição (quanto é imposto, quanto é frete) é _calculada de trás para frente_ por `decomporPrecoFinal`, e a soma sempre fecha no preço do catálogo (RN-01, RF-02).
- **Regra em `domain/`, tela em `pages/`.** Funções puras de TypeScript, sem React, são testadas sozinhas.
- **Valores que mudam ficam em `data/`.** Alíquotas, taxas, contatos e listas de serviços não ficam dentro das funções.
- **A reserva é fictícia.** Todo voucher traz aviso de simulação (RN-06) e a mensagem do WhatsApp também.
- **Agenda simulada.** Não existe sistema da oficina; a ocupação dos horários vem de uma função determinística que pode ser trocada por uma API depois.
- **Acessibilidade desde o início.** Foco no modal, `aria-live`, `aria-invalid`, rótulos ligados aos campos, selo de estoque com ícone e texto, respeito a `prefers-reduced-motion`.

---

# Parte 3 — Tecnologias

## 3.1 Visão geral

| Tecnologia                                              | Para que serve (em geral)                                                           | Para que serviu aqui                                                                                              | Onde foi aplicada                                                  |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **TypeScript** (estrito)                                | JavaScript com tipos, que acusa erros antes de rodar                                | Garantir que `Moto`, `Lead`, `Voucher` etc. sejam usados do jeito certo; listas fechadas (`as const`) viram tipos | Todo `src/`; opções em `tsconfig.json`                             |
| **React 19**                                            | Biblioteca para montar telas com componentes                                        | Todas as telas e componentes; estado com `useState`; `<title>` por página direto no componente                    | `components/`, `pages/`, `context/`                                |
| **Vite**                                                | Servidor de desenvolvimento e empacotador (build) rápido                            | Rodar o site com atualização instantânea e gerar `dist/`                                                          | `index.html`, `vite.config.ts`                                     |
| **React Router**                                        | Navegação entre páginas sem recarregar                                              | Rotas (`/catalogo`, `/moto/:id`...), parâmetros de URL (`:id`, `?moto=`), `NavLink`, `useNavigate`                | `App.tsx`, `main.tsx`, `Navbar`, `Footer`, `useCatalogFilters`     |
| **Tailwind CSS v4**                                     | Estilo por classes utilitárias direto no HTML/JSX                                   | Todo o visual; tema "musgo" definido uma vez em `@theme`                                                          | `index.css` e as classes em todos os `.tsx`                        |
| **@fontsource/poppins**                                 | Fonte hospedada no próprio projeto (sem depender do Google)                         | Fonte dos títulos (`font-display`)                                                                                | `main.tsx` e `index.css`                                           |
| **React Hook Form**                                     | Gerencia formulários sem re-renderizar a cada tecla                                 | Formulário de contato e de agendamento                                                                            | `LeadForm.tsx`, `PosVenda.tsx`                                     |
| **Zod 4**                                               | Descreve e valida dados com regras e mensagens                                      | _Schemas_ de lead, agendamento e checkout; também geram os tipos TypeScript                                       | `domain/lead.ts`, `domain/agendamento.ts`, `domain/reservation.ts` |
| **@hookform/resolvers**                                 | Liga o Zod ao React Hook Form                                                       | O formulário usa o schema do domínio como única fonte das regras                                                  | `LeadForm.tsx`, `PosVenda.tsx`                                     |
| **react-day-picker**                                    | Componente de calendário acessível                                                  | Escolha da data no Pós-venda, com dias passados desabilitados                                                     | `PosVenda.tsx`                                                     |
| **Vitest**                                              | Executor de testes compatível com Vite                                              | Todos os testes de domínio, componentes e páginas                                                                 | `*.test.ts(x)`, `vite.config.ts`                                   |
| **jsdom**                                               | Simula um navegador dentro do Node                                                  | Permite renderizar componentes nos testes                                                                         | `vite.config.ts` (`environment: 'jsdom'`)                          |
| **Testing Library** (`react`, `jest-dom`, `user-event`) | Testar a tela como o usuário usa (buscar por papel, texto, rótulo; clicar; digitar) | Testes de páginas e componentes                                                                                   | `test/setup.ts` e todos os `*.test.tsx`                            |
| **Playwright**                                          | Testes ponta a ponta no navegador real                                              | Percursos completos (E2E) _(configuração do repositório do projeto)_                                              | pasta de E2E do repositório                                        |
| **oxlint**                                              | Linter muito rápido, com regras de React                                            | Barra erros e más práticas antes do commit                                                                        | `npm run lint`                                                     |
| **Husky**                                               | Roda comandos em eventos do Git                                                     | Impede commit com lint/testes quebrados _(configuração do repositório)_                                           | `.husky/`                                                          |
| **GitHub Actions**                                      | Automação (CI) no GitHub                                                            | Roda lint, testes e build a cada push/PR _(configuração do repositório)_                                          | `.github/workflows/`                                               |
| **Git / GitHub**                                        | Versionamento e colaboração                                                         | Um commit por passo; `Co-authored-by` credita a equipe                                                            | todo o repositório                                                 |

## 3.2 Como cada tecnologia funciona (em linguagem simples)

**TypeScript.** Você escreve `interface Moto { id: string; preco: number }` e, se algum lugar tentar usar `moto.preço`, o editor acusa na hora. As opções do `tsconfig.json` deste projeto são rígidas de propósito:

| Opção                                   | O que faz                                                                                      |
| --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `strict`                                | Liga o pacote de verificações rigorosas (por exemplo, não aceita `null` onde não foi previsto) |
| `noUnusedLocals` / `noUnusedParameters` | Acusa variável ou parâmetro que ninguém usa                                                    |
| `verbatimModuleSyntax`                  | Obriga `import type` quando o que se importa é só tipo (deixa claro o que vai para o bundle)   |
| `allowImportingTsExtensions`            | Permite `import ... from './x.ts'`; é por isso que os imports têm extensão                     |
| `erasableSyntaxOnly`                    | Proíbe recursos do TS que geram código (como `enum`); só sintaxe que "some" na compilação      |
| `noFallthroughCasesInSwitch`            | Acusa `case` sem `break`/`return`                                                              |
| `jsx: react-jsx`                        | Dispensa `import React` em cada arquivo                                                        |
| `moduleResolution: bundler`             | Resolução de módulos como o Vite faz                                                           |

**React.** Uma tela é uma função que devolve JSX. Estado (`useState`) guarda o que muda; quando o estado muda, a função roda de novo e a tela se atualiza. Efeitos (`useEffect`) são para falar com o "mundo de fora" (timer, `document`, foco), não para calcular dados.

**Vite.** Em desenvolvimento serve os arquivos sob demanda (por isso é rápido); no `build` junta e minifica tudo em `dist/`.

**React Router.** `<Routes>` e `<Route>` ligam um endereço a uma página. `useParams()` lê `:id` em `/moto/:id`. `useSearchParams()` lê e escreve `?categoria=Sport`. `useNavigate()` muda de página por código.

**Tailwind v4.** Em vez de arquivos CSS por página, você escreve `className="rounded-card bg-white p-6"`. O tema (cores, raio, largura) fica em `@theme` no `index.css` e vira classes como `bg-musgo-600`, `rounded-card`, `max-w-site`.

**React Hook Form + Zod.** O Zod define o que é um dado válido (e a mensagem de erro de cada campo). O React Hook Form cuida do estado do formulário e chama o Zod ao enviar. As regras ficam em `domain/` e a tela só mostra os erros.

**Vitest + Testing Library.** Os testes renderizam a tela e agem como uma pessoa: `screen.getByRole('button', { name: /reservar/i })`, `user.click(...)`. Se um teste depende do rótulo acessível, ele também garante a acessibilidade.

## 3.3 Paleta e tokens do tema (`index.css`)

| Token                 | Valor                 | Uso                                 |
| --------------------- | --------------------- | ----------------------------------- |
| `musgo-50`            | `#E4E6DA`             | Fundo da página                     |
| `musgo-200`           | `#C2CFB4`             | Fundos suaves, hover, bordas        |
| `musgo-400`           | `#8AA88A`             | Bordas de campos                    |
| `musgo-600`           | `#48654E`             | Botão principal, textos secundários |
| `musgo-900`           | `#253529`             | Texto principal, cabeçalhos escuros |
| `aviso`               | `#F3D98B`             | Avisos e selo "em trânsito"         |
| `info`                | `#B9D4EA`             | Selo "sob pedido"                   |
| `erro-fundo` / `erro` | `#F4C7C3` / `#9B2C2C` | Mensagens de erro                   |

Regra de contraste: **texto branco só sobre musgo 600 ou 900**; as demais cores levam texto escuro e sempre um ícone ou texto, para a informação não depender só de cor.

---

# Parte 4 — Arquitetura e fluxo dos dados

## 4.1 Camadas

```
┌────────────────────────────────────────────┐
│ pages/        uma tela por rota            │  ← o que a pessoa vê
│ components/   peças reutilizáveis          │
├────────────────────────────────────────────┤
│ features/     lógica de tela reutilizável  │  ← "cola" entre tela e regra
│ context/      estado compartilhado         │
├────────────────────────────────────────────┤
│ domain/       regras de negócio (TS puro)  │  ← testadas sem interface
│ utils/        formatadores                 │
├────────────────────────────────────────────┤
│ data/         dados e configuração         │  ← o que muda sem mexer na lógica
└────────────────────────────────────────────┘
```

**Regra de dependência:** de cima para baixo. `domain/` nunca importa `pages/` nem `components/` (só tipos e `data/`). `data/` quase não importa nada. Isso mantém a regra de negócio testável e reaproveitável.

## 4.2 Estado compartilhado (`AppContext`)

| Campo                            | O que guarda                  | Quem escreve        | Quem lê                                        |
| -------------------------------- | ----------------------------- | ------------------- | ---------------------------------------------- |
| `motoSelecionada`                | Moto escolhida                | Ficha, Simulador    | Contato, Checkout, Navbar                      |
| `acessorios` / `totalAcessorios` | Acessórios na reserva         | Simulador, Checkout | Navbar (contador), Checkout                    |
| `lead`                           | Contato já digitado           | LeadForm, Checkout  | Contato (proposta), Checkout (preenche campos) |
| `simulacao`                      | Último resultado do simulador | Simulador           | Checkout, voucher                              |
| `voucherReserva`                 | Reserva gerada                | Checkout            | Checkout (mostra o voucher)                    |
| `horariosReservados`             | Horários agendados na sessão  | Pós-venda           | Pós-venda (bloqueia horários)                  |

O estado vive **só na memória**: ao recarregar a página, volta ao início. Isso é proposital nesta fase (não há back-end).

## 4.3 Fluxo principal do cliente

```
Home → Catálogo (filtros na URL) → Ficha /moto/:id
                                     ├─ Simular → /simulador?moto=id → "Reservar" → /checkout → Voucher
                                     ├─ Reservar → /checkout
                                     └─ Pedir proposta → /contato → Lead → Proposta (WhatsApp / e-mail)
Pós-venda (/pos-venda) e Boutique (/boutique) são fluxos paralelos.
```

---

# Parte 5 — Arquivo por arquivo

**Como cada ficha está organizada:** _para que serve_ → _imports_ (o que entra e por quê) → _exports_ (o que sai e o que faz) → _boas práticas_ vistas no arquivo. Nas funções internas (que não são exportadas) o texto diz "interna".

**Dois detalhes que valem para todo o projeto:**

- Os imports de arquivos locais levam a extensão (`./x.ts`, `./Y.tsx`) por causa de `allowImportingTsExtensions`.
- `import type { ... }` é usado quando só se importa um tipo (`verbatimModuleSyntax`). Esses imports somem na compilação e deixam claro que não há dependência de código.

## 5.1 Mapa de pastas

```
index.html                    ponto de entrada do navegador
src/
  main.tsx                    liga o React ao HTML, Router e estado global
  index.css                   Tailwind + tema musgo
  App.tsx                     layout fixo + tabela de rotas
  context/                    estado compartilhado (AppContext, AppProvider)
  data/                       dados e configuração
  domain/                     regras de negócio (TS puro)
  features/catalogo/          hook de filtros do catálogo
  utils/                      formatadores
  components/                 peças reutilizáveis (+ boutique/)
  pages/                      uma página por rota
  test/setup.ts               preparação dos testes
```

---

## 5.2 Arquivos de configuração e entrada

### `index.html`

**Para que serve:** única página HTML real do site (é uma _SPA_, _single page application_). O navegador carrega esta página e o React desenha tudo dentro dela.
**Conteúdo:** `<html lang="pt-BR">` (idioma para leitores de tela), uma `<div id="root">` vazia e `<script type="module" src="/src/main.tsx">`.
**Boa prática:** `lang` correto e `<title>` definido (no projeto real o título tem que ser descritivo; as páginas novas, como a ficha da moto, definem o próprio `<title>`).

### `package.json`

**Para que serve:** lista as bibliotecas e os comandos (`scripts`) do projeto.
**Pontos de atenção:** `"type": "module"` (o projeto usa `import`/`export` modernos); `dependencies` são as que vão para o site (react, react-router-dom, react-hook-form, zod, @hookform/resolvers, react-day-picker, @fontsource/poppins) e `devDependencies` só ajudam a desenvolver (vite, vitest, typescript, oxlint, testing-library, tailwindcss...). Os números com `^` aceitam atualização _menor_ (ex.: `^4.6.7` aceita 4.7.0, mas não 5.0.0).
**Boa prática:** `package-lock.json` é versionado, para todo mundo instalar exatamente as mesmas versões.

### `tsconfig.json`

**Para que serve:** configura o TypeScript (opções explicadas na seção 3.2). `"include": ["src"]` limita a checagem à pasta `src`. `noEmit: true`: o TS só confere tipos; quem gera o JavaScript é o Vite.

### `vite.config.ts`

**Para que serve:** configura o Vite e o Vitest no mesmo arquivo.
**Imports:** `defineConfig` de `vitest/config` (dá autocompletar para as opções, inclusive `test`); `react` de `@vitejs/plugin-react` (ensina o Vite a processar JSX).
**Opções:** `environment: 'jsdom'` (testes simulam o navegador), `setupFiles: './src/test/setup.ts'` (roda antes de cada arquivo de teste), `include: ['src/**/*.{test,spec}.{ts,tsx}']` (quais arquivos são testes).
**Observação:** no projeto real, o Tailwind v4 entra como plugin do Vite (`@tailwindcss/vite`) neste mesmo arquivo.

### `src/main.tsx`

**Para que serve:** ponto de partida da aplicação.
**Imports:**

- `StrictMode` (react): ajuda a achar erros em desenvolvimento, renderizando duas vezes certos trechos; não afeta a produção.
- `createRoot` (react-dom/client): cria a "raiz" do React dentro da `<div id="root">`.
- `BrowserRouter` (react-router-dom): habilita rotas usando a URL do navegador.
- `@fontsource/poppins/600.css` e `/800.css`: carregam a fonte (peso semibold e extrabold). São _imports de efeito colateral_, sem nome.
- `./index.css`: carrega Tailwind e o tema.
- `App` e `AppProvider`: a aplicação e o estado global.
  **Exports:** nenhum.
  **Ordem de camadas (de fora para dentro):** `StrictMode` → `BrowserRouter` → `AppProvider` → `App`. O Router fica por fora para que o `AppProvider` e todas as páginas possam usar rotas.
  **Boa prática:** o `!` em `getElementById('root')!` é um aviso consciente ao TypeScript de que o elemento existe; a alternativa seria checar `null`.

### `src/index.css`

**Para que serve:** carrega o Tailwind e define o tema.

- `@import "tailwindcss"`: carrega o Tailwind v4.
- `@theme { ... }`: cria tokens que viram classes: `--color-musgo-600` vira `bg-musgo-600`, `text-musgo-600`...; `--radius-card` vira `rounded-card`; `--container-site` vira `max-w-site`; `--font-display` vira `font-display`.
- `@layer base`: estilos globais: fundo e texto do `html`, títulos (`h1`–`h3`) na fonte display, e `:focus-visible` com contorno bem visível (acessibilidade para quem navega por teclado).
- `@utility destaque`: cria a classe `destaque` (faixa de realce atrás de uma palavra, como no design).

### `src/test/setup.ts`

**Para que serve:** roda antes de cada arquivo de teste.
**Imports:** `@testing-library/jest-dom/vitest` (adiciona verificações como `toBeInTheDocument`, `toBeDisabled`, `toHaveValue`); `afterEach` (vitest); `cleanup` (testing-library/react).
**O que faz:** depois de cada teste, `cleanup()` remove o que foi renderizado, para um teste não contaminar o outro.

---

## 5.3 `src/App.tsx` — layout e rotas

**Para que serve:** monta o esqueleto do site (Navbar, conteúdo, Footer) e liga cada URL à sua página.
**Imports:** `Routes`, `Route` (react-router-dom); `Navbar`, `Footer`, `Placeholder`; as oito páginas (`Home`, `Catalogo`, `Contato`, `Simulador`, `Checkout`, `PosVenda`, `Boutique`, `MotoDetalhe`).
**Export:** `default function App()`.
**Tabela de rotas:**

| Rota                 | Página                                    |
| -------------------- | ----------------------------------------- |
| `/`                  | `Home`                                    |
| `/catalogo`          | `Catalogo`                                |
| `/moto/:id`          | `MotoDetalhe`                             |
| `/contato`           | `Contato`                                 |
| `/simulador`         | `Simulador`                               |
| `/checkout`          | `Checkout`                                |
| `/pos-venda`         | `PosVenda`                                |
| `/boutique`          | `Boutique`                                |
| `*` (qualquer outra) | `Placeholder` com "Página não encontrada" |

**Boas práticas:** a Navbar e o Footer ficam _fora_ de `<Routes>`, então não são recriados a cada navegação; o conteúdo principal fica numa área com `id="conteudo"`, alvo do link "Ir para o conteúdo" da Navbar; a rota `*` trata endereços inexistentes.

---

## 5.4 `src/context/` — estado compartilhado

### `context/AppContext.ts`

**Para que serve:** define **o formato** do estado compartilhado e o atalho para usá-lo. Não tem componente, por isso a extensão é `.ts`.
**Imports:** `createContext`, `useContext` (react); tipos `Moto`, `LeadRegistrado`, `simularOperacao` (usado só para derivar o tipo), `VoucherReserva`, `ReservaHorario`.
**Exports:**

| Export                      | O que é                                                                                                                                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `interface Acessorio`       | `{ id, nome, preco }`: um acessório na reserva                                                                                                                                                            |
| `type Simulacao`            | `ReturnType<typeof simularOperacao>`: o tipo é **derivado** da função, então se o resultado mudar, o tipo muda junto (sem duplicar definição)                                                             |
| `interface AppContextValue` | Tudo que o contexto oferece: estado (`motoSelecionada`, `acessorios`, `lead`, `simulacao`, `voucherReserva`, `horariosReservados`) e ações (`selecionarMoto`, `adicionarAcessorio`, `reservarHorario`...) |
| `const AppContext`          | O contexto em si, começa como `null`                                                                                                                                                                      |
| `function useApp()`         | Hook de atalho: devolve o contexto ou **lança erro** se usado fora do `AppProvider`                                                                                                                       |

**Boa prática:** `useApp` falha de forma barulhenta e clara ("precisa estar dentro do AppProvider") em vez de devolver `null` e quebrar longe do problema.

### `context/AppProvider.tsx`

**Para que serve:** componente que guarda o estado e o entrega ao resto do app.
**Imports:** `useMemo`, `useState`; tipos; `AppContext`.
**Exports:**

- `interface EstadoInicial`: `{ moto, acessorios, lead, simulacao }` opcionais. Existe para os **testes** começarem com o app já num estado, sem precisar de efeito.
- `function AppProvider({ children, inicial })`: cria seis `useState`; define `adicionarAcessorio` (**não repete** o mesmo acessório), `removerAcessorio`, `totalAcessorios` (soma, em `useMemo`, só recalcula quando a lista muda) e `reservarHorario` (acrescenta uma reserva de forma imutável).
  **Boas práticas:** atualização imutável (`[...atual, novo]`, `filter`), nunca `push` no array do estado; `useMemo` só onde há cálculo; ações com nomes em português que dizem o que fazem.

---

## 5.5 `src/data/` — dados e configuração

> Regra: **dados mudam, lógica não**. Quem quiser trocar preço, taxa ou contato edita estes arquivos.

### `data/motos.ts`

**Para que serve:** catálogo de motos e o vocabulário do domínio (categorias, modos de pilotagem, estoque).
**Exports:**

| Export                                           | O que é                                                                                                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CATEGORIAS` e `type Categoria`                  | `['Naked','Sport','Trail/Adventure','Custom'] as const`. O `as const` transforma a lista em tipo: valor fora da lista dá erro de TypeScript                   |
| `MODOS_PILOTAGEM` e `type ModoPilotagem`         | Rain, Road, Sport, Track, Off-Road                                                                                                                            |
| `CILINDRADA_MIN` (300) e `CILINDRADA_MAX` (1900) | Limites do filtro de cilindrada. A v1 tinha 1250, o que deixava BMW GS (1254 cc) e Fat Boy (1868 cc) de fora                                                  |
| `ESTOQUE` e `type StatusEstoque`                 | Rótulos do selo: `pronta-entrega`, `em-transito`, `sob-pedido`                                                                                                |
| `interface Moto`                                 | `id`, `nome`, `marca`, `categoria`, `cilindrada`, `potenciaCv`, `modos`, `preco` (**valor final**), `estoque`, `prazoDias`, `videoUrl`, `imagem`, `destaques` |
| `const motos`                                    | A lista de 9 motos (R$ 54.900 a R$ 169.900)                                                                                                                   |

**Boas práticas:** vocabulário único com `as const`; `readonly` nas listas; comentário explicando que `preco` já inclui tudo; `videoUrl` e `imagem` como `string` (vazio = ainda não cadastrado).

### `data/acessorios.ts`

**Para que serve:** catálogo de acessórios técnicos (RF-11): escapamento, bauletos, protetor de motor, quickshifter, suporte de GPS, sliders.
**Imports:** `type Categoria` (de `motos.ts`).
**Exports:** `interface AcessorioTecnico` (inclui `compatibilidade: readonly Categoria[]` e `garantiaMeses`) e `const ACESSORIOS_TECNICOS`.
**Uso:** o Simulador filtra por `compatibilidade.includes(moto.categoria)`, assim bauleto de aventureira não aparece para uma esportiva.
**Atenção:** as imagens são links externos de exemplo; trocar por fotos próprias antes de publicar.

### `data/boutique.ts`

**Para que serve:** produtos da boutique (capacetes, vestuário, acessórios, manutenção) e o guia de tamanhos.
**Exports:** `CATEGORIAS_BOUTIQUE`, `ESTILOS_CAPACETE`, `CERTIFICACOES` (cada um com seu tipo derivado), `type TamanhoCapacete`, `interface ProdutoBoutique` (campos de capacete como `estilo`, `certificacoes`, `tamanhos` são **opcionais**), `PRODUTOS_BOUTIQUE`, `FORMAS_PAGAMENTO_BOUTIQUE` (+ tipo) e `GUIA_TAMANHOS`.
**Detalhe:** o preço aceita centavos (ex.: 599,90); por isso a boutique usa `formatarPrecoComCentavos`.

### `data/contato.ts`

**Export:** `CONTATO_COMERCIAL = { whatsapp, email }`, hoje **vazios**. Enquanto vazio, o WhatsApp abre sem contato definido e o e-mail abre sem destinatário. É uma decisão pendente do cliente (ver Parte 8).

### `data/parametros-precificacao.ts`

**Import:** `type ParametrosPrecificacao` (de `domain/pricing.ts`).
**Export:** `PARAMETROS_PRECIFICACAO`: frete R$ 4.500, despacho R$ 2.500, imposto de importação 35% sobre (base + frete), impostos fiscais 25% sobre (base + frete + imposto de importação). **Valores provisórios** (risco R2). A regra RN-01 manda que fiquem aqui e nunca dentro das funções.

### `data/posVenda.ts`

**Exports:** `SERVICOS` (revisão, óleo, freios, diagnóstico, cada um com `id`, `nome`, `descricao`, `duracao`), `type ServicoId` (derivado da lista) e `HORARIOS` (`['08:00' ... '16:00']`, sem 12:00, `as const`).
**Boa prática:** para incluir um serviço ou horário basta editar a lista; o schema Zod e a tela se atualizam sozinhos porque leem desta fonte.

---

## 5.6 `src/utils/formatters.ts`

**Para que serve:** único lugar que formata valores. "Use sempre estas funções para mostrar valores, assim o site inteiro fica igual."
**Exports:**

| Função                            | O que faz                                                                                                                  | Exemplo                              |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `formatarPreco(valor)`            | Real brasileiro sem centavos (`toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })`) | `54900` → `R$ 54.900`                |
| `formatarPrecoComCentavos(valor)` | Igual, **com** centavos (a boutique precisa; sem isso 599,90 viraria 600)                                                  | `599.9` → `R$ 599,90`                |
| `formatarCilindrada(cc)`          | Número em pt-BR com "cc"                                                                                                   | `1254` → `1.254 cc`                  |
| `linkWhatsApp(numero, mensagem)`  | Monta `https://wa.me/{numero}?text=...` com `encodeURIComponent`                                                           | número só com dígitos, com DDI e DDD |

**Boa prática:** `encodeURIComponent` protege acentos, espaços e `&` na URL. Atenção: o espaço entre `R$` e o número gerado por `toLocaleString` é um espaço **não separável**, o que importa na hora de testar textos.

---

## 5.7 `src/domain/` — regras de negócio

> Tudo aqui é **TypeScript puro**: sem React, sem tela. Cada função recebe dados e devolve dados, por isso é fácil de testar e de reaproveitar.

### `domain/pricing.ts` (RN-01, RF-02)

**Para que serve:** preço final "tudo incluso" e a sua composição.
**Sem imports.**
**Exports:**

| Export                                           | O que faz                                                                                                                                                                                                                                                |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `interface ParametrosPrecificacao`               | `freteInternacional`, `despachoAduaneiro`, `aliquotaImpostoImportacao`, `aliquotaImpostosFiscais`                                                                                                                                                        |
| `interface ComposicaoPreco`                      | `base`, `frete`, `despacho`, `impostoImportacao`, `impostosFiscais`, `total`                                                                                                                                                                             |
| `calcularComposicaoPreco(precoBase, parametros)` | **Do preço base para o final**: o imposto de importação incide sobre (base + frete); os impostos fiscais incidem sobre (base + frete + imposto de importação); soma tudo no `total`                                                                      |
| `calcularPrecoFinal(precoBase, parametros)`      | Atalho: só o `total`                                                                                                                                                                                                                                     |
| `decomporPrecoFinal(precoFinal, parametros)`     | **O caminho inverso**: o catálogo guarda o preço final, e esta função descobre o que é base, frete, despacho e impostos. O total devolvido é **igual ao preço recebido**; sobras de centavos vão para os impostos fiscais, para a soma fechar exatamente |

**Funções internas:** `arredondar` (centavos, evita `0.1 + 0.2 = 0.30000000000000004`), `validarNaoNegativo` e `validarParametros` (lançam `RangeError` com mensagem clara).
**Boas práticas:** validação de entrada; arredondamento em um só lugar; `RangeError` para valor fora da faixa; parâmetros recebidos por argumento (a função não conhece `data/`).

### `domain/financing.ts` (RF-07, RN-03, RN-04, RN-07)

**Para que serve:** simulação de financiamento (Tabela Price) e consórcio.
**Exports:**

| Export                                                                                             | O que é/faz                                                                                                                                              |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type Modalidade`                                                                                  | `'financiamento' \| 'consorcio'`                                                                                                                         |
| `interface ItemComPreco`, `MotoSimulavel`, `ResultadoValidacaoEntrada`                             | Tipos mínimos: a simulação só exige que a moto tenha `preco`                                                                                             |
| `PARAMETROS_FINANCEIROS`                                                                           | Financiamento: 1,49% a.m., entrada 20–80%; consórcio: 12% de taxa administrativa + 2% de fundo de reserva, entrada 10–70%; prazos 12, 24, 36, 48, 60, 72 |
| `validarLimitesEntrada(valorTotal, valorEntrada, modalidade)`                                      | Diz se a entrada está na faixa e devolve mínimo e máximo em reais, com mensagem                                                                          |
| `calcularFinanciamento({ saldoDevedor, meses, taxaMensal })`                                       | **Tabela Price**: `PMT = PV · i·(1+i)^n / ((1+i)^n − 1)`; devolve parcela, total com juros e total de juros                                              |
| `calcularConsorcio({ valorBem, lanceEntrada, meses, ... })`                                        | Custo do plano = bem + taxa administrativa + fundo de reserva; abate o lance e divide em parcelas, **sem juros bancários**                               |
| `simularOperacao({ moto, acessorios, modalidade, meses, valorEntrada \| percentualEntrada, ... })` | Junta tudo: soma acessórios se incluídos (RN-07), ajusta a entrada aos limites, calcula as duas modalidades e a economia do consórcio                    |

**Correções do Passo 41:** a simulação devolve `entradaSolicitada` e `entradaAjustada` (avisa quando a entrada foi corrigida); recusa prazo fora da lista com `RangeError`; os rótulos "Juros de Financiamento (1,49% a.m.)" e "Taxa Administrativa (12% diluída)" são montados a partir dos parâmetros por uma função interna `percentual`.
**Boas práticas:** genéricos (`simularOperacao<M extends MotoSimulavel>`) preservam o tipo da moto recebida; parâmetros nomeados em objeto (`{ meses, taxaMensal }`) para ninguém trocar a ordem; arredondamento em centavos; casos de borda (saldo zero, taxa zero).

### `domain/reservation.ts` (RF-08, RN-02, RN-05, RN-06, RNF-05)

**Para que serve:** checkout fictício: loja de retirada, prazo, validação, voucher e mensagem de WhatsApp.
**Imports:** `z` (zod); tipos `Moto`, `StatusEstoque`, `ItemComPreco`, `simularOperacao`.
**Exports:**

| Export                                                                                        | O que faz                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `interface Loja`, `type FormaPagamento`, `interface ClienteCheckout`, `interface ItemReserva` | Tipos do checkout                                                                                                                                                                          |
| `LOJAS_RETIRADA`                                                                              | 5 lojas **fictícias**                                                                                                                                                                      |
| `estimarPrazoRetirada(status)`                                                                | RN-02: pronta-entrega → 48 horas úteis; em trânsito → 15 a 30 dias; sob pedido → 45 a 60 dias; desconhecido → "sob consulta"                                                               |
| `gerarCodigoVoucher(uf)`                                                                      | Código `MI-ANO-UF-XXXXX` (5 caracteres aleatórios)                                                                                                                                         |
| `calcularDataExpiracao(dias = 7)`                                                             | Validade da reserva (RN-05)                                                                                                                                                                |
| `validarDadosCheckout({ cliente, lojaId, consentimentoLGPD })`                                | Valida com **schema Zod** e devolve `{ valido, erros }` (uma mensagem por campo). Telefone: 10 ou 11 dígitos                                                                               |
| `criarVoucherReserva({...})`                                                                  | Monta o voucher: código, status `CONFIRMADA_SIMULACAO`, aviso de simulação (RN-06), dados do cliente, da moto, dos acessórios, financeiro (inclui um "sinal fictício" de 5%) e da retirada |
| `type VoucherReserva`                                                                         | Tipo derivado do retorno de `criarVoucherReserva`                                                                                                                                          |
| `formatarMensagemWhatsAppVoucher(voucher)`                                                    | Texto para o WhatsApp, com o aviso de **reserva de demonstração** e sem prometer "taxa zero"                                                                                               |

**Boas práticas:** o schema Zod fica fora da função (criado uma vez); `erros[campo] ??= mensagem` guarda só a primeira mensagem de cada campo; `LOJAS_RETIRADA.find(...) ?? LOJAS_RETIRADA[0]` evita loja indefinida; consentimento LGPD obrigatório (`z.literal(true)`).

### `domain/lead.ts` (RF-01, RNF-05)

**Para que serve:** validação do contato do interessado e máscara de telefone.
**Import:** `z` (zod).
**Exports:**

| Export                    | O que faz                                                                                                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `somenteDigitos(texto)`   | Remove tudo que não é número (`"(81) 99999-9999"` → `"81999999999"`)                                                                                                                                                           |
| `formatarTelefone(valor)` | Máscara enquanto digita: `(81) 99999-9999` (celular) ou `(81) 9999-9999` (fixo); limita a 11 dígitos                                                                                                                           |
| `leadSchema`              | Schema Zod: nome (mín. 2), e-mail (`z.email`), telefone (10–11 dígitos, **transformado** para só dígitos), cidade (letras, inclusive acentos e apóstrofo), mensagem (até 500, opcional) e `consentimento` (precisa ser `true`) |
| `type LeadEntrada`        | `z.input`: o que o formulário preenche (antes de transformar)                                                                                                                                                                  |
| `type Lead`               | `z.output`: o que sai validado (telefone já só com dígitos)                                                                                                                                                                    |
| `type LeadRegistrado`     | `Lead & { motoId: string \| null }`: o lead guardado no app                                                                                                                                                                    |

**Boas práticas:** os tipos vêm do schema (uma fonte da verdade); `\p{L}` com a flag `u` aceita qualquer letra; consentimento explícito (LGPD).

### `domain/proposal.ts` (RF-06)

**Para que serve:** monta a proposta enviada por WhatsApp ou e-mail. Funções puras: só montam texto e links; quem abre é o navegador.
**Imports:** `formatarTelefone` e `LeadRegistrado` (lead), `linkWhatsApp` (formatters).
**Exports:**

- `interface ContextoProposta` (`nomeMoto?`, `preco?` já formatado).
- `montarMensagemProposta(lead, contexto)`: texto com nome, cidade, WhatsApp, e-mail e a moto (se houver).
- `montarUrlWhatsApp(mensagem, numero?)`: com número, usa `linkWhatsApp`; **sem número**, abre `https://wa.me/?text=` para a pessoa escolher o contato.
- `montarUrlEmail(mensagem, nomeMoto?, emailComercial?)`: URL `mailto:` com assunto e corpo codificados.
  **Boa prática:** funciona mesmo com contatos vazios (decisão pendente), sem quebrar.

### `domain/catalogFilters.ts` (RF-03)

**Para que serve:** filtros do catálogo. Os filtros são **cumulativos (AND)** e um filtro vazio (`undefined` ou `null`) não restringe nada.
**Exports:**

- `interface MotoFiltravel` (`categoria`, `cilindrada`, `modos`): o mínimo que uma moto precisa ter para ser filtrada.
- `interface FiltrosCatalogo`.
- `filtrarMotos<T extends MotoFiltravel>(motos, filtros): T[]`: genérico, devolve o **mesmo tipo** recebido.
- `contarFiltrosAtivos(filtros, limites)`: quantos filtros estão ligados (para mostrar "Limpar filtros"). O de cilindrada só conta quando saiu do limite.
  **Boa prática:** `!= null` pega `null` **e** `undefined`, mas deixa o `0` passar (0 é um valor válido).

### `domain/boutique.ts`

**Para que serve:** filtros e carrinho da boutique (porte da Ariely). Cada função recebe o estado atual e **devolve um novo**.
**Import:** tipos de `data/boutique.ts`.
**Exports:**

| Export                                                | O que faz                                                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `interface ItemCarrinho`                              | `chave`, `produto`, `tamanho`, `quantidade`                                                      |
| `interface Filtros` e `FILTROS_INICIAIS`              | Busca, categoria, estilo, certificação (valores "Todos"/"Todas")                                 |
| `normalizar(texto)`                                   | Tira acentos e maiúsculas (`normalize('NFD')` e remove marcas): "Vestuário" casa com "vestuario" |
| `filtrarProdutos(produtos, filtros)`                  | Busca por nome/descrição; estilo e certificação só valem **dentro da categoria Capacetes**       |
| `exigeTamanho(produto)`                               | `true` se o produto tem lista de tamanhos                                                        |
| `chaveItem(produto, tamanho)`                         | `"id-tamanho"`; o mesmo capacete em tamanhos diferentes são itens diferentes                     |
| `adicionarAoCarrinho(carrinho, produto, tamanho)`     | Soma 1 se o item existe, ou cria                                                                 |
| `alterarQuantidade(carrinho, chave, variacao)`        | +1/−1; chegando a zero, o item sai                                                               |
| `removerItem`, `totalItens`, `subtotal`, `valorTotal` | Remoção e totais                                                                                 |

**Boa prática:** dinheiro calculado em **centavos inteiros** (`Math.round(preco * 100) * quantidade / 100`), para `599,90 × 3` não virar `1799,7000000000003`.

### `domain/agenda.ts` (RF-10)

**Para que serve:** quais horários da oficina estão livres.
**Import:** `HORARIOS` (de `data/posVenda.ts`).
**Exports:**

- `interface ReservaHorario { data, horario }`.
- `type Ocupacao = (data) => readonly string[]`: **quem diz o que está ocupado**. Hoje é uma simulação; amanhã pode ser uma API da oficina, sem mudar o resto.
- `agendaSimulada(data)`: soma os dígitos da data e marca como ocupados os horários cujo `(índice + soma) % 4 === 0` (2 de 8 por dia, sempre os mesmos para a mesma data).
- `horarioOcupado(data, horario, ocupacao, reservas)`: ocupado pela oficina **ou** já agendado na sessão (só na mesma data).
- `horariosLivres(data, ocupacao, reservas)`: os que sobram.
  **Boa prática:** _injeção de dependência_: a regra recebe a função de ocupação por parâmetro, e por isso é testável e trocável.

### `domain/agendamento.ts` (Pós-venda)

**Para que serve:** validação do pedido de agendamento. Na v1 era feita com `alert()`; aqui as mensagens aparecem junto de cada campo.
**Imports:** `z`; `HORARIOS`, `SERVICOS`; `horarioOcupado` e tipos de `agenda.ts`; `somenteDigitos`.
**Exports:**

- `dataIsoLocal(data)`: `"2026-10-23"` **no fuso do navegador** (`toISOString` usaria UTC e viraria o dia à noite).
- `formatarDataIso(iso)`: `"2026-10-23"` → `"23/10/2026"`.
- `criarAgendamentoSchema(hoje, ocupacao, reservas)`: schema com serviço (`z.enum`), nome, telefone, moto, data (formato `AAAA-MM-DD` e **hoje em diante**), horário, observações e consentimento LGPD; no `superRefine` recusa horário ocupado ("Esse horário já está ocupado. Escolha outro.").
- `type AgendamentoEntrada` e `type Agendamento`: entrada e saída do schema.
  **Boas práticas:** "hoje" e a agenda entram como **parâmetro**, então o teste não depende do relógio nem da oficina; datas em texto `AAAA-MM-DD` comparam corretamente como texto.

---

## 5.8 `src/features/catalogo/useCatalogFilters.ts`

**Para que serve:** hook que liga a URL aos filtros do catálogo. **A URL é a fonte da verdade**: `/catalogo?categoria=Sport&modo=Track&cc=900`. Assim o link da Home já funciona e dá para compartilhar a busca.
**Imports:** `useCallback`, `useMemo`; `useSearchParams`; `motos` e constantes; `filtrarMotos`, `contarFiltrosAtivos`.
**Export:** `useCatalogFilters()` devolve `categoria`, `modo`, `cilindradaMax`, `resultado`, `filtrosAtivos` e as ações `definirCategoria`, `definirModo`, `definirCilindradaMax` e `limpar`.
**Funções internas:** `ehCategoria` e `ehModo` (_type guards_: confirmam que o texto da URL é um valor válido e ajudam o TypeScript a estreitar o tipo) e `lerCilindrada` (lê o número, usa o máximo se inválido e prende entre mínimo e máximo).
**Boas práticas:** nunca confiar na URL (valor desconhecido vira "sem filtro"); `replace: true` para não encher o histórico a cada clique; `useMemo` só refiltra quando um filtro muda; `useCallback` mantém a função estável.

---

## 5.9 `src/components/` — peças reutilizáveis

### `Navbar.tsx`

Menu fixo no topo (`sticky`). **Imports:** `useState`, `Link`, `NavLink`, `useApp`. **Export:** `default Navbar`.
Mostra os links (Catálogo, Simulador, Pós-venda, Boutique, **Contato** como botão escuro), o link **Reserva** com o contador de acessórios (RF-11) e um menu "hambúrguer" no celular (`useState` aberto/fechado).
**Boas práticas:** `NavLink` marca a página atual; **"Ir para o conteúdo"** (`sr-only` que aparece ao receber foco) deixa quem usa teclado pular o menu.

### `Footer.tsx`

Rodapé em três colunas (apresentação, navegação, contato) com `Link`. `/#sobre` leva à âncora da Home. **Export:** `default Footer`.

### `Placeholder.tsx`

Página provisória/erro. **Props:** `titulo`, `mensagem?` (padrão "Esta página está em construção."). Hoje serve só à rota `*` (página não encontrada).

### `Modal.tsx`

Janela de diálogo **acessível**, usada pela proposta e pelo vídeo. **Imports:** `useEffect`, `useId`, `useRef`, `ReactNode`. **Export:** `default Modal({ aberto, titulo, aoFechar, children })`.
**O que faz:** `Esc` fecha; clicar no fundo fecha (e `stopPropagation` evita fechar ao clicar dentro); trava a rolagem da página; leva o foco para o diálogo, **prende o Tab** dentro dele (função interna `prenderFoco`) e **devolve o foco** ao botão de origem ao fechar.
**Boas práticas (WCAG 2.4.3):** `role="dialog"`, `aria-modal`, `aria-labelledby` ligado ao título (`useId` gera um id único); o _cleanup_ do `useEffect` desfaz tudo (overflow, listener, foco); `return null` quando fechado.

### `StockBadge.tsx` (RF-09)

Selo de estoque. **Imports:** `ESTOQUE`, `StatusEstoque`. **Prop:** `status`. Cada estado tem **ícone + texto + cor** (✓ pronta entrega, ⏱ em trânsito, ✈ sob pedido), de modo que a informação não depende só de cor. Status desconhecido retorna `null` (não quebra a tela).

### `CartaoDestaque.tsx`

Cartão da vitrine e do catálogo. **Imports:** `Link`, `StockBadge`, `Moto`, formatadores. **Prop:** `moto`. Mostra foto (ou a cilindrada grande, quando não há foto), selo, marca, nome, potência, **preço final com "com frete e impostos"** e o link "Ver detalhes" para `/moto/:id`.

### `ContaGiros.tsx`

Conta-giros em **SVG** do hero da Home, com a agulha animada por **transição de CSS**. **Imports:** `useEffect`, `useState`.
**Funções internas:** `angulo(valor)` (posição no mostrador → graus), `ponto(graus, raio)` (trigonometria: ângulo e raio → x, y) e `arco(de, ate, raio)` (caminho de um arco de círculo).
**Como anima:** a agulha começa em 0; um `requestAnimationFrame` muda o estado para o valor final, e o CSS (`transition-transform duration-[1800ms]`) faz o movimento. `motion-reduce:transition-none` **respeita** quem desativou animações no sistema.
**Acessibilidade:** `role="img"` e `aria-label` descrevem o gráfico; o `data-testid="agulha"` serve ao teste.

### `VideoTestRide.tsx` (RF-05)

Botão "▶ Ver test-ride" que abre o vídeo num `Modal`. **Props:** `urlVideo` (**tipo `string`**), `titulo?`. O `<iframe>` só existe com o modal aberto: fechar interrompe o vídeo e evita carregar o player à toa.

### `LeadForm.tsx` (RF-01)

Formulário de contato. **Imports:** `useForm`, `zodResolver`, `leadSchema`, `formatarTelefone`, tipos.
**Props:** `aoEnviar(lead)` e `motoInteresse`. **Interna:** `Campo` (rótulo ligado ao input e erro anunciado por leitor de tela) e `enviar(dados)` (monta o `LeadRegistrado` com o `motoId`).
**Boas práticas:** as regras vêm do `leadSchema` (nada duplicado); máscara do telefone no `onChange`; consentimento LGPD obrigatório.

### `ProposalModal.tsx` (RF-06)

Mostra a proposta e deixa enviar por WhatsApp ou e-mail. **Imports:** `Modal`, `montarMensagemProposta`, `montarUrlEmail`, `montarUrlWhatsApp`, `CONTATO_COMERCIAL`. **Props:** `aberto`, `lead`, `contexto?`, `aoFechar`.
**Boas práticas:** link do WhatsApp com `target="_blank"` e `rel="noopener noreferrer"` (impede que a página aberta controle a nossa).

### `VoucherReserva.tsx` (RF-08)

Comprovante da reserva fictícia. **Imports:** `useEffect`, `useRef`, `useState`, `formatarMensagemWhatsAppVoucher`, `formatarPreco`, `linkWhatsApp`. **Props:** `voucher`, `aoNovaReserva`.
**Internas:** `data(iso)`, `hora(iso)`, `Secao`, `copiarCodigo()` (usa `navigator.clipboard`, com `try/catch`: sem permissão, a pessoa ainda vê o código na tela).
**Efeitos:** ao aparecer, o **foco vai para o título** (leitor de tela anuncia o resultado); a mensagem "Código copiado" some sozinha, com _cleanup_ do `setTimeout`.
**Aviso:** o topo mostra, em `role="alert"`, que é uma **simulação** e que nenhuma cobrança foi feita (RN-06).

### `components/boutique/CartaoProduto.tsx`

Cartão de produto: imagem, nome, preço (com centavos), seletor de tamanho para capacetes e botão "Adicionar". **Props:** `produto`, `tamanho`, `erro`, `aoEscolherTamanho`, `aoAdicionar`. Mostra o erro "Selecione o tamanho…" ligado ao campo.

### `components/boutique/CarrinhoBoutique.tsx`

Carrinho de demonstração: itens com +/−/remover, subtotal, total e forma de pagamento. **Imports:** `FORMAS_PAGAMENTO_BOUTIQUE`, `subtotal`, `totalItens`, `valorTotal`, `formatarPrecoComCentavos`. Os cálculos vêm de `domain/boutique.ts`; o componente só mostra.

### `components/boutique/GuiaTamanhos.tsx`

Tabela do guia de tamanhos, lida de `GUIA_TAMANHOS`.

---

## 5.10 `src/pages/` — uma página por rota

### `Home.tsx` (`/`)

**Imports:** `useEffect`, `Link`, `useLocation`, `ContaGiros`, `CartaoDestaque`, `motos`, `Moto`. **Export:** `default Home`.
Seções: hero com conta-giros, faixa de vantagens, vitrine, estilos (links para `/catalogo?categoria=...`), passos "Escolha, Compare, Simule, Feche", diferenciais e "Sobre".
**Detalhe técnico:** o React Router não rola até a âncora sozinho; um `useEffect` com `useLocation().hash` faz `scrollIntoView()`, e o `key` da navegação faz funcionar de novo quando se clica no mesmo link duas vezes.
**Boas práticas:** `idsDestaque` seleciona as motos por **id** e `.filter((m): m is Moto => m !== undefined)` (type guard) descarta ids que não existam, sem quebrar a Home.

### `Catalogo.tsx` (`/catalogo`) — RF-03

Usa `useCatalogFilters` e `CartaoDestaque`. Mostra filtros (categoria, modo de pilotagem e slider de cilindrada), a contagem de resultados e o botão "Limpar filtros". Container com `role="search"` e `aria-label`.

### `MotoDetalhe.tsx` (`/moto/:id`) — RF-02, RF-05, RF-09

**Imports:** `Link`, `useNavigate`, `useParams`, `StockBadge`, `VideoTestRide`, `useApp`, `motos`, `PARAMETROS_PRECIFICACAO`, `decomporPrecoFinal`, formatadores.
**Estrutura:** `default MotoDetalhe` lê o `id` da URL e escolhe entre `Ficha` e `NaoEncontrada`.

- `comporPreco(preco)` (interna): chama `decomporPrecoFinal` dentro de `try/catch`; se o preço for menor que os custos fixos, devolve `null` e a página só **esconde o detalhamento** em vez de quebrar.
- `Ficha` (interna): foto (ou cilindrada grande), selo, prazo, preço final, botões **Simular financiamento** (`/simulador?moto=id`), **Reservar esta moto** (`selecionarMoto` + `/checkout`), **Pedir proposta** (`selecionarMoto` + `/contato`), test-ride se houver `videoUrl`, ficha técnica, destaques e "Como chegamos ao preço" num `<details>`.
- `NaoEncontrada` (interna): "Moto não encontrada" com link ao catálogo.
  **Boas práticas:** `<title>` próprio por página (React 19) para SEO e para quem usa várias abas; texto "sem taxas adicionais" como informação (RF-02); lista de ficha com `<dl>` (semântica correta).

### `Contato.tsx` (`/contato`) — RF-01, RF-05, RF-06

Junta `LeadForm`, `VideoTestRide` (se a moto escolhida tem vídeo) e `ProposalModal` (depois que o lead existe). O botão "Receber proposta" só aparece depois do formulário enviado.

### `Simulador.tsx` (`/simulador`) — RF-07, RF-11

**Imports principais:** `useState`, `Link`, `useNavigate`, `useSearchParams`, `useApp`, `motos`, `ACESSORIOS_TECNICOS`, `CONTATO_COMERCIAL`, `PARAMETROS_FINANCEIROS`, `simularOperacao`, `montarUrlWhatsApp`, `formatarPreco`.
**Estado local:** modalidade, prazo (48 por padrão), incluir acessórios, percentual de entrada (30).
**Lógica:** a moto vem de `?moto=` da URL, depois da moto escolhida no app, depois da primeira da lista; os limites da entrada **mudam com a modalidade** (financiamento 20–80%, consórcio 10–70%) e o percentual é "preso" (`Math.min/max`) à faixa; a simulação é **calculada a cada render** (`simularOperacao`), sem `useEffect`.
**Funções internas:** `trocarMoto(id)` (atualiza a moto e a URL com `replace`) e `irParaCheckout()` (guarda moto e simulação no contexto e navega).
**Boas práticas:** valor derivado é calculado, não guardado em estado; acessórios filtrados pela categoria da moto.

### `Checkout.tsx` (`/checkout`) — RF-08, RNF-05

**Imports principais:** `useState`, `Link`, `VoucherReserva`, `useApp`, `formatarTelefone`, `somenteDigitos`, `LOJAS_RETIRADA`, `criarVoucherReserva`, `estimarPrazoRetirada`, `validarDadosCheckout`.
**Fluxo:** (1) se já há voucher, mostra o voucher; (2) se não há moto, mostra o estado vazio com links para catálogo e simulador; (3) senão, mostra o formulário com loja, forma de pagamento, dados e consentimento.
**Internas:** `Erro` (mensagem ligada ao campo), `alterar(nome)` (atualiza o campo, aplica a máscara no telefone e limpa o erro daquele campo) e `confirmar(e)` (valida com `validarDadosCheckout`, guarda o lead e cria o voucher).
**Detalhes:** campos vêm preenchidos com o lead anterior; o plano do simulador só entra no voucher se for da **mesma modalidade** escolhida (`planoVinculado`).

### `PosVenda.tsx` (`/pos-venda`) — RF-10

**Imports:** React Hook Form (`useForm`, `useWatch`), `zodResolver`, `DayPicker`, `ptBR`, o CSS do calendário, `useApp`, `HORARIOS`, `SERVICOS`, `agendaSimulada`, `horarioOcupado`, `criarAgendamentoSchema` e afins.
**Etapas na tela:** 01 serviço, 02 dados, 03 data e horário; depois um **resumo** (com `aria-live`) que diz que o horário depende da confirmação da oficina.
**Internas:** `Etapa` e `Campo` (blocos de layout com rótulo e erro).
**O calendário:** o campo `data` é um `<input type="hidden">` registrado no RHF; o `DayPicker` (`mode="single"`, `locale={ptBR}`, `disabled={{ before: hoje }}`) chama `setValue('data', ..., { shouldValidate: true })`, e trocar o dia faz `resetField('horario')`. O seletor de horário fica desabilitado até haver uma data, e os horários ocupados aparecem como "(ocupado)".
**No envio:** chama `reservarHorario({ data, horario })` e mostra o resumo.
**Boas práticas:** `useMemo` recria o schema só quando `hoje` ou as reservas mudam; `subscribe`/`useWatch` em vez de `watch`; cores do calendário passadas por variáveis CSS (`--rdp-accent-color`) via `style`.

### `Boutique.tsx` (`/boutique`)

**Estado local:** filtros, tamanhos escolhidos, erros de tamanho, guia aberto, carrinho, carrinho aberto, forma de pagamento e "pedido finalizado".
**Internas:** `atualizarCarrinho(novo)` (qualquer mudança invalida a confirmação anterior), `adicionar(produto)` (exige tamanho para capacetes) e `trocarCategoria(...)` (ao trocar de categoria, os filtros de capacete voltam ao início).
**Boas práticas:** toda a regra do carrinho vem de `domain/boutique.ts`; a página só orquestra.

---

# Parte 6 — Testes

## 6.1 Visão geral

A suíte tem **268 testes** em 27 arquivos (ao final do Passo 41). Dois tipos:

- **Testes de domínio** (`domain/*.test.ts`, `data/`, `utils/`): chamam funções puras e conferem a saída. São rápidos e não precisam de tela.
- **Testes de componente e página** (`*.test.tsx`): renderizam a tela com Testing Library, agem como uma pessoa e conferem o que aparece.

## 6.2 O que cada arquivo de teste cobre

| Arquivo                              | Testes\* | O que garante                                                                                                                                                                                                                                          |
| ------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `App.test.tsx`                       | 11       | Cada rota mostra sua página (inclusive `/moto/:id`, `/pos-venda`, `/boutique` e "não encontrada"); navegação principal, menu que abre e fecha informando leitores de tela, link "Ir para o conteúdo", contador da Reserva (RF-11) e âncora "Sobre nós" |
| `components/CartaoDestaque.test.tsx` | 5        | Nome, marca, ficha técnica, preço final, selo de estoque (RF-09), link para a ficha e os dois casos de imagem (com foto / só a cilindrada)                                                                                                             |
| `components/ContaGiros.test.tsx`     | 3        | Texto alternativo do SVG, "R$ 0" com as 13 marcações (0 a 12) e a agulha que sobe do zero até o valor final                                                                                                                                            |
| `components/LeadForm.test.tsx`       | 7        | Erros por campo, máscara de telefone, consentimento, envio com os dados certos                                                                                                                                                                         |
| `components/Modal.test.tsx`          | 9        | `Esc` e clique no fundo fecham, foco entra e fica preso, foco volta, rolagem trava                                                                                                                                                                     |
| `components/ProposalModal.test.tsx`  | 3        | Fechado não renderiza; mensagem com dados do lead e da moto; WhatsApp em nova aba segura e e-mail com a mensagem codificada                                                                                                                            |
| `components/StockBadge.test.tsx`     | 3        | Ícone e texto de cada status; status desconhecido não quebra                                                                                                                                                                                           |
| `components/VideoTestRide.test.tsx`  | 3        | Começa fechado sem carregar o player, abre com o iframe e, ao fechar, remove o iframe (o vídeo para)                                                                                                                                                   |
| `context/AppProvider.test.tsx`       | 10       | Começa vazio; seleciona e limpa a moto; soma acessórios sem repetir; guarda simulação, voucher, lead e horários agendados (RF-10); aceita estado inicial; erro claro fora do provider                                                                  |
| `data/acessorios.test.ts`            | 2        | Ids únicos e ao menos um acessório compatível com cada categoria de moto                                                                                                                                                                               |
| `domain/agenda.test.ts`              | 7        | Agenda simulada determinística (2 de 8), reservas só na mesma data, dia lotado                                                                                                                                                                         |
| `domain/agendamento.test.ts`         | 8        | Schema do agendamento, data passada, horário ocupado                                                                                                                                                                                                   |
| `domain/boutique.test.ts`            | 18       | Filtros, carrinho, totais em centavos                                                                                                                                                                                                                  |
| `domain/catalogFilters.test.ts`      | 10       | Filtros cumulativos, filtro vazio, contagem de filtros ativos                                                                                                                                                                                          |
| `domain/financing.test.ts`           | 13       | Tabela Price, consórcio, limites de entrada, acessórios, entrada ajustada, prazo inválido, rótulos                                                                                                                                                     |
| `domain/lead.test.ts`                | 9        | Máscara, telefone, e-mail, cidade, consentimento                                                                                                                                                                                                       |
| `domain/proposal.test.ts`            | 7        | Texto da proposta, links com e sem contato                                                                                                                                                                                                             |
| `domain/reservation.test.ts`         | 14       | Prazos por estoque, código do voucher, validação com Zod, voucher, aviso RN-06, sem "taxa zero"                                                                                                                                                        |
| `pages/Boutique.test.tsx`            | 16       | Filtros, tamanho obrigatório, carrinho, pedido                                                                                                                                                                                                         |
| `pages/Catalogo.test.tsx`            | 8        | Todas as motos sem filtro; categoria vinda da URL; categoria, modo e cilindrada pela tela; combinação com "nenhum resultado" e botão de limpar; URL inválida não quebra; o slider alcança todas as motos                                               |
| `pages/Checkout.test.tsx`            | 13       | Estado vazio, validação, LGPD, voucher, preenchimento a partir do lead                                                                                                                                                                                 |
| `pages/Contato.test.tsx`             | 3        | Guarda o lead no contexto (RF-01); oferece "Receber proposta" e abre o modal (RF-06); sem moto, não mostra o vídeo (RF-05)                                                                                                                             |
| `pages/Home.test.tsx`                | 9        | Um só `h1`, botões do hero, 4 vantagens, vitrine com 4 motos, estilos que levam ao catálogo filtrado, 4 passos em lista ordenada, seção "Sobre nós" e rolagem até `#sobre`, chamada final para o contato                                               |
| `pages/MotoDetalhe.test.tsx`         | 8        | Ficha, composição do preço, atalhos, vídeo ausente, título da aba, id inválido                                                                                                                                                                         |
| `pages/PosVenda.test.tsx`            | 14       | Etapas, erros, LGPD, máscara, dias passados desabilitados, horários ocupados, reserva do mesmo horário                                                                                                                                                 |
| `pages/Simulador.test.tsx`           | 12       | Moto vinda de `?moto=`, prazo e parcela (RN-03), limites de entrada nas duas modalidades (RN-04), consórcio sem prometer "zero de juros", acessórios compatíveis e soma ao valor (RN-07), WhatsApp seguro e "Reservar" indo ao checkout (RF-08)        |
| `utils/formatters.test.ts`           | 5        | Formatação de preço, centavos, cilindrada e link do WhatsApp                                                                                                                                                                                           |

\* Número de blocos `it(...)`; alguns testes são parametrizados, por isso a soma não é exatamente 268.

**Lacunas que vale conhecer (no código que validei):** `domain/pricing.ts` não tinha arquivo de teste ao lado, embora seja usado pela ficha da moto (a ficha testa o resultado, mas a função merece testes próprios: composição, decomposição inversa, parâmetros negativos); `useCatalogFilters` é coberto só indiretamente pelo `Catalogo.test.tsx`; e as páginas ainda não têm teste E2E no navegador real (Playwright).

## 6.3 Como os testes são escritos (padrão da casa)

```tsx
// 1. preparar: renderizar dentro do que a tela precisa (contexto, rotas)
render(
  <AppProvider>
    <MemoryRouter initialEntries={["/moto/yamaha-mt-07"]}>
      <Routes>...</Routes>
    </MemoryRouter>
  </AppProvider>,
);

// 2. agir como a pessoa
const user = userEvent.setup();
await user.click(screen.getByRole("button", { name: /reservar esta moto/i }));

// 3. conferir o que a pessoa vê
expect(
  screen.getByText("destino /checkout / yamaha-mt-07"),
).toBeInTheDocument();
```

Receitas aprendidas no projeto:

| Situação                         | Como foi resolvido                                                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| A tela usa `useApp()`            | Renderizar dentro do `AppProvider` (e, se precisar de estado de partida, usar a prop `inicial`)                                                  |
| A tela usa rotas                 | `MemoryRouter` com `initialEntries`                                                                                                              |
| O teste depende da data de hoje  | `vi.useFakeTimers({ toFake: ['Date'] })` + `vi.setSystemTime(...)`: **só** o `Date` é falso, os timers reais continuam e o `user-event` funciona |
| Comparar preço (`R$ 54.900`)     | O espaço depois de `R$` é não separável: normalizar com `.replace(/\s/g, ' ')`                                                                   |
| O mesmo texto aparece duas vezes | Consultar pelo papel (`getByRole`) ou restringir a uma região com `within(...)`                                                                  |
| Calendário (react-day-picker)    | Os dias são botões com nome em português: `getByRole('button', { name: /26 de outubro de 2026/ })`                                               |

**Boa prática central:** os testes buscam elementos por **papel e nome acessível** (`getByRole`, `getByLabelText`). Se o teste encontra o campo pelo rótulo, o rótulo está ligado corretamente para quem usa leitor de tela.

---

# Parte 7 — Boas práticas aplicadas

## 7.1 Organização e arquitetura

| Prática                    | O que significa                                     | Onde aparece                                                                            |
| -------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Separação de camadas**   | Regra de negócio fora da tela                       | `domain/` sem React; `pages/` só orquestra                                              |
| **Dados fora da lógica**   | Valores que mudam ficam em arquivos de configuração | `data/parametros-precificacao.ts`, `data/contato.ts`, `PARAMETROS_FINANCEIROS`          |
| **Fonte única da verdade** | Uma definição, vários usos                          | `SERVICOS`/`HORARIOS` alimentam schema, tela e tipos; `leadSchema` gera os tipos `Lead` |
| **Um commit por passo**    | Histórico que conta uma história                    | Guias das Partes 1 a 5                                                                  |
| **Crédito à equipe**       | `Co-authored-by` no que foi portado                 | Commits dos passos 29–38                                                                |

## 7.2 TypeScript

| Prática                                         | Exemplo                                                                        |
| ----------------------------------------------- | ------------------------------------------------------------------------------ |
| `as const` + tipo derivado (`typeof X[number]`) | `CATEGORIAS` → `type Categoria`: valor fora da lista não compila               |
| Tipos derivados em vez de duplicados            | `type Simulacao = ReturnType<typeof simularOperacao>`; `z.input`/`z.output`    |
| Genéricos que preservam o tipo                  | `filtrarMotos<T extends MotoFiltravel>` devolve `T[]`                          |
| _Type guards_                                   | `ehCategoria(valor): valor is Categoria`; `.filter((m): m is Moto => ...)`     |
| `import type`                                   | Separa o que é só tipo do que é código                                         |
| Tipo descreve a forma, o valor mora nos dados   | A prop `urlVideo: string`, não a URL literal (erro TS2322 que aconteceu)       |
| `readonly`                                      | Listas de dados não são alteradas por engano                                   |
| Sem `any`                                       | Os tipos de entrada são mínimos e explícitos (`MotoSimulavel`, `ItemComPreco`) |

## 7.3 React

| Prática                                     | Exemplo                                                                     |
| ------------------------------------------- | --------------------------------------------------------------------------- |
| **Dado derivado se calcula, não se guarda** | `Simulador` chama `simularOperacao` no render, sem `useEffect` + `setState` |
| **`useEffect` só para o mundo de fora**     | foco, timer, rolagem, listener de teclado; sempre com _cleanup_             |
| **Atualização imutável**                    | `[...atual, novo]`, `filter`, `map`; nunca `push` no estado                 |
| **`useMemo`/`useCallback` com critério**    | Soma de acessórios e schema do agendamento; filtros do catálogo             |
| **Estado compartilhado mínimo**             | O contexto só guarda o que várias páginas usam                              |
| **Falhar alto e claro**                     | `useApp` lança erro fora do provider                                        |
| **Componente de apresentação pequeno**      | `StockBadge`, `CartaoDestaque`, `Placeholder`                               |
| **`key` estável em listas**                 | Itens do carrinho usam `chave` (produto + tamanho)                          |
| **React 19: `<title>` no componente**       | `MotoDetalhe` define o título da aba                                        |

## 7.4 Formulários e validação

- **Uma única definição das regras** (Zod em `domain/`), usada pela tela e pelos testes.
- **Mensagens junto de cada campo**, no lugar de `alert()`.
- **Máscara de telefone** na digitação e **só dígitos** no dado salvo (`transform(somenteDigitos)`).
- **Consentimento LGPD** obrigatório onde há dado pessoal (contato, checkout, pós-venda).
- **Validar também na regra**, não só na tela: o horário ocupado é recusado pelo schema, mesmo que alguém force o valor.
- **`subscribe`/`useWatch`** em vez de `watch` (compatibilidade com o compilador do React).

## 7.5 Acessibilidade (WCAG)

| Prática                                                                               | Onde                                                   |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Link "Ir para o conteúdo"                                                             | `Navbar` + `<main id="conteudo">`                      |
| Foco visível (`:focus-visible`)                                                       | `index.css`                                            |
| Rótulo ligado ao campo (`label` + `htmlFor`/`id`)                                     | `LeadForm`, `Checkout`, `PosVenda`                     |
| Erro anunciado e ligado ao campo (`aria-invalid`, `aria-describedby`, `role="alert"`) | Formulários                                            |
| Diálogo com `role="dialog"`, `aria-modal`, foco preso e devolvido                     | `Modal`                                                |
| Foco no título do resultado                                                           | `VoucherReserva`                                       |
| Informação nunca só por cor                                                           | `StockBadge` (ícone + texto), "(ocupado)" nos horários |
| Respeito a "reduzir movimento"                                                        | `ContaGiros` (`motion-reduce:transition-none`)         |
| Gráfico SVG com `role="img"` e `aria-label`                                           | `ContaGiros`                                           |
| Contraste: branco só em musgo 600/900                                                 | Paleta                                                 |
| `lang="pt-BR"`                                                                        | `index.html`                                           |
| Listas e tabelas semânticas (`dl`, `ul`, `details`)                                   | `MotoDetalhe`                                          |

## 7.6 Dinheiro e datas

- **Dinheiro em centavos inteiros** nos cálculos de carrinho (`Math.round(preco * 100)`), arredondando em um só lugar.
- **Formatação em um só módulo** (`utils/formatters.ts`).
- **Data como texto `AAAA-MM-DD` no fuso local** (`dataIsoLocal`), nunca `toISOString()` para "hoje".
- **"Hoje" injetado** nas funções de validação: testes não dependem do relógio.

## 7.7 Segurança e privacidade

- `rel="noopener noreferrer"` em links que abrem outra aba.
- `encodeURIComponent` nos links de WhatsApp e e-mail.
- Nada de segredos no código; contatos e parâmetros ficam em arquivos de dados.
- Reserva e voucher **claramente identificados como simulação** (RN-06), na tela e na mensagem do WhatsApp.
- Aviso honesto em vez de promessa: o consórcio **não** é "taxa zero"; tem taxa administrativa e fundo de reserva.

## 7.8 Qualidade e processo

| Prática                              | Detalhe                                                                     |
| ------------------------------------ | --------------------------------------------------------------------------- |
| Lint com regras de React             | `oxlint` com o plugin; nada de `setState` em efeito, dependências completas |
| Tipos estritos                       | `strict`, `noUnusedLocals`, `erasableSyntaxOnly`...                         |
| Testes antes do commit               | Husky no pre-commit; CI no GitHub                                           |
| Correções em commit separado         | Passo 41, sem assinatura da pessoa que escreveu o original                  |
| Tabela "o que mudou em relação à v1" | Cada passo lista as diferenças para o grupo aceitar ou reverter             |
| Validação passo a passo              | Cada passo refeito em projeto limpo, rodando tipos, lint e testes           |

---

# Parte 8 — Pendências e decisões em aberto

O código roda e está testado, mas estes pontos dependem de decisão. Até lá, o site usa valores provisórios.

## 8.1 Cliente

| Tema                                     | Situação atual                                                                                                                   | Onde mudar                                           |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| WhatsApp e e-mail comerciais             | Vazios: o WhatsApp abre sem contato e o e-mail sem destinatário                                                                  | `src/data/contato.ts`                                |
| Lojas de retirada reais                  | 5 lojas fictícias                                                                                                                | `src/domain/reservation.ts` (`LOJAS_RETIRADA`)       |
| Preços e alíquotas reais                 | Provisórios (risco R2). O total é o preço do catálogo; só a divisão depende deles                                                | `src/data/parametros-precificacao.ts`                |
| Taxas reais de financiamento e consórcio | 1,49% a.m.; 12% + 2%                                                                                                             | `src/domain/financing.ts` (`PARAMETROS_FINANCEIROS`) |
| Fotos das motos e vídeos de test-ride    | `imagem` e `videoUrl` vazios                                                                                                     | `src/data/motos.ts`                                  |
| Serviços e dias da oficina               | Segue a v1 (revisão, óleo, freios, diagnóstico); a ERS cita revisão, fluidos, pista e vistoria; o calendário aceita qualquer dia | `src/data/posVenda.ts`                               |

## 8.2 Grupo

| Tema                                                     | Observação                                                  |
| -------------------------------------------------------- | ----------------------------------------------------------- |
| Página da política de privacidade                        | Os checkboxes de LGPD precisam apontar para ela             |
| E-mails de git do Santos e da Mylena                     | Usados no `Co-authored-by`                                  |
| Carrinho da Boutique × acessórios da reserva             | Hoje são separados; decidir se unifica                      |
| Visualizador 360°                                        | Só quando houver as imagens                                 |
| Agenda real da oficina                                   | Hoje simulada (`src/domain/agenda.ts`)                      |
| Aviso visual de "entrada ajustada" no Simulador          | O domínio já informa; falta mostrar                         |
| Comparativo consórcio × financiamento                    | Apresentar sem sugerir que o consórcio é sempre mais barato |
| Imagens externas (Unsplash) da boutique e dos acessórios | Trocar por fotos próprias antes de publicar                 |
| Testes de `pricing.ts` e E2E                             | Ver lacunas na Parte 6                                      |

---

# Glossário

| Termo                | Significado                                                                         |
| -------------------- | ----------------------------------------------------------------------------------- |
| **RF / RN / RNF**    | Requisito Funcional / Regra de Negócio / Requisito Não Funcional (da especificação) |
| **ERS**              | Especificação de Requisitos de Software                                             |
| **SPA**              | _Single page application_: um HTML só; o React troca as telas sem recarregar        |
| **HMR**              | _Hot module replacement_: o navegador atualiza ao salvar o arquivo                  |
| **Hook**             | Função do React que começa com `use` (`useState`, `useEffect`, `useApp`)            |
| **Props**            | Dados passados de um componente para outro                                          |
| **Contexto**         | Estado compartilhado entre componentes sem passar por props                         |
| **Schema**           | Descrição formal de um dado válido (Zod)                                            |
| **Função pura**      | Mesma entrada, mesma saída, sem efeito colateral                                    |
| **Type guard**       | Função que prova ao TypeScript que um valor é de certo tipo                         |
| **Generics**         | Tipos "parametrizados" (`T`) que preservam o tipo recebido                          |
| **Tabela Price**     | Sistema de amortização com parcelas fixas                                           |
| **Consórcio**        | Plano de compra em grupo, sem juros, com taxa administrativa e fundo de reserva     |
| **Voucher**          | Comprovante da reserva (aqui, fictícia)                                             |
| **LGPD**             | Lei Geral de Proteção de Dados                                                      |
| **WCAG**             | Diretrizes de acessibilidade web                                                    |
| **CI**               | Integração contínua: testes automáticos a cada push                                 |
| **E2E**              | Teste ponta a ponta, no navegador real                                              |
| **Commit atômico**   | Um commit por mudança lógica                                                        |
| **`Co-authored-by`** | Linha no commit que credita outra pessoa                                            |
