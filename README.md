# App

**GymPass style app**
O GymPass é um dos 3 projetos da formação de Node.js da Rocketseat, ele é uma aplicação de check-ins em
em academias. Ele é uma API REST que possui um sistema de cadastro e login com autorização em JWT, ainda com um sistema de Role Based Authorization Control(RBAC) um controle de usuário baseados nos seus cargos. Neste projeto foram utilizados diversas práticas, desde TDD(Test-Driven Development) até CI(Continuous Integration).

**Tecnologias utilizadas:**
- Node.js
- Typescript
- Docker
- Prisma ORM
- Fastify
- Vitest
- Supertest
- Zod
- Github Actions
- PotsgreSQL
- Git | Github

**Conceitos utilizados**
- **_Repositories_**
  - In Memory Test Repositories
- **_Tests_**
  - CI(Continuous Inntegration) | Github Actions
  - Test Environment
  - Automated Tests
  - TDD(Test-Driven Development)
  - End-to-End tests | Vitest & Supertest
  - Unit Tests | Vitest

**Arquitetura**
- SOLID principles




### RF(Requisitos funcionais)

- [x] Deve ser possível o usuário realizar cadastro;
- [x] Deve ser possível o usuário se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível obter o número de check-in feitos pelo usuário logado;
- [x] Deve ser possível o usuário buscar academias proximas;
- [x] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [x] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia;
- [x] Deve ser possível o usuário obter seu histórico de check-ins
- [x] Deve ser possível obter o número de check-ins feitos pelo usuário logsdos


### RN(Regras de negócios)

- [x] O usuário não deve se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer 2 check-ins no mesmo dia;
- [x] O usuário não deve fazer check-in se não estiver perto (100 metros) da academia;
- [x] O check-in só pode ser validado até 20 minutos após ter sido criado;
- [x] O check-in só pode ser validado por administradores;
- [x] A academia só poder cadastrada por administradores;

### RNF(Requisitos não-funcionais)

- [x] A senha do usuário precisa ser criptografada
- [x] Os dados da aplicação precisam estar persistidos em bacno Postgres SQL;
- [x] Todas listas de dados precisam estar paginados com 20 items por página;
- [x] O usuário deve ser indentificado por token JWT(JSON Web Token);

# Anotações sobre o projeto

- **Docker:** é uma tecnologia que é semelhante à maquinas virtuais, porém, ao contrário delas, ele utiliza a tecnica de containers

- **Inciando uma imagem no Docker:**

  - Abrir terminal e digitar
  - docker run --name nome_da_imagem configurations(not-required) imagem/que_sera_utlizada
  - Ex: docker run --name api-solid-pg -e POSTGRES_USERNAME=docker -e POSTGRES_PASSOWRD=docker -e POSTGRES_DATABASE=apisolid -p 5432:5432 bitnami/postgresql
  - -e: criar variáveis de ambiente
  - -p: directionar a porta padrão do docker(5432) para um outra porta dentro do meu host
  - docker ps: mostra todos o s container ativos
  - docker ps -a: mostra todos os containers que já foram criados
  - docker start <nome|id>: inicializa um container salvo em cache
  - docker stop <nome|id>: para o processo de um container em cahce
  - docker rm <nome|id>: apaga um container criado
  - docker logs <nome>: mostra os logs de um contaner

  **Docker compose:** o docker compose é um arquivo que criamos na raiz do projeto que usa .yaml, que dita quais são todos os container que a app precisa criar para que ela funcione

  - Ex:

    ```yaml
    version: "3"

    services:
      api-solid-pg:
        image: bitnami/postgresql
        ports:
          - 5432:5432
        enviroument:
          - POSTGRES_USERNAME=docker
          - POSTGRES_PASSOWRD=docker
          - POSTGRES_DATABASE=apisolid
    ```

    - Agora quem quiser ter acesso ao banco de dados, basta utlizar do comando
      > **docker** compose up -d
      > -d: ele não vai mostrar os logs do container no terminal, vai rodar tudo por debaixo dos panos.
    - Para parar de executar
      > **docker** compose stop
    - Para excluir o container
      > **docker** compose down

## CI/CD

- **CI(Continuous Integration):** São rotinas para integração de códigos de forma continua, elas definem um fluxo de rotina ppara definir uma forma correta para progressão da criaçãode um software de forma correta. Nós recebemos features e fazemos a verificação dela.
  - Existem muitos tipos de C.I., por exemplo, Code Review, cobertura de testes, etc
- **CD(Continuous Deployment/Delivery):** Um processo em que após uma feature ter sido aprovada, ela é aiutomaticamente adiciona ao projeto principal fazendo seu deploy.

### Processo de C.I.

- Utilizaremos o Github Actions ferramenta do Github utilizada para realizarmos ações no código de um projeto sempre que é feita alguma ação nele
- **_Passos(rodando testes unitário ao relizar o push da aplicação)_**:
  1. Cria-se uma pasta chamada .github
  2. Dentro de .github cria-se a pasta "workflows"
     - Workflow é uma esteira de comandos que são executados quando sempre que uma nova feature chega ao nosso reposiório
  3. Dentro de worksflows criamos o arquivo run-unit-tests.yaml
  4. No arquivo "run-unit-tests.yaml
     > ```yaml
     > # .github/workflows/run-e2e-tests.ts
     > # Definindo nome do workflow
     > name: Run Unit Tests
     >
     > # definindo em qual ação ele será executado
     > on: [push]
     >
     > # definindo a sequencia de ações que serão executadas ao desenvolvedor fizer o push no repositório
     > jobs:
     >   run-unit-tests:
     >     # Deinindo o nome do processo
     >     name: Run Unit Tests
     >     # definindo onde ele será executado
     >     runs-on: ubuntu-latest
     >     #definindo a sequencia de passos
     >     steps:
     >       # Processo de instalação do código
     >       - uses: actions/checkout@v3
     >       # Processo de instalação do node
     >       - uses: actions/setup-node@v3
     >         # Definindo de qual modo ou com o que será executado
     >         with:
     >           # definindo versão do node utilizada
     >           node-version: 20
     >           # Utilizando o cache, toda vez que o github actions realiza o workflow, ele cria um cache dele e na proxima vez em que ele for utilizado, se não houver atualização nas dependencias ele não rodará a instalação das dependencias do node
     >           cache: "npm"
     >       #rodando comandos no terminal
     >       - run: npm ci
     >       - run: npm run test
     > ```
- **_Passos(rodando testes end-to-end ao relizar uma pull request da aplicação)_**:
  1. Cria-se uma pasta chamada .github
  2. Dentro de .github cria-se a pasta "workflows"
     - Workflow é uma esteira de comandos que são executados quando sempre que uma nova feature chega ao nosso reposiório
  3. Dentro de worksflows criamos o arquivo run-unit-tests.yaml
  4. No arquivo "run-e2e-tests.yaml
     > ```yaml
     > # .github/workflows/run-e2e-tests.ts
     > name: Run E2E Tests
     >
     > on: [pull_request]
     >
     > jobs:
     >   run-e2e-tests:
     >     name: Run E2E Tests
     >
     >     runs-on: ubuntu-latest
     >     services:
     >       postgres:
     >         image: btinami/postgresql
     >         ports:
     >           - 5432:5432
     >         env:
     >           POSTGRESQL_USERNAME: docker
     >           POSTGRESQL_PASSWORD: docker
     >           POSTGRESQL_DATABASE: apisolid
     >
     >     steps:
     >       - uses: actions/checkout@v3
     >       - uses: actions/setup-node@v3
     >         with:
     >           node-version: 20
     >           cache: "npm"
     >       - run: npm ci
     >       - run: npm run test:e2e
     >         # definindo as variaveis de ambiente da aplicação
     >         env:
     >           JWT_SECRET: testing
     >           DATABASE_URL: "postgresql://docker:docker@localhost:5432/mydb?schema=public"
     > ```
