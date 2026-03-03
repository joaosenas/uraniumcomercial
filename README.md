# 🚀 Uranium Company - Hub de Apresentações Comerciais

Sistema completo de gerenciamento de apresentações comerciais.

## 📋 Sumário

- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Deploy no EasyPanel](#-deploy-no-easypanel)
- [Desenvolvimento Local](#-desenvolvimento-local)

---

## ✨ Funcionalidades

- 🔐 **Autenticação** - Login e cadastro de usuários
- 📊 **Dashboard** - Grid de cards com filtros por cliente e status
- ✏️ **Editor** - Editor HTML/CSS/JS com preview ao vivo
- 🔗 **Compartilhamento** - Links públicos para visualização

---

## 🛠️ Stack Tecnológica

- **Next.js 16** com App Router
- **React 19** com TypeScript
- **PostgreSQL** com Prisma ORM
- **NextAuth.js 4** para autenticação
- **Tailwind CSS 4** + shadcn/ui
- **Node.js 20 LTS**

---

## 🚀 Deploy no EasyPanel

### Passo 1: Preparar o Repositório

```bash
# 1. Clone ou baixe o projeto
git clone <seu-repositorio>
cd uranium-hub

# 2. Instale as dependências
npm install

# 3. Gere o Prisma Client
npx prisma generate

# 4. Teste o build local
npm run build
```

### Passo 2: Enviar para o GitHub

```bash
# Inicializar git (se necessário)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit - Uranium Hub"

# Adicionar repositório remoto
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Enviar para o GitHub
git push -u origin main
```

### Passo 3: Configurar Variáveis no EasyPanel

No painel do EasyPanel, configure as seguintes variáveis de ambiente:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | Conexão PostgreSQL | `postgresql://postgres:SENHA@postgres:5432/uranium_hub` |
| `NEXTAUTH_SECRET` | Chave secreta JWT | (gerar com `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | URL do site | `https://comercial.uraniumcompany.com.br` |
| `NODE_ENV` | Ambiente | `production` |

#### Gerar NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

#### DATABASE_URL no EasyPanel:
- O EasyPanel cria automaticamente uma variável de conexão
- Geralmente é: `postgresql://postgres:SENHA@NOME_DO_SERVICO_POSTGRES:5432/NOME_DO_BANCO`

### Passo 4: Configurar o Deploy

1. **No EasyPanel**, vá em seu aplicativo
2. **Source**: Selecione "GitHub" e escolha o repositório
3. **Build Pack**: Selecione "Nixpacks" (ou Docker como alternativa)
4. **Domain**: Configure `comercial.uraniumcompany.com.br`
5. **Port**: `3000` (já configurado automaticamente)

### Passo 5: Fazer o Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (pode demorar 3-5 minutos)
3. Verifique os logs para confirmar sucesso

### Passo 6: Criar as Tabelas do Banco

Após o primeiro deploy bem-sucedido, execute no terminal do EasyPanel:

```bash
# Sincronizar banco de dados
npx prisma db push

# Criar usuário admin
npx tsx prisma/seed.ts
```

**OU** use o console do EasyPanel para executar comandos.

---

## 💻 Desenvolvimento Local

### Pré-requisitos
- Node.js 20 LTS
- PostgreSQL

### Instalação

```bash
# Instalar dependências
npm install

# Configurar .env (copiar do .env.example)
cp .env.example .env

# Gerar Prisma Client
npx prisma generate

# Criar tabelas
npx prisma db push

# Criar usuário admin
npx tsx prisma/seed.ts

# Iniciar desenvolvimento
npm run dev
```

### Acesso
- URL: http://localhost:3000
- Email: admin@uranium.com
- Senha: admin123

---

## 📁 Estrutura do Projeto

```
├── prisma/
│   ├── schema.prisma      # Schema do banco
│   └── seed.ts            # Usuário admin
├── src/
│   ├── app/
│   │   ├── api/           # Rotas da API
│   │   ├── login/         # Página de login
│   │   ├── register/      # Página de cadastro
│   │   ├── presentation/  # Editor de apresentações
│   │   └── p/view/        # Visualização pública
│   ├── components/        # Componentes React
│   ├── lib/               # Utilitários
│   └── middleware.ts      # Proteção de rotas
├── nixpacks.toml          # Config de deploy
├── Dockerfile             # Backup Docker
└── package.json
```

---

## 🔑 Credenciais Padrão

- **Email**: `admin@uranium.com`
- **Senha**: `admin123`

⚠️ **IMPORTANTE**: Altere a senha após o primeiro login!

---

## 🆘 Solução de Problemas

### Build falha no EasyPanel
- Verifique se o Node.js 20 está configurado
- Confira os logs de erro
- Tente usar o Dockerfile como alternativa

### Erro de conexão com banco
- Verifique se o DATABASE_URL está correto
- Confirme se o serviço PostgreSQL está rodando
- Verifique se o banco foi criado

### Tela branca / erro 500
- Verifique as variáveis de ambiente
- Confira os logs do container
- Execute `npx prisma db push` novamente

---

Desenvolvido para **Uranium Company** 🚀
