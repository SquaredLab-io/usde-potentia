import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "../sql-indexer/generated/schema.graphql",
  generates: {
    "src/gql/": {
      preset: "client",
      config: {
        useTypeImports: true
      },
      plugins: [],
      documents: ["src/**/*.ts?(x)"]
    }
  }
};

export default config;
