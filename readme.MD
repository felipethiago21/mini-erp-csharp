# 📦 Mini ERP em C#

Projeto de estudos evoluído de um console app para uma **API REST em ASP.NET Core**, organizada em camadas, com Entity Framework Core, SQLite, testes automatizados e pronta para ser consumida por um frontend em React.

---

## 🎯 Objetivos

- Praticar C#, POO e arquitetura em camadas.
- Construir uma API REST profissional com ASP.NET Core.
- Aplicar Repository Pattern, injeção de dependência, DTOs e validação.
- Preparar o backend para consumo por um frontend React (próxima sprint).

---

## 🏗️ Arquitetura

Camadas inspiradas em Clean Architecture / Onion Architecture:

- **MiniErp.Domain** — entidades e regras de negócio intrínsecas (`Produto`, `Cliente`, `Venda`, `ItemVenda`).
- **MiniErp.Application** — casos de uso: DTOs, interfaces (repositórios, unit of work, services), services, validators (FluentValidation) e exceptions de negócio.
- **MiniErp.Infrastructure** — Entity Framework Core (`MiniErpContext`), implementação dos repositórios, `UnitOfWork` e migrations.
- **MiniErp.Api** — ASP.NET Core Web API: controllers, middleware de exceções, Swagger, CORS e configuração de DI.
- **MiniErp.Console** — aplicativo console original, agora consumindo as mesmas camadas de Application/Infrastructure via injeção de dependência (mantido como demonstração histórica).
- **MiniErp.Tests** — testes xUnit dos services de Produto e Venda.

Regra importante: os **controllers não contêm regra de negócio** — apenas orquestram DTOs e chamam os services da camada Application. As regras vivem nas entidades (`Domain`) e nos services (`Application`).

```mermaid
graph TD
    Console[MiniErp.Console] --> Application
    Api[MiniErp.Api] --> Application[MiniErp.Application]
    Application --> Domain[MiniErp.Domain]
    Infrastructure[MiniErp.Infrastructure] --> Application
    Infrastructure --> Domain
    Api --> Infrastructure
    Console --> Infrastructure
    Tests[MiniErp.Tests] --> Application
    Tests --> Infrastructure
```

---

## 🚀 Tecnologias

- C# / .NET 10
- ASP.NET Core Web API
- Entity Framework Core 10 + SQLite
- FluentValidation
- Swagger / Swashbuckle
- xUnit

---

## 📂 Estrutura de pastas

```
minierp/
├── MiniErp.sln
├── src/
│   ├── MiniErp.Domain/
│   │   └── Entities/            (Produto, Cliente, Venda, ItemVenda)
│   ├── MiniErp.Application/
│   │   ├── DTOs/                (Produtos, Clientes, Vendas, Dashboard, Common)
│   │   ├── Interfaces/          (Repositories, UnitOfWork, Services)
│   │   ├── Services/
│   │   ├── Validators/
│   │   └── Exceptions/
│   ├── MiniErp.Infrastructure/
│   │   ├── Persistence/         (MiniErpContext, UnitOfWork)
│   │   ├── Repositories/
│   │   └── Migrations/
│   ├── MiniErp.Api/
│   │   ├── Controllers/
│   │   ├── Middlewares/
│   │   └── Program.cs
│   └── MiniErp.Console/
└── tests/
    └── MiniErp.Tests/
```

---

## ▶️ Como executar

### Restaurar e compilar

```bash
dotnet restore
dotnet build
```

### Rodar os testes

```bash
dotnet test
```

### Criar/atualizar o banco SQLite

```bash
dotnet ef database update --project src/MiniErp.Infrastructure --startup-project src/MiniErp.Api
```

### Executar a API

```bash
dotnet run --project src/MiniErp.Api
```

Abra o Swagger em `http://localhost:<porta>/swagger`.

### Executar o console (opcional)

```bash
dotnet run --project src/MiniErp.Console
```

---

## 🔌 Endpoints principais

### Produtos
- `GET /api/produtos?page=1&pageSize=10&busca=arroz`
- `GET /api/produtos/{id}`
- `POST /api/produtos`
- `PUT /api/produtos/{id}`
- `DELETE /api/produtos/{id}`
- `POST /api/produtos/{id}/entrada-estoque`
- `POST /api/produtos/{id}/saida-estoque`

### Clientes
- `GET /api/clientes?page=1&pageSize=10&busca=felipe`
- `GET /api/clientes/{id}`
- `POST /api/clientes`
- `PUT /api/clientes/{id}`
- `DELETE /api/clientes/{id}`

### Vendas
- `GET /api/vendas`
- `GET /api/vendas/{id}`
- `POST /api/vendas` — aceita múltiplos itens, valida estoque e cliente, e executa tudo em uma transação (rollback total se algo falhar).

### Dashboard
- `GET /api/dashboard/resumo` — totais de produtos/clientes/vendas, faturamento, produtos com estoque baixo (≤ 5) e vendas recentes.

---

## ✅ Tratamento de erros

Middleware global (`ExceptionHandlingMiddleware`) padroniza as respostas de erro:

```json
{
  "status": 409,
  "erro": "Estoque insuficiente para o produto 'Arroz'.",
  "detalhes": null
}
```

- `400` — dados inválidos (FluentValidation ou regras de validação simples)
- `404` — recurso não encontrado
- `409` — conflito de regra de negócio (ex.: estoque insuficiente)
- `500` — erro inesperado

---

## 🧪 Testes automatizados

- Cadastro de produto
- Movimentação de estoque com quantidade inválida
- Venda com estoque suficiente (reduz o estoque corretamente)
- Venda com estoque insuficiente (não altera o estoque)
- Rollback de venda quando um item falha (nenhum item é persistido, estoque não é alterado)
- Venda com cliente inexistente

---

## 🗺️ Roadmap do frontend React

- [ ] Criar SPA em React + Vite consumindo a API (`http://localhost:5173` já liberado no CORS)
- [ ] Tela de produtos (listagem paginada, cadastro, edição, movimentação de estoque)
- [ ] Tela de clientes (listagem paginada, cadastro, edição)
- [ ] Tela de vendas (carrinho com múltiplos itens, confirmação)
- [ ] Dashboard com os indicadores de `GET /api/dashboard/resumo`
- [ ] Autenticação (etapa futura)

---

## 👨‍💻 Autor

**Felipe Thiago**

Analista de Sistemas | Full Stack Developer | Software Engineer
