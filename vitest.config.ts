import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // propriedade utilizada para utlizar o Test Evironment
        environmentMatchGlobs: [
            /** 
             * Basicamente todos os arquivos de teste que se encontram no caminho X usaram o diretório de Test Environment 
             * que termina com o nome Y
             * Ex: todos os arquivos do caminho 'src/http/controllers/*' vão o Test Environment que termina em 'prisma'
             * */
            ['src/http/controllers/*', 'prisma'],
        ],
        // // utilização com o build
        // dir: 'src'
    }
})