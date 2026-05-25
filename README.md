# SPL - Sistema de Promoção da Saúde

Projeto desenvolvido em React com Vite para as atividades do SPL.

## Funcionalidades

- Tela de Login com validação de e-mail e senha oculta.
- Tela de Cadastro com validação e feedback de erro/sucesso.
- Tela de Triagem em duas etapas.
- Dashboard com resumo dos dados informados.
- Rotas protegidas com React Router.
- Simulação de backend usando `localStorage`.

## Login de teste

- E-mail: `test@mail.com`
- Senha: `senha`

## Como rodar

```bash
npm install
npm run dev
```

Depois acesse o endereço mostrado no terminal, normalmente:

```bash
http://localhost:5173
```

## Build de produção

```bash
npm run build
```

## Estrutura

```text
src/
  contexts/AuthContext.jsx
  pages/Login.jsx
  pages/Cadastro.jsx
  pages/Triagem.jsx
  pages/Dashboard.jsx
  services/fakeApi.js
  styles.css
```
# splcomp
