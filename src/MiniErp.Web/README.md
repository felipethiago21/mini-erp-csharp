# MiniErp.Web

SPA em React + TypeScript para o Mini ERP, consumindo a API ASP.NET Core (`MiniErp.Api`). Sem autenticação nesta versão.

## UX

- Toasts de sucesso/erro (`ToastProvider` + `useToast`) para todas as mutations.
- Botões com estado de loading (`Button` com prop `isLoading`) e desabilitados durante o envio.
- Modais com foco automático no primeiro campo, fechamento por ESC/clique fora, e bloqueio de fechamento acidental enquanto uma mutation está pendente (`preventClose`).
- Badges de estoque em 3 níveis: vermelho (zerado), amarelo (1–5), verde (acima de 5).
- Tema claro/escuro (`ThemeProvider` + `useTheme`), com botão no cabeçalho e persistência em `localStorage`.
- Sidebar recolhível em mobile/tablet via menu hambúrguer.

## Stack

- React 19 + TypeScript
- Vite (dev server e build)
- React Router (rotas client-side)
- TanStack Query (cache e sincronização com a API)
- Axios (cliente HTTP centralizado)
- Tailwind CSS v4
- React Hook Form + Zod (formulários e validação)
- Recharts (gráfico do dashboard)
- Lucide React (ícones)
- Vitest + React Testing Library (testes)

## Configuração

```bash
cp .env.example .env
```

Variável disponível:

| Variável        | Descrição                              | Padrão                       |
| --------------- | ---------------------------------------- | ----------------------------- |
| `VITE_API_URL`  | URL base da API (com `/api` no final)     | `http://localhost:5192/api`   |

## Executando

Com a API já rodando (`dotnet run --project ../MiniErp.Api` a partir de `src/`):

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Executando com Docker

Veja a seção "Executando com Docker" no [README raiz do projeto](../../readme.MD#-executando-com-docker). Resumo:

```bash
# a partir de minierp/
docker compose up --build
```

Frontend em `http://localhost:5173`, API em `http://localhost:5192`. O `VITE_API_URL` usado no build da imagem é passado como build arg pelo `docker-compose.yml` — como o Vite resolve variáveis de ambiente em tempo de build, não é possível trocar a URL da API em runtime sem reconstruir a imagem.

## Scripts

| Comando           | Descrição                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`      | Ambiente de desenvolvimento (Vite)        |
| `npm run build`    | Typecheck (`tsc -b`) + build de produção  |
| `npm run lint`     | Lint com oxlint                           |
| `npm run test`     | Testes com Vitest                         |
| `npm run preview`  | Preview local do build de produção        |

## Estrutura

```
src/
├── api/            # cliente Axios + módulos por recurso (produtos, clientes, vendas, dashboard)
├── components/
│   ├── layout/     # AppLayout, Sidebar, Header, ThemeProvider
│   ├── ui/         # Button, Input, Modal, ConfirmDialog, Pagination, Badge, ...
│   ├── feedback/   # LoadingSpinner, Skeleton, ErrorState, EmptyState, ToastProvider
│   └── forms/      # formulários e seletores específicos de domínio
├── pages/          # Dashboard, Produtos, Clientes, Vendas, NotFound
├── hooks/          # useDebouncedValue, useCarrinho, useToast, useTheme
├── schemas/        # validação Zod dos formulários
├── types/          # contratos TypeScript espelhando os DTOs reais da API
├── utils/          # formatação pt-BR (moeda/data) e extração de mensagens de erro
├── routes/         # itens de navegação
├── App.tsx
└── main.tsx
```

## Integração com a API

Todos os contratos (`types/`) foram extraídos diretamente dos DTOs em `MiniErp.Application/DTOs` — nenhuma propriedade foi inventada. Pontos relevantes:

- Respostas da API usam `camelCase` (serializador padrão do ASP.NET Core), exceto o corpo de erro do middleware global, que é serializado manualmente e retorna `PascalCase` (`Status`, `Erro`, `Detalhes`). O interceptor em `api/client.ts` já trata esse formato específico.
- Paginação: a query string usa `page`/`pageSize`/`busca`, mas a resposta traz `itens`/`pagina`/`tamanhoPagina`/`totalItens`/`totalPaginas`.
- `GET /api/vendas` não é paginado — retorna a lista completa.

## Testes

```bash
npm run test
```

Cobrem: renderização do dashboard (sucesso e erro), validação do formulário de produto e o hook de carrinho de vendas (adicionar/remover itens, respeitar limite de estoque).
