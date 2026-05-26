import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@rental/config$": "<rootDir>/../../packages/config/src/index.ts",
    "^@rental/types$": "<rootDir>/../../packages/types/src/index.ts",
    "^@rental/utils$": "<rootDir>/../../packages/utils/src/index.ts",
  },
  testEnvironment: "node",
};

export default config;
