# Armazenamento no Firestore

Reservas, pedidos da boutique, agendamentos e contatos são gravados no Firestore. Sem as variáveis `VITE_FIREBASE_*`, nada é gravado e o site continua funcionando como demonstração.

## Como configurar (uma vez)

1. No [console do Firebase](https://console.firebase.google.com), abra o mesmo projeto do login.
2. **Build > Firestore Database > Criar banco de dados**. Escolha o modo **produção** (as regras abaixo liberam só o necessário) e a região mais próxima (ex.: `southamerica-east1`).
3. **Firestore > Regras**: cole o conteúdo de `firestore.rules` e **Publicar**. (Ou, com a CLI: `npx firebase-tools deploy --only firestore:rules`.)
4. Faça uma reserva de teste logado e confira o documento em **Firestore > Dados**.

> As regras **não foram testadas em emulador**. Antes de publicar, use o **Simulador de regras** do console ou o Emulator Suite.

## O que é gravado

| Ação | Caminho | Observação |
|---|---|---|
| Confirmar reserva | `users/{uid}/reservas/{codigo}` | O id é o código do voucher. Se a gravação falhar, o voucher **não** é emitido. |
| Pedido da boutique | `users/{uid}/pedidosBoutique/{id}` | Itens, total e forma de pagamento. Se falhar, o pedido não é confirmado. |
| Agendar na oficina | `users/{uid}/agendamentos/{id}` | Se falhar, o horário não é ocupado. |
| Enviar contato | `leads/{id}` | Não exige login. Se falhar, a pessoa não é barrada (erro vai ao console). |

Todo documento leva `uid` (quando há dono) e `criadoEm` (hora do servidor).

## O que as regras garantem

- Cada pessoa cria e lê **somente** o que está sob o próprio `uid`.
- Ninguém edita nem apaga documentos pelo site.
- `leads` aceita criação por qualquer pessoa e **não pode ser lido** pelo site (a equipe lê no console).
- Todo o resto é negado.

## Limites conhecidos

- **Preços vêm do navegador.** As regras não conseguem conferir se o total do pedido está certo. Para valer de verdade, a validação precisa de um servidor (Cloud Function). Hoje o pedido é de demonstração.
- **Contato aberto = risco de spam.** Considere ativar o **App Check** ou exigir login no formulário.
- Privacidade: os dados guardam nome, telefone e e-mail. Defina uma política e um prazo de retenção antes de ir para produção (LGPD).

## Código

| Arquivo | Papel |
|---|---|
| `src/storage/Repositorio.ts` | Contrato (`salvarReserva`, `salvarPedidoBoutique`, `salvarAgendamento`, `salvarLead`) e o hook `useRepositorio()`. |
| `src/storage/documentos.ts` | Monta os documentos (ex.: `montarPedidoBoutique`) e remove `undefined`. |
| `src/storage/RepositorioProvider.tsx` | Fornece o repositório; aceita um falso nos testes. |
| `src/lib/firestore.ts` | Implementação real em Firestore (módulos carregados sob demanda). |
| `src/test/servicoAuth.ts` | `criarRepositorioFalso()` para os testes. |
