# MiniErp.Web

SPA em React + TypeScript para o Mini ERP, consumindo a API ASP.NET Core (`MiniErp.Api`). Sem autenticação nesta versão.

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
│   ├── layout/     # AppLayout, Sidebar, Header
│   ├── ui/         # Button, Input, Modal, ConfirmDialog, Pagination, Badge, ...
│   ├── feedback/   # LoadingSpinner, Skeleton, ErrorState, EmptyState
│   └── forms/      # formulários e seletores específicos de domínio
├── pages/          # Dashboard, Produtos, Clientes, Vendas, NotFound
├── hooks/          # useDebouncedValue, useCarrinho
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
