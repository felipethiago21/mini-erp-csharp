# syntax=docker/dockerfile:1

# Build context deve ser a raiz do repositório (minierp/), pois a API referencia
# outros projetos da solução (Application, Infrastructure, Domain).

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY src/MiniErp.Domain/MiniErp.Domain.csproj src/MiniErp.Domain/
COPY src/MiniErp.Application/MiniErp.Application.csproj src/MiniErp.Application/
COPY src/MiniErp.Infrastructure/MiniErp.Infrastructure.csproj src/MiniErp.Infrastructure/
COPY src/MiniErp.Api/MiniErp.Api.csproj src/MiniErp.Api/
RUN dotnet restore src/MiniErp.Api/MiniErp.Api.csproj

COPY src/MiniErp.Domain/ src/MiniErp.Domain/
COPY src/MiniErp.Application/ src/MiniErp.Application/
COPY src/MiniErp.Infrastructure/ src/MiniErp.Infrastructure/
COPY src/MiniErp.Api/ src/MiniErp.Api/

RUN dotnet publish src/MiniErp.Api/MiniErp.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# /app/data recebe o volume nomeado do SQLite (ver docker-compose.yml). O runtime da
# imagem base roda como usuário não-root; 0777 garante escrita no volume independente
# do UID do container, o que é aceitável aqui pois o volume só guarda o banco local
# de desenvolvimento e não é exposto pela rede.
RUN mkdir -p /app/data && chmod 0777 /app/data

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

ENTRYPOINT ["dotnet", "MiniErp.Api.dll"]
