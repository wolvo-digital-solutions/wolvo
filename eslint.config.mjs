import next from "eslint-config-next";

const config = [...next, { ignores: [".next/**", "node_modules/**", "public/**", "source-assets/**"] }];
export default config;
