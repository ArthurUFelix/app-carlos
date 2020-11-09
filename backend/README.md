# Kiwi

Aplicativo de filas de estabelecimentos.

## Técnologias usadas

* [node](https://nodejs.org/)
* [express](https://expressjs.com/pt-br/)
* [bcryptjs](https://www.npmjs.com/package/bcryptjs)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [postgres](https://www.postgresql.org/)
* [sequelize](https://www.npmjs.com/package/sequelize)

## Guia do colaborador

O projeto está seguindo o padrão [standardjs](https://standardjs.com/), então recomendo que você rode o seguinte comando no terminal antes de fazer `push` ou `merge`:

```node
yarn link:fix
```

Isso irá garantir que inconsistências no código sejam resolvidas ou apontadas para correção.

Caso você esqueça de fazer isso, não tem problema, o Pipeline está configurado para rodar esse comando nas seguintes condições:

```yaml
  on:
  push:
    branches: [ master, develop, feature/** ]
  pull_request:
    branches: [ master, develop ]
```

Se o Pipeline falhar, não será possível realizar `merge`.

Pull requests precisam ser revisados por um colaborador para serem aprovados.

## Guia de instalação

Antes de qualquer coisa rode este comando na raiz do projeto, isso instalará todas as dependências:

```bash
yarn install
```

### Banco de dados

**1.** Tendo o docker instalado na sua máquina, rode o comando:

```bash
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

Caso não tenha muita experiência com docker aqui vai uma lista de [comandos mais usados](https://www.edureka.co/blog/docker-commands/).

**2.** Crie o banco de dados com Sequelize:

```bash
yarn sequelize db:create
```

**3.** Rode as migrations:

```bash
yarn sequelize db:migrate
```

### Rodar a aplicação

Na raiz do projeto digite o seguinte comando para subir a aplicação:

```bash
yarn start
```
