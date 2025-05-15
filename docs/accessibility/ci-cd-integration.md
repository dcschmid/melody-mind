# CI/CD Integration for WCAG AAA Tests

This documentation explains how to integrate automated WCAG AAA accessibility tests with axe-core
into CI/CD pipelines.

## GitHub Actions Integration

To integrate axe-core tests in a GitHub Actions pipeline, add the following workflow:

```yaml
# .github/workflows/accessibility-tests.yml
name: Accessibility Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  accessibility:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "yarn"

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build project
        run: yarn build

      - name: Start development server
        run: yarn dev &
        env:
          SERVER_PORT: 3000

      - name: Wait for server
        run: |
          echo "Waiting for server to start..."
          timeout 30 bash -c 'until curl -s http://localhost:3000 > /dev/null; do sleep 1; done' || (echo "Server failed to start" && exit 1)

      - name: Install axe-core CLI
        run: yarn global add @axe-core/cli

      - name: Run axe-core accessibility tests
        run: |
          axe http://localhost:3000 --tags wcag2aaa --save accessibility-report.json
          if grep -q '"violations":\s*\[\s*{' accessibility-report.json; then
            echo "WCAG AAA violations found. See report for details."
            exit 1
          fi

      - name: Upload accessibility report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: accessibility-report
          path: accessibility-report.json
```

## GitLab CI Integration

For GitLab CI, use the following configuration:

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - accessibility

build:
  stage: build
  image: node:18
  script:
    - yarn install --frozen-lockfile
    - yarn build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

test:
  stage: test
  image: node:18
  script:
    - yarn install --frozen-lockfile
    - yarn test

accessibility:
  stage: accessibility
  image: node:18
  script:
    - yarn install --frozen-lockfile
    - yarn global add @axe-core/cli
    - yarn dev &
    - sleep 10 # Wait for server to start
    - axe http://localhost:3000 --tags wcag2aaa --save accessibility-report.json
    - if grep -q '"violations":\s*\[\s*{' accessibility-report.json; then echo "WCAG AAA violations
      found" && exit 1; fi
  artifacts:
    paths:
      - accessibility-report.json
    expire_in: 1 week
    when: always
```

## Jenkins Pipeline Integration

For Jenkins, create a Jenkinsfile with the following content:

```groovy
// Jenkinsfile
pipeline {
    agent {
        docker {
            image 'node:18'
        }
    }

    stages {
        stage('Build') {
            steps {
                sh 'yarn install --frozen-lockfile'
                sh 'yarn build'
            }
        }

        stage('Test') {
            steps {
                sh 'yarn test'
            }
        }

        stage('Accessibility Tests') {
            steps {
                sh 'yarn global add @axe-core/cli'
                sh 'yarn dev &'
                sh 'sleep 10'  // Wait for server to start
                sh 'axe http://localhost:3000 --tags wcag2aaa --save accessibility-report.json'
                sh '''
                    if grep -q '"violations":\\s*\\[\\s*{' accessibility-report.json; then
                        echo "WCAG AAA violations found"
                        exit 1
                    fi
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'accessibility-report.json', fingerprint: true
                }
            }
        }
    }
}
```

## Adjusting Test Coverage

The tests can be extended to check different pages and views:

```bash
# Testing multiple pages
axe http://localhost:3000 http://localhost:3000/gamehome http://localhost:3000/highscores --tags wcag2aaa --save report.json

# Testing with different viewports
axe http://localhost:3000 --tags wcag2aaa --browser --viewport "375x667" --save mobile-report.json
axe http://localhost:3000 --tags wcag2aaa --browser --viewport "1440x900" --save desktop-report.json
```

These tests can be integrated into the CI/CD pipelines accordingly.

## Adjusting Thresholds

In some projects, it may be useful to tolerate a certain number of warnings while a refactoring is
in progress. For this, you can create a script that analyzes the reports and only fails on critical
or excessive errors:

```javascript
// scripts/analyze-a11y-results.js
const fs = require("fs");
const report = JSON.parse(fs.readFileSync("accessibility-report.json", "utf8"));

const MAX_ALLOWED_WARNINGS = 10; // Configurable
const CRITICAL_ISSUES = ["critical", "serious"];

let criticalViolations = 0;
let totalViolations = 0;

report.violations.forEach((violation) => {
  const impactCount = violation.nodes.length;
  totalViolations += impactCount;

  if (CRITICAL_ISSUES.includes(violation.impact)) {
    criticalViolations += impactCount;
    console.error(`CRITICAL: ${violation.help} (${impactCount} occurrences)`);
  } else {
    console.warn(`WARNING: ${violation.help} (${impactCount} occurrences)`);
  }
});

console.log(`Total violations: ${totalViolations}, Critical: ${criticalViolations}`);

// Only fail CI on critical issues or excessive total violations
if (criticalViolations > 0 || totalViolations > MAX_ALLOWED_WARNINGS) {
  process.exit(1);
}
```

Then you can use the script in your CI/CD pipeline:

```yaml
- name: Run accessibility tests
  run: |
    axe http://localhost:3000 --tags wcag2aaa --save accessibility-report.json
    node scripts/analyze-a11y-results.js
```

## Complete Integration with Test Environments

For a more robust test environment, we recommend integrating with Cypress or Playwright to test
dynamic interactions:

```javascript
// cypress/integration/accessibility.spec.js
describe("Accessibility Tests", () => {
  it("Home page meets WCAG AAA standards", () => {
    cy.visit("/");
    cy.injectAxe();
    cy.checkA11y(null, {
      runOnly: {
        type: "tag",
        values: ["wcag2aaa"],
      },
    });
  });

  it("Game page with user interactions meets WCAG AAA standards", () => {
    cy.visit("/gamehome");
    cy.get("button.difficulty-select").first().click();
    cy.injectAxe();
    cy.checkA11y(null, {
      runOnly: {
        type: "tag",
        values: ["wcag2aaa"],
      },
    });
  });
});
```

For the CI/CD pipeline:

```yaml
- name: Run Cypress tests with accessibility
  run: yarn cypress:run
```

## Tips for MelodyMind-Specific Requirements

Since MelodyMind is a music trivia game, you should pay special attention to the following areas:

1. **Audio Controls**: Ensure that audio controls are accessible and offer alternative methods
2. **Timer Elements**: Check that game time limits are accessible and adjustable
3. **Game Controls**: Test the keyboard accessibility of game controls
4. **Feedback Mechanisms**: Validate that feedback is available both visually and auditorily

Add these specific tests to your CI/CD pipeline:

```yaml
- name: Run axe-core game-specific tests
  run: |
    # Game interface test
    axe http://localhost:3000/game-rock/easy --tags wcag2aaa --rules color-contrast,aria-allowed-attr,aria-required-attr --save game-report.json

    # Audio player test
    axe http://localhost:3000/components/audio-test --tags wcag2aaa --rules audio-caption,aria-allowed-attr --save audio-report.json
```

## Summary

With these configurations, you automate WCAG AAA accessibility testing in your CI/CD workflow.
Accessibility issues are detected early in pull requests, and reports are automatically generated
and stored as artifacts.
