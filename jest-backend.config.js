module.exports = {
  verbose: true,
  testMatch: [ '**/?(*.)+(backend-test).js?(x)' ],
  rootDir: './tests/',
  setupFiles: [ '<rootDir>/setup-backend.js' ],
  roots: [ '<rootDir>' ]
};