exports.config = {
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:3010',
      show: !process.env.CI, //false
      headless: Boolean(process.env.CI),//true
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      windowSize: '1200x900'
    }
  },
  include: {
    I: './steps_file.js'
  },
  mocha: {},
  bootstrap: null,
  timeout: null,
  teardown: null,
  hooks: [],
  gherkin: {
    features: './features/*.feature',
    steps: ['./step_definitions/steps.js']
  },
  plugins: {
    screenshotOnFail: {
      enabled: true
    }
  },
  stepTimeout: 0,
  stepTimeoutOverride: [{
      pattern: 'wait.*',
      timeout: 0
    },
    {
      pattern: 'amOnPage',
      timeout: 0
    }
  ],
  tests: './*_test.js',
  name: 'tests'
}