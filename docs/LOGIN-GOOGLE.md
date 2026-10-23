# Login com Google (Firebase Authentication)

Só quem entrou com a conta Google pode **reservar uma moto** (`/checkout`), **confirmar um pedido da boutique** e **agendar serviço na oficina**. Navegar, simular e pedir proposta continuam abertos a todos.

## Como configurar (uma vez)

1. Acesse o [console do Firebase](https://console.firebase.google.com) e crie um projeto (o Google Analytics pode ficar desligado).
2. **Build > Authentication > Começar > Método de login > Google > Ativar**. Escolha o e-mail de suporte do projeto e salve.
3. **Authentication > Configurações > Domínios autorizados**: `localhost` já vem; acrescente o domínio de produção quando existir.
4. **Configurações do projeto > Seus apps > `</>` Web**: registre o app e copie o `firebaseConfig`.
5. Na raiz do projeto, copie `.env.example` para `.env.local` e preencha as 4 variáveis `VITE_FIREBASE_*`.
6. `npm install` e `npm run dev`. O botão **Entrar** do menu abre a janela do Google.

Sem as variáveis, o site funciona, mas os botões de login ficam desativados com um aviso (útil para quem só mexe em layout).

## Como funciona no código

| Arquivo | Papel |
|---|---|
| `src/lib/firebase.ts` | Lê a configuração e cria o serviço de login (módulos do Firebase carregados só quando preciso). |
| `src/auth/AuthContext.ts` | Tipos (`Usuario`, `ServicoAuth`) e o hook `useAuth()`. |
| `src/auth/AuthProvider.tsx` | Guarda quem está logado e expõe `entrar()` e `sair()`. Aceita um serviço falso nos testes. |
| `src/auth/ExigeLogin.tsx` | Esconde o conteúdo de quem não entrou e mostra o convite "Entrar com Google". |
| `src/test/servicoAuth.ts`, `src/test/ComLogin.tsx` | Login falso para os testes, sem rede. |

## Limite importante

Bloquear a tela é conforto, **não segurança**: quem entende de navegador pode contornar. O que protege os dados de verdade são as **regras do Firestore**, que chegam no próximo commit (armazenamento).
