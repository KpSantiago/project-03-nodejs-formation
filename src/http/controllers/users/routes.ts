import { FastifyInstance } from "fastify";
import { registerUser } from "./register";
import { authenticateUser } from "./authenticate";
import { profile } from "./profile";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { refresh } from "./refresh";

export async function userRoutes(app: FastifyInstance) {
    app.post("/users", registerUser);
    app.post("/sessions", authenticateUser);

    // Refresh token
    app.patch("/token/refresh", refresh);


    /** Authenticated user */
    /**
     *  Toda a parte de autenticação fica nosnossos controllers
     *  Quando o assunto é utilizar aplicações de terceiros, O JWT não pode ser uma boa idade,
     * para isso existem técnicas como API Token e OAuth
     * 
     * ====== Testes E2E =========
     * Para fazer o stestes e2e será utilizado o Test Environment do Vitest que basicamente é uma conifguração de ambiente para laguns tipos de testes 
     * específicos, usando ela, conseguimos mudar, por exemplo, as variáveis de ambeintes para apenas, mas também scripts, migrations etc.
     * 
     * Só podemos utizar env diferentes se criarmos um pacote no projeto que tenha "vitest-enviroument-..."
     * 
     * Passos:
     *  path prisma/
     *      vitest-environment-*prisma/* -> prisma é um nome impoirtente para identificar
     *      - npm init -y
     *              packaje.json
     *              prisma-teste-environment.ts
     *  file prisma-test-environment.ts
     *  # importar 'Environment' do vitest
     *  # exportar um objeto com o tipo <Environment>
     *  name: 'nome do objetio',
     * transformMode: 'ssr', //permite a utlização de promises
     *  setup(){
     *      // onde será dito quais códigos serão executados antes de cada arquivo de test
     *      // Essa funcionalidade é executada por cada sitch de testes, ou seja, cada arquivo de teste
     *      return {
     *          teardown(){
     *              // método que é ativado depois de cada switch(arquivo) de teste executado
     *          } 
     *      }
     *  }
     * 
     * # Configurar o vitest.config.ts
     * 
     * - mesmo depois de configrado o vitest.config.ts, o vitest ainda não sabe que le eprecisa utilizar aqueles Tes Environment, daí ele procura uma
     * dependencia dentro do packaje.json da aplicação, para fazer isso, então, vamos fazer
     * 
     * # dentro de vitest-environment-prisma, no terminal, escrevemos:
     * npm link -> com isso, nós fazemos com que o npm crie algo como um repositório de pacotes dentro da nossa máquina,
     * sendo possível baixá-lo, como se fosse um pacote
     * 
     * # dentro do path '/(root)'
     * npm link vitest-environment-prisma -> ele instala o 'pacote' criado permitindo o sucesso nos testes
     * 
     * ========== Organizando os scripts de Tests =============
     * - Na nossa aplicação, nós não executamos os testes E2E toda hora, pois demoraria muito. Os testes E2E são executados pela CI 
     * 
     * # baixar o npm-run-all com dependencia de desenvolvimento
     * 
     *  - npm-run-all é basicamente uma dependecia que permite criar scripts para rodar comando
     *  que se adaptem ao sistema operacional da pessoa que está utlizando a aplicação
     * 
     * #criar os comandos 
     *  - "test:create-prisma-environment": "npm link ./prisma/vitest-environment-prisma"
     *  - "test:install-prisma-environment": "npm link vitest-environment-prisma"
     *  -> crio os comandos de linkagem manualmente
     * 
     * # dentro de 
     *   - "pretest:e2e": "run-s test:create-prisma-environment test:install-prisma-environment" 
     *   - utlizo o run-s(run sequentially) para rodar os dois comando criados de forma sequencial
     *    
     * - packaje.json: 
     * "scripts": {
     *      "test:create-prisma-environment": "npm link ./prisma/vitest-environment-prisma"
     *      "test:install-prisma-environment": "npm link vitest-environment-prisma"
     *      "test": "vitest --dir src/use-cases",
     *      "test:watch": "vitest run --dir src/use-cases",
     *      "pretest:e2e": "run-s test:create-prisma-environment test:install-prisma-environment",
     *  
     *      //o npm identifica os comandos que começam com 'pre' ou 'post' e executa comando antes(pre) ou depois(post) do 
     *      // comando que vem depois de uma keyword
     *     
     *      "test:e2e": "vitest --dir src/http"
     *  }
     */
    app.get("/me", { onRequest: [verifyJWT] }, profile);
}