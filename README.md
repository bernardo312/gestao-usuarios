# Gestão de Usuários

CRUD de usuários com frontend em JavaScript puro e API REST em Node.js.

## Tecnologias

- **Frontend:** HTML, CSS e JavaScript puro (Vanilla JS)
- **Backend:** Node.js com Express
- **Banco de dados:** SQLite
- **Outros:** bcryptjs (hash de senha), cors e Firebase Authentication (login das telas)

## Como rodar

**Pré-requisito:** [Node.js](https://nodejs.org) 18 ou mais recente.

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

A API sobe em `http://localhost:3000`. O banco `database.db` é criado automaticamente.

### 2. Frontend

Com o backend rodando, abra a pasta do projeto no VS Code e clique em **Go Live** (extensão Live Server).
A tela de login abre em `http://127.0.0.1:5500/login.html`.

Sem o VS Code, em outro terminal, na raiz do projeto:

```bash
npx http-server frontend -p 5500
```

> O frontend precisa ser aberto por um servidor (Live Server ou http-server). Abrir o HTML com dois cliques não funciona.

### 3. Login

- **Email:** teste_bling@gmail.com
- **Senha:** teste123456

## Exemplos da API

| Método | Rota | Resposta |
| --- | --- | --- |
| GET | `/users` | 200 com a lista |
| GET | `/users/:id` | 200 ou 404 |
| POST | `/users` | 201 com o usuário criado |
| PUT | `/users/:id` | 200 ou 404 |
| DELETE | `/users/:id` | 204 ou 404 |

**Requisição** `POST /users` (corpo em JSON):

```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "login": "maria",
  "password": "12345678"
}
```

**Resposta** `201 Created` (a senha nunca é devolvida):

```json
{
  "id": 1,
  "name": "Maria Silva",
  "email": "maria@email.com",
  "login": "maria",
  "active": true
}
```

**Erro** `400 Bad Request` (dados inválidos ou email/login repetido):

```json
{
  "error": "Já existe um usuário com este email."
}
```
## Créditos

- **Imagem da tela de login:** gerada com IA (Google Gemini).
- **Identidade visual:** cores e tipografia inspiradas no manual de marca da Bling, usado como referência de estudo. Este projeto não tem vínculo oficial com a marca.