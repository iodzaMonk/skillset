const cucumberConfig = {
  default: {
    // Load TypeScript at runtime
    requireModule: ["tsx/register"],
    // Use require for step discovery (works with tsx/register)
    import: [
      "features/step_definitions/**/*.ts",
      "features/step_definitions/**/*.js",
    ],
    // Feature files
    paths: ["features/**/*.feature"],
    format: ["progress"],
    publishQuiet: true,
  },
};

export default cucumberConfig;
