module.exports = {
  verbose: true,
  testMatch: [
      '**/?(*.)+(test).js?(x)'
  ],
  rootDir: './tests/',
  setupFiles: [
      '<rootDir>/setup.js'
  ],
  roots: [
      '<rootDir>'
  ]
};

