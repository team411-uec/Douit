import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

const compat = new FlatCompat({
  baseDirectory: _dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Prettierと競合するルールを無効化
      quotes: "off",
      semi: "off",
      "object-curly-spacing": "off",
      "key-spacing": "off",
      "no-undefined": "off",
      "no-console": "off",
      "comma-dangle": "off",
      "function-paren-newline": "off",
      "multiline-ternary": "off",
      "no-magic-numbers": "off",
      "prefer-template": "off",
      "newline-per-chained-call": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-catch-shadow": "off",
      "no-shadow": "off",
      curly: "off",
      "no-use-before-define": "off",
      "func-style": "off",
      "for-direction": "error",
      "getter-return": ["warn"],
      "no-await-in-loop": "off",
      "no-compare-neg-zero": "error",
      "no-cond-assign": ["warn", "always"],
      "capitalized-comments": "off",
      "no-param-reassign": "off",
      "multiline-comment-style": "off",
      "new-cap": "off",
      "no-undef": "off",
      "no-nested-ternary": "off",
      "operator-linebreak": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-alert": "off",
      "semi-spacing": "off",
      "arrow-body-style": "off",
      "implicit-arrow-linebreak": "off",
      "init-declarations": "off",
      "require-await": "off",
      "no-else-return": "off",
      "prefer-destructuring": "off",
      "max-depth": "off",
      // "no-console": ["warn"], // Prettierに任せる
      "no-constant-condition": "error",
      "no-control-regex": "error",
      "no-debugger": "error",
      "no-dupe-args": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-empty": ["error"],
      "no-empty-character-class": "error",
      "no-ex-assign": "error",
      "no-extra-boolean-cast": "error",
      "no-extra-parens": ["off"],
      "no-extra-semi": "error",
      "no-func-assign": "error",
      "no-inner-declarations": ["error", "both"],
      "no-invalid-regexp": ["error"],
      "no-irregular-whitespace": ["error"], // 文字列もチェックしたほうが安全かなあ
      "no-obj-calls": "error",
      "no-prototype-builtins": "error",
      "no-regex-spaces": "warn",
      "no-sparse-arrays": "error",
      "no-template-curly-in-string": "error",
      "no-unexpected-multiline": "error",
      "no-unreachable": "error",
      "no-unsafe-finally": "error",
      "no-unsafe-negation": "error",
      "use-isnan": "error",
      "valid-typeof": ["error"],

      // Best Practices
      "accessor-pairs": ["warn"],
      "array-callback-return": ["warn", { allowImplicit: true }],
      "block-scoped-var": "warn",
      "class-methods-use-this": ["warn"],
      complexity: ["warn", { max: 20 }],
      "consistent-return": ["error"],
      // curly: ["error"], // Prettierに任せる
      "default-case": ["error"],
      "dot-location": ["error", "property"],
      "dot-notation": ["error"],
      eqeqeq: ["error", "smart"],
      "guard-for-in": "off",
      // "no-alert": "warn", // Prettierに任せる
      "no-caller": "error",
      "no-case-declarations": "warn",
      "no-div-regex": "error",
      // "no-else-return": ["error", { allowElseIf: false }], // Prettierに任せる
      "no-empty-function": ["warn"],
      "no-empty-pattern": "error",
      "no-eq-null": "error",
      "no-eval": ["error"],
      "no-extend-native": ["error"],
      "no-extra-bind": "error",
      "no-extra-label": "error",
      "no-fallthrough": ["error", { commentPattern: "break[\\s\\w]*omitted | no\\s?break" }],
      "no-floating-decimal": "error",
      "no-global-assign": ["error"],
      "no-implicit-coercion": ["off"],
      "no-implicit-globals": ["off"],
      "no-implied-eval": ["error"],
      "no-invalid-this": "error",
      "no-iterator": "error",
      "no-labels": "error",
      "no-lone-blocks": "error",
      "no-loop-func": "error",
      // "no-magic-numbers": ["warn", { ignoreArrayIndexes: true }], // Prettierに任せる
      "no-multi-spaces": [
        "warn",
        {
          exceptions: {
            Property: true,
            VariableDeclarator: true,
            ImportDeclaration: true,
          },
        },
      ],
      "no-multi-str": "error",
      "no-new": "error",
      "no-new-func": "error",
      "no-new-wrappers": "error",
      "no-octal": "error",
      "no-octal-escape": "error",
      // "no-param-reassign": ["warn"], // Prettierに任せる
      "no-proto": "error",
      "no-redeclare": ["error"],
      "no-restricted-properties": "off",
      "no-return-assign": "error",
      "no-return-await": "warn",
      "no-script-url": "error",
      "no-self-assign": ["error"],
      "no-self-compare": "error",
      "no-sequences": ["warn"],
      "no-throw-literal": "error",
      "no-unmodified-loop-condition": "error",
      "no-unused-expressions": ["error"],
      "no-unused-labels": "error",
      "no-useless-call": "error",
      "no-useless-concat": "error",
      "no-useless-escape": "error",
      "no-useless-return": "error",
      "no-void": "error",
      "no-warning-comments": "warn",
      "no-with": "error",
      "prefer-promise-reject-errors": ["error", { allowEmptyReject: true }],
      radix: "error",
      // "require-await": "warn", // Prettierに任せる
      "vars-on-top": "warn",
      "wrap-iife": ["warn", "inside"],
      yoda: ["error", "never", { exceptRange: true }],

      // Strict Mode
      strict: ["off"], // 保留

      // Variables
      // "init-declarations": ["error"], // Prettierに任せる
      // "no-catch-shadow": "error", // Prettierに任せる
      "no-delete-var": "error",
      "no-label-var": "error",
      "no-restricted-globals": ["warn"],
      // "no-shadow": ["warn"], // Prettierに任せる
      "no-shadow-restricted-names": "error",
      // "no-undef": ["error"], // Prettierに任せる
      "no-undef-init": "error",
      // "no-undefined": "error", // Prettierに任せる
      // "no-unused-vars": ["error"], // Prettierに任せる
      // "no-use-before-define": ["error"], // Prettierに任せる

      // Node.js and CommonJS
      "callback-return": ["error"],
      "global-require": "error",
      "handle-callback-err": ["warn"],
      "no-buffer-constructor": "warn",
      "no-mixed-requires": ["warn"],
      "no-new-require": "warn",
      "no-path-concat": "error",
      "no-process-env": "warn",
      "no-process-exit": "warn",
      "no-restricted-modules": ["warn"],
      "no-sync": ["warn"],

      // Stylistic Issues
      "array-bracket-newline": ["error", { multiline: true }],
      "array-bracket-spacing": ["error", "never"],
      "array-element-newline": ["error", { multiline: true }],
      "block-spacing": ["error", "always"],
      "brace-style": ["error", "1tbs", { allowSingleLine: false }],
      // camelcase: ["warn", { properties: "always" }], // Prettierに任せる
      // "capitalized-comments": ["error"], // Prettierに任せる
      // "comma-dangle": ["error", "never"], // Prettierに任せる
      "comma-spacing": ["error", { before: false, after: true }],
      "comma-style": ["error", "last"],
      "computed-property-spacing": ["error", "never"],
      "consistent-this": ["warn"],
      "eol-last": ["error", "always"],
      "func-call-spacing": ["error", "never"],
      "func-name-matching": ["warn"],
      "func-names": ["off"],
      // "func-style": ["error", "expression"], // Prettierに任せる
      // "function-paren-newline": ["error", "multiline"], // Prettierに任せる
      "id-blacklist": ["warn"],
      "id-length": ["off"],
      "id-match": ["off"],
      // "implicit-arrow-linebreak": ["error", "beside"], // Prettierに任せる
      indent: "off",
      "jsx-quotes": ["error"],
      // "key-spacing": [
      //   "error",
      //   {
      //     beforeColon: true,
      //     afterColon: true,
      //     mode: "minimum",
      //     align: "colon",
      //   },
      // ], // Prettierに任せる
      "keyword-spacing": ["error"],
      "line-comment-position": ["off"],
      "linebreak-style": ["error", "unix"],
      "lines-around-comment": ["off"],
      "lines-between-class-members": ["error", "always"],
      // "max-depth": ["warn", { max: 4 }], // Prettierに任せる
      "max-len": ["off"],
      "max-lines": ["off"],
      "max-nested-callbacks": ["error"],
      "max-params": ["warn", { max: 5 }],
      "max-statements": ["warn", { max: 30 }, { ignoreTopLevelFunctions: true }],
      "max-statements-per-line": ["warn", { max: 2 }],
      // "multiline-comment-style": ["warn", "starred-block"], // Prettierに任せる
      // "multiline-ternary": ["error", "always-multiline"], // Prettierに任せる
      // "new-cap": ["error"], // Prettierに任せる
      "new-parens": ["error"],
      // "newline-per-chained-call": ["error"], // Prettierに任せる
      "no-array-constructor": ["error"],
      "no-bitwise": ["error"],
      "no-continue": "off",
      "no-inline-comments": "off",
      "no-lonely-if": "error",
      "no-mixed-operators": ["error"],
      "no-mixed-spaces-and-tabs": ["error"],
      "no-multi-assign": "error",
      "no-multiple-empty-lines": ["error"],
      "no-negated-condition": "error",
      // "no-nested-ternary": "error", // Prettierに任せる
      "no-new-object": "error",
      "no-plusplus": ["off"],
      "no-restricted-syntax": ["off"],
      "no-tabs": "error",
      "no-ternary": "off",
      "no-trailing-spaces": ["error"],
      "no-underscore-dangle": ["error"],
      "no-unneeded-ternary": ["error"],
      "no-whitespace-before-property": "error",
      "nonblock-statement-body-position": ["off"], // そもそもnonblockを許さない
      "object-curly-newline": ["error", { consistent: true }],
      // "object-curly-spacing": ["error", "never"], // Prettierに任せる
      "object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
      "one-var": ["off"],
      "one-var-declaration-per-line": ["off"],
      "operator-assignment": ["warn"],
      // "operator-linebreak": ["error", "before"], // Prettierに任せる
      "padded-blocks": ["error", "never"],
      "padding-line-between-statements": ["off"], // 保留
      "quote-props": ["error", "as-needed"], // consistent-as-neededと悩み中
      // quotes: ["error", "single", { avoidEscape: true }], // Prettierに任せる
      // semi: ["error", "never"], // Prettierに任せる
      // "semi-spacing": ["error", { before: false, after: false }], // Prettierに任せる
      "semi-style": "error",
      "sort-keys": ["off"],
      "sort-vars": ["off"],
      "space-before-blocks": ["error", "always"],
      "space-before-function-paren": [
        "error",
        {
          anonymous: "never",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "space-in-parens": ["error", "never"],
      "space-infix-ops": ["error"],
      "space-unary-ops": [
        "error",
        {
          words: true,
          nonwords: false,
        },
      ],
      "spaced-comment": ["error", "always"],
      "switch-colon-spacing": ["error"],
      "template-tag-spacing": ["error"], // タグ使わないので保留
      "unicode-bom": ["error", "never"],
      "wrap-regex": "off",

      // ECMAScript 6
      // "arrow-body-style": ["error", "as-needed"], // Prettierに任せる
      "arrow-parens": ["error", "as-needed"],
      "arrow-spacing": ["error"],
      "constructor-super": "error",
      "generator-star-spacing": [
        "error",
        {
          before: false,
          after: true,
        },
      ],
      "no-class-assign": "error",
      "no-confusing-arrow": ["off"], // 簡単な三項演算子は使いたいかもしれないので、保留
      "no-const-assign": "error",
      "no-dupe-class-members": "error",
      "no-duplicate-imports": ["error"],
      "no-new-symbol": "error",
      "no-restricted-imports": ["warn"],
      "no-this-before-super": "error",
      "no-useless-computed-key": "error",
      "no-useless-constructor": "error",
      "no-useless-rename": ["error"],
      "no-var": "error",
      "object-shorthand": ["error"],
      "prefer-arrow-callback": ["error"],
      "prefer-const": ["error"],
      // "prefer-destructuring": ["warn"], // Prettierに任せる
      "prefer-numeric-literals": ["off"],
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      // "prefer-template": "warn", // Prettierに任せる
      "require-yield": "error",
      "rest-spread-spacing": ["error", "never"],
      "sort-imports": ["off"],
      "symbol-description": "error",
      "template-curly-spacing": ["error", "never"],
      "yield-star-spacing": [
        "error",
        {
          before: false,
          after: true,
        },
      ],
    },
  },
];

export default eslintConfig;
