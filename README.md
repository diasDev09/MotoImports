# MotoImports

Site de uma loja de motos importadas: catálogo, ficha da moto com preço "tudo incluso", simulador de financiamento e consórcio, reserva com voucher (fictícia), pós-venda e boutique. Projeto acadêmico em grupo — **a v2 é uma reconstrução da [v1](https://github.com/diasDev09/MotoImports)**, feita passo a passo, com testes e lint desde o início.

> **Aviso:** é um projeto de demonstração. Reservas, vouchers, carrinho da boutique e agendamentos **não** geram cobrança nem compromisso real, e os dados de lojas, preços e taxas são fictícios ou provisórios (veja [Pendências](#pendências-e-decisões-em-aberto)).

## Funcionalidades

| Página        | Rota         | O que faz                                                                                                     | Requisitos                         |
| ------------- | ------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Início        | `/`          | Vitrine, conta-giros e destaques                                                                              | —                                  |
| Catálogo      | `/catalogo`  | Filtros por categoria, modo de pilotagem e cilindrada                                                         | RF-01                              |
| Ficha da moto | `/moto/:id`  | Ficha técnica, preço final e sua composição, selo de estoque, atalhos para simular, reservar e pedir proposta | RF-02, RF-05, RF-09                |
| Contato       | `/contato`   | Formulário de lead, proposta e vídeo de test-ride                                                             | RF-05, RF-06                       |
| Simulador     | `/simulador` | Financiamento (Tabela Price) e consórcio, entrada, prazo de 12 a 72 meses e acessórios                        | RF-07, RN-03, RN-04, RN-07         |
| Checkout      | `/checkout`  | Loja de retirada, forma de pagamento e voucher de reserva de demonstração                                     | RF-08, RN-02, RN-05, RN-06, RNF-05 |
| Pós-venda     | `/pos-venda` | Agendamento na oficina com calendário e horários ocupados bloqueados                                          | RF-10                              |
| Boutique      | `/boutique`  | Produtos, filtros e carrinho de demonstração                                                                  | —                                  |

## Stack

- **Vite + React 19 + TypeScript** (modo estrito)
- **Tailwind CSS v4**, com a paleta "musgo" definida em `@theme`
- **React Router** · **React Hook Form + Zod 4** nos formulários · **react-day-picker** no calendário
- **Vitest + jsdom + Testing Library** (unidade e componentes) · **Playwright** (E2E)
- **oxlint** (com as regras de React) · **Husky** (pre-commit) · **GitHub Actions**

## Como rodar

Pré-requisito: Node.js em versão atual (LTS) e npm.

```bash
git clone https://github.com/diasDev09/MotoImports.git
cd MotoImports
npm install
npm run dev        # servidor de desenvolvimento
```

Scripts do dia a dia:

```bash
npm test           # testes (Vitest)
npm run lint       # oxlint
npx tsc -b         # checagem de tipos
npm run build      # build de produção
```

Antes de abrir um PR, rode `npm run lint`, `npm test` e `npx tsc -b`; os três precisam passar sem erros nem avisos.

## Estrutura

```
src/
  domain/       regras de negócio em TypeScript puro (sem React), com teste ao lado
  data/         dados e configuração (motos, acessórios, boutique, contato, parâmetros)
  context/      estado compartilhado (AppContext / AppProvider)
  components/   componentes reutilizáveis
  pages/        uma página por rota
  features/     lógica de tela reutilizável (ex.: filtros do catálogo)
  utils/        formatadores (preço, cilindrada, WhatsApp)
  test/         configuração dos testes
```

Princípios: regra de negócio fica em `domain/` e é testada sem interface; valores que podem mudar (alíquotas, taxas, contatos) ficam em `data/`, nunca dentro das funções; formatação de valores sempre via `utils/formatters.ts`.

## Regras de negócio em resumo

- **Preço (RN-01):** o campo `preco` das motos é o **valor final**, com frete, despacho, imposto de importação e impostos fiscais. A composição é calculada por `decomporPrecoFinal` e a soma sempre fecha no preço do catálogo.
- **Financiamento:** Tabela Price, 1,49% a.m. Entrada de 20% a 80%.
- **Consórcio:** 12% de taxa administrativa + 2% de fundo de reserva, sem juros bancários. Entrada (lance) de 10% a 70%. A contemplação depende de sorteio ou lance.
- **Prazos:** 12, 24, 36, 48, 60 ou 72 meses; qualquer outro valor é recusado.
- **Reserva (RN-05/06):** validade de 7 dias e sempre com aviso de que é uma simulação, sem cobrança.
- **Estoque (RN-02, RF-09):** pronta entrega, em trânsito aduaneiro ou sob pedido; o selo usa ícone e texto, nunca só cor.
- **LGPD (RNF-05):** checkout e pós-venda pedem consentimento explícito antes de enviar.
- **Agendamento (RF-10):** só datas de hoje em diante; horários já ocupados são bloqueados.

## Como contribuir

1. Crie um branch a partir da `main` e faça **um commit por passo**, em mensagens no padrão Conventional Commits (`feat(...)`, `fix(...)`).
2. Código portado da v1 mantém o comportamento original e leva `Co-authored-by` da pessoa que o escreveu. Correções e melhorias nossas entram em commit separado.
3. Toda mudança de regra vem com teste. Regras em `domain/`, comportamento de tela em `pages/` e `components/`.
4. Se mudar o nome de um campo compartilhado (por exemplo em `data/motos.ts` ou no `AppContext`), avise o grupo.

## Equipe

| Pessoa              | Trabalho principal                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------- |
| Emilly Marrocos     | Layout, Home, conta-giros, cartão de destaque, tema, contexto, formatadores e dados das motos |
| Ariely Lopes        | Pós-venda e Boutique                                                                          |
| Santos (`rhawan81`) | Simulador, financiamento e reserva                                                            |
| Mylena Monteiro     | Formulário de lead, vídeo de test-ride e proposta                                             |
| Caio Dias           | Reconstrução da v2 e integração                                                               |

## Pendências e decisões em aberto

O código roda e está testado, mas estes pontos dependem de decisão do cliente ou do grupo. Até lá, o site usa valores provisórios.

### Cliente

| Tema                                                                                | Situação atual                                                                                                                                     | Onde mudar                                           |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| WhatsApp e e-mail comerciais (destino das propostas)                                | Vazios: o WhatsApp abre sem contato e o e-mail sem destinatário                                                                                    | `src/data/contato.ts`                                |
| Lojas de retirada reais                                                             | 5 lojas fictícias                                                                                                                                  | `src/domain/reservation.ts` (`LOJAS_RETIRADA`)       |
| Preços e alíquotas reais (frete, despacho, imposto de importação, impostos fiscais) | Valores **provisórios** (risco R2 do roadmap); só a divisão do preço depende deles, o total é o preço do catálogo                                  | `src/data/parametros-precificacao.ts`                |
| Taxas reais de financiamento e consórcio                                            | 1,49% a.m.; 12% + 2%                                                                                                                               | `src/domain/financing.ts` (`PARAMETROS_FINANCEIROS`) |
| Fotos das motos e vídeos de test-ride                                               | Campos `imagem` e `videoUrl` vazios; a ficha mostra a cilindrada no lugar da foto e esconde o botão de vídeo                                       | `src/data/motos.ts`                                  |
| Serviços e dias de funcionamento da oficina                                         | Segue a v1 (revisão, óleo, freios, diagnóstico); a ERS cita revisão, fluidos, pista e vistoria. O calendário aceita qualquer dia, domingo incluído | `src/data/posVenda.ts`                               |

### Grupo

| Tema                                              | Observação                                                                                     |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Página da política de privacidade                 | Os checkboxes de LGPD precisam apontar para ela                                                |
| Confirmar os e-mails de git do Santos e da Mylena | Usados no `Co-authored-by` dos commits                                                         |
| Carrinho da Boutique × acessórios da reserva      | Hoje são separados; decidir se unifica                                                         |
| Visualizador 360°                                 | Só quando houver as imagens (`imagens360`)                                                     |
| Agenda real da oficina                            | A ocupação dos horários hoje é simulada (`src/domain/agenda.ts`); trocar quando houver sistema |
| Aviso visual de "entrada ajustada" no Simulador   | O domínio já informa (`entradaAjustada`); falta mostrar na tela                                |
| Comparativo de consórcio × financiamento          | Decidir como apresentar sem sugerir que o consórcio é sempre mais barato                       |

## Licença

A definir pelo grupo.
