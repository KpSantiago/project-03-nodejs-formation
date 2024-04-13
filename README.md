# App

GymPass style app

## RF(Requisitos funcionais)

- [x] Deve ser possível o usuário realizar cadastro;
- [x] Deve ser possível o usuário se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [] Deve ser possível obter o número de check-in feitos pelo usuário logado;
- [] Deve ser possível o usuário buscar academias proximas;
- [] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia;

## RN(Regras de negócios)

- [x] O usuário não deve se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer 2 check-ins no mesmo dia;
- [x] O usuário não deve fazer check-in se não estiver a menos de 100 metros da academia;
- [] O check-in só pode ser validado após 20 minutos depois que tiver sido criado;
- [] O check-in só pode ser validado por administradores;
- [] A academia só poder cadastrada por administradores;

## RNF(Requisitos não-funcionais)

- [x] A senha do usuário precisa ser criptografada
- [] Os dados da aplicação precisam estar persistidos em bacno Postgres SQL;
- [x] Todas listas de dados precisam estar paginados com 20 items por página;
- [] O usuário deve ser indentificado por token JWT(JSON Web Token);

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
- **_Passos_**:
  1. Cria-se uma pasta chamada .github
  2. Dentro de .github cria-se a pasta "workflows"
     - Workflow é uma esteira de comandos que são executados quando sempre que uma nova feature chega ao nosso reposiório
  3. Dentro de worksflows criamos o arquivo run-unit-tests.yaml
  4. No arquivo "run-unit-tests.yaml
     > ```yaml
     > # definindoo nome do workflow
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
