# RESTful Booker API Automation

[![API Tests](https://github.com/WesleyCouti/restful-booker-api-automation/actions/workflows/api-tests.yml/badge.svg)](https://github.com/WesleyCouti/restful-booker-api-automation/actions/workflows/api-tests.yml)

API test automation framework built with **TypeScript, Jest and SuperTest**, focused on REST API validation, maintainability, reusable HTTP clients, contract testing, defensive validation and continuous integration.

This project is part of my **QA Automation portfolio** and demonstrates how I structure an API automation framework by separating test scenarios, HTTP communication, test data, contracts and configuration.

The project currently contains **12 automated tests across 3 test suites**, with **100% code coverage** for statements, branches, functions and lines.

---

## Tech Stack

- TypeScript
- Jest
- SuperTest
- Ajv
- JSON Schema
- Node.js
- GitHub Actions
- REST API Testing
- Contract Testing
- Test Data Factory
- CI/CD

---

## Current Quality Status

| Metric | Result |
|---|---:|
| Test Suites | 3 / 3 ✅ |
| Automated Tests | 12 / 12 ✅ |
| Statements Coverage | 100% |
| Branch Coverage | 100% |
| Functions Coverage | 100% |
| Lines Coverage | 100% |
| TypeScript Validation | ✅ Passing |
| Coverage Quality Gate | ✅ Passing |
| CI Pipeline | ✅ Passing |

Latest validated coverage execution:

```text
Test Suites: 3 passed, 3 total
Tests:       12 passed, 12 total

Statements : 100% (30/30)
Branches   : 100% (4/4)
Functions  : 100% (10/10)
Lines      : 100% (30/30)
```

---

## Test Coverage

The automated suite covers authentication, CRUD operations, contract validation, negative scenarios and defensive behavior of the API clients.

### Authentication

- Generate authentication token with valid credentials
- Validate response for invalid credentials

### Booking

- List available bookings
- Create a new booking
- Validate booking response contract
- Update an existing booking using authentication
- Partially update an existing booking
- Delete a booking
- Confirm deleted resource is no longer available
- Validate non-existent resource response
- Validate unauthorized update attempt

### Client Guard Tests

The framework also contains unit-level tests for defensive behavior inside the API clients.

Covered scenarios include:

- Authentication returning an unexpected HTTP status
- Authentication response without a token
- Booking creation returning an unexpected HTTP status

These tests validate framework behavior itself, not only the external API.

---

## Test Architecture

The framework separates test scenarios from HTTP communication, test data generation, schemas and application configuration.

```text
                         Automated Tests
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       Authentication       Booking        Client Guard
           Tests             Tests             Tests
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                          API Clients
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
               Auth Client          Booking Client
                    │                     │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
          Test Data           Types         JSON Schema
           Factory                            + Ajv
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                           SuperTest
                               │
                               ▼
                      RESTful Booker API
                               │
                               ▼
                             Jest
                               │
                               ▼
                        GitHub Actions
                               │
                  ┌────────────┴────────────┐
                  ▼                         ▼
             Quality Gate             Coverage Report
```

This architecture keeps HTTP implementation details outside the functional scenarios, improves reuse and allows both the API behavior and framework internals to be tested independently.

---

## Project Structure

```text
restful-booker-api-automation/
├── .github/
│   └── workflows/
│       └── api-tests.yml
│
├── src/
│   ├── clients/
│   │   ├── auth.client.ts
│   │   └── booking.client.ts
│   ├── config/
│   ├── data/
│   │   └── booking.factory.ts
│   ├── schemas/
│   │   └── booking.schema.ts
│   └── types/
│       └── booking.ts
│
├── tests/
│   ├── auth/
│   │   └── auth.spec.ts
│   ├── booking/
│   │   └── booking.spec.ts
│   └── unit/
│       └── client-guards.spec.ts
│
├── .env.example
├── .gitignore
├── jest.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Responsibilities

| Directory | Responsibility |
|---|---|
| `src/clients/` | HTTP clients and reusable API operations |
| `src/config/` | Environment and API configuration |
| `src/data/` | Reusable test data factories |
| `src/schemas/` | JSON Schemas used for contract validation |
| `src/types/` | TypeScript interfaces and API models |
| `tests/auth/` | Authentication scenarios |
| `tests/booking/` | Booking API scenarios |
| `tests/unit/` | Defensive behavior and client guard tests |
| `.github/workflows/` | Continuous integration pipeline |

---

## Test Strategy

The framework was designed around principles commonly applied to maintainable API test automation.

### Separation of Responsibilities

Test scenarios describe expected API behavior while HTTP operations are encapsulated inside dedicated clients.

This keeps request implementation details away from assertions and makes common operations reusable throughout the suite.

### Test Data Management

Booking payloads are generated through a reusable factory.

A valid default payload is provided while individual scenarios can override only the fields relevant to their validation.

Example:

```typescript
const updatedPayload = buildBooking({
  firstname: 'Updated',
  totalprice: 900
});
```

This avoids duplicating large payload objects throughout the test suite.

### Test Independence

Scenarios that modify resources create their own test data whenever possible.

This reduces dependencies between tests and prevents execution order from becoming part of the test logic.

### Contract Validation

API validation is not limited to HTTP status codes or individual field assertions.

**Ajv + JSON Schema** are used to validate response structure and expected data types.

This provides an additional validation layer capable of detecting unexpected API contract changes.

### Positive and Negative Testing

The suite covers both successful operations and failure conditions.

Examples include:

- Valid authentication
- Invalid authentication
- Unauthorized update
- Non-existent resources
- Unexpected HTTP responses
- Missing authentication token

### Defensive Client Validation

Reusable clients contain guard clauses for critical operations.

For example, authentication validates whether the expected token was actually returned before allowing the test flow to continue.

These defensive behaviors are covered by dedicated unit tests.

### Static Validation

TypeScript validation runs before the automated suite in CI.

```bash
npm run typecheck
```

This allows type-related problems to fail earlier in the pipeline.

### Coverage Quality Gate

Code coverage is part of the automated validation strategy.

The current framework achieves:

```text
Statements : 100%
Branches   : 100%
Functions  : 100%
Lines      : 100%
```

Coverage thresholds are enforced by Jest so the pipeline can detect regressions in tested framework code.

---

## API Operations Covered

| Method | Resource | Validation |
|---|---|---|
| `POST` | `/auth` | Authentication |
| `GET` | `/booking` | Booking listing |
| `POST` | `/booking` | Booking creation |
| `POST` | `/booking` | JSON Schema contract validation |
| `PUT` | `/booking/:id` | Full authenticated update |
| `PATCH` | `/booking/:id` | Partial authenticated update |
| `DELETE` | `/booking/:id` | Resource deletion |
| `GET` | Non-existent booking | Negative validation |
| `PUT` | Booking with invalid authentication | Authorization validation |

---

## Getting Started

### Requirements

- Node.js
- npm

Clone the repository:

```bash
git clone https://github.com/WesleyCouti/restful-booker-api-automation.git
```

Enter the project directory:

```bash
cd restful-booker-api-automation
```

Install dependencies:

```bash
npm install
```

---

## Environment Configuration

The default API endpoint is:

```text
https://restful-booker.herokuapp.com
```

The project supports the following environment variables:

```text
BASE_URL
API_USERNAME
API_PASSWORD
```

An `.env.example` file documents the expected configuration.

Sensitive credentials should not be committed to the repository.

---

## Running the Tests

### Complete suite

```bash
npm test
```

### Smoke tests

```bash
npm run test:smoke
```

### Regression suite

```bash
npm run test:regression
```

### TypeScript validation

```bash
npm run typecheck
```

### Tests with coverage

```bash
npm run test:coverage
```

---

## CI/CD Pipeline

The project uses **GitHub Actions** to continuously validate the automation framework.

```text
              Push / Pull Request
                       │
                       ▼
              Checkout Repository
                       │
                       ▼
                 Setup Node.js
                       │
                       ▼
              Install Dependencies
                       │
                       ▼
              TypeScript Validation
                       │
                       ▼
              API Regression Suite
                       │
                       ▼
             Coverage Quality Gate
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
        Coverage Pass      Coverage Failure
              │                 │
              ▼                 ▼
       Upload Artifact     Pipeline Failure
```

The workflow validates the project automatically when relevant repository changes are submitted.

It can also be manually triggered through the **Actions** tab using `workflow_dispatch`.

The current pipeline status is displayed by the badge at the top of this README.

---

## Coverage Report

Jest generates the code coverage report during CI execution.

Current validated results:

| Coverage | Result |
|---|---:|
| Statements | **100%** |
| Branches | **100%** |
| Functions | **100%** |
| Lines | **100%** |

Coverage is generated with:

```bash
npm run test:coverage
```

The generated report is uploaded by GitHub Actions as a pipeline artifact for later analysis.

The objective of the coverage gate is not simply to maximize a percentage, but to ensure that relevant framework behavior — including error handling and defensive branches — remains validated as the project evolves.

---

## Application Under Test

### RESTful Booker

RESTful Booker is a public API designed for practicing API testing.

This framework uses its authentication and booking endpoints to demonstrate automated REST API validation.

The application is a public testing environment and is not affiliated with this project.

---

## Technical Decisions

### Why SuperTest?

SuperTest provides a straightforward API for HTTP requests and integrates naturally with JavaScript/TypeScript testing environments.

It allows HTTP communication to remain concise while still providing complete access to response status, headers and body.

### Why Jest?

Jest provides test organization, assertions, filtering, mocking and code coverage within the same test runner.

Mocking is particularly useful for validating client guard clauses without depending on the behavior of the external API.

### Why API Clients?

Dedicated clients encapsulate HTTP operations such as:

```text
Authentication
Booking creation
Booking update
Partial update
Deletion
Resource retrieval
```

This prevents HTTP request implementation from being duplicated across multiple scenarios.

### Why Test Data Factories?

Factories provide valid default payloads while allowing scenarios to customize only the data relevant to each test.

This reduces duplication and improves maintainability.

### Why JSON Schema?

Functional assertions verify expected values while JSON Schema provides an additional layer for validating response structure and data types.

Together, they provide stronger validation than checking status codes alone.

### Why TypeScript?

TypeScript makes API models and framework contracts explicit and provides static validation before automated tests execute.

### Why Client Guard Tests?

External APIs can return unexpected responses.

Guard clauses allow the framework to fail with meaningful errors rather than continuing execution with invalid state.

Dedicated unit tests verify these defensive paths without intentionally destabilizing the external API.

### Why GitHub Actions?

Continuous integration provides a clean and repeatable execution environment.

The pipeline demonstrates that the framework can be installed, validated and executed independently of a developer's local configuration.

---

## Skills Demonstrated

This project demonstrates practical experience with:

`API Testing` • `REST` • `Test Automation` • `TypeScript` • `Jest` • `SuperTest` • `CRUD` • `Authentication` • `Positive Testing` • `Negative Testing` • `Contract Testing` • `JSON Schema` • `Ajv` • `Test Data Management` • `API Client Architecture` • `Unit Testing` • `Mocking` • `Code Coverage` • `Quality Gates` • `CI/CD` • `GitHub Actions`

---

## Roadmap

Possible future improvements:

- [ ] Environment-specific configuration
- [ ] Dedicated HTML test report
- [ ] Data-driven testing
- [ ] Additional JSON Schema contracts
- [ ] Controlled retry strategy for external API instability
- [ ] Scheduled smoke test execution
- [ ] Test execution summary directly in GitHub Actions
- [ ] Response time assertions
- [ ] Additional negative and boundary scenarios

---

## Author

**Wesley Coutinho**

QA Engineer | Test Automation

Playwright • Cypress • API Testing • JavaScript • TypeScript • SQL • CI/CD

LinkedIn: https://www.linkedin.com/in/wesleycoutinhoqa/  
GitHub: https://github.com/WesleyCouti
