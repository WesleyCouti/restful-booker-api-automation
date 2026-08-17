# RESTful Booker API Automation

[![API Tests](https://github.com/WesleyCouti/restful-booker-api-automation/actions/workflows/api-tests.yml/badge.svg)](https://github.com/WesleyCouti/restful-booker-api-automation/actions/workflows/api-tests.yml)

API test automation framework built with **TypeScript, Jest and SuperTest**, focused on REST API validation, maintainability, reusable HTTP clients, contract testing and continuous integration.

This project is part of my QA Automation portfolio and demonstrates practical approaches to structuring automated API tests while keeping test scenarios, HTTP communication, test data and response contracts separated.

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

---

## Test Coverage

The automated suite covers authentication, CRUD operations, contract validation and negative scenarios against the public **RESTful Booker API**.

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

---

## Test Architecture

The framework separates test scenarios from HTTP communication, test data generation, schemas and application configuration.

```text
                     Automated API Tests
                             │
                 ┌───────────┴───────────┐
                 │                       │
          Authentication              Booking
              Tests                    Tests
                 │                       │
                 └───────────┬───────────┘
                             │
                             ▼
                       API Clients
                    ┌────────┴────────┐
                    │                 │
               Auth Client       Booking Client
                    │                 │
                    └────────┬────────┘
                             │
               ┌─────────────┼─────────────┐
               │             │             │
               ▼             ▼             ▼
          Test Data        Types       JSON Schema
           Factory                       + Ajv
               │             │             │
               └─────────────┼─────────────┘
                             │
                             ▼
                         SuperTest
                             │
                             ▼
                    RESTful Booker API
                             │
                             ▼
                     Jest Test Runner
                             │
                             ▼
                     GitHub Actions
```

This architecture keeps HTTP implementation details outside the test scenarios and makes common API operations reusable across the suite.

---

## Project Structure

```text
restful-booker-api-automation/
├── .github/
│   └── workflows/
│       └── api-tests.yml
├── src/
│   ├── clients/
│   ├── config/
│   ├── data/
│   ├── schemas/
│   └── types/
├── tests/
│   ├── auth/
│   └── booking/
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
| `src/data/` | Test data factories |
| `src/schemas/` | JSON Schemas used for contract validation |
| `src/types/` | TypeScript interfaces and API models |
| `tests/auth/` | Authentication scenarios |
| `tests/booking/` | Booking API scenarios |
| `.github/workflows/` | Continuous integration pipeline |

---

## Test Strategy

The framework was structured around principles commonly used in maintainable API test automation.

### Separation of Responsibilities

Test scenarios describe expected API behavior while HTTP operations are encapsulated inside dedicated clients.

This keeps request implementation details away from assertions and makes API operations reusable.

### Test Data Management

Booking payloads are generated through a factory.

Individual scenarios can override only the fields relevant to the test while keeping a valid default payload.

### Test Independence

Scenarios that modify resources create their own test data whenever possible.

This reduces dependencies between tests and prevents execution order from becoming part of the test logic.

### Contract Validation

Response validation is not limited to HTTP status codes and individual field values.

**Ajv + JSON Schema** are used to validate the expected structure and data types of API responses.

### Positive and Negative Testing

The suite includes both successful operations and failure scenarios, including:

- Invalid authentication
- Unauthorized update
- Non-existent resources

### Authentication

Protected operations obtain an authentication token through a dedicated authentication client rather than duplicating authentication logic inside individual tests.

### Continuous Integration

The complete regression suite is executed through GitHub Actions in a clean CI environment.

This ensures the automation can be installed and executed independently of a developer's local machine.

---

## API Operations Covered

| Method | Resource | Validation |
|---|---|---|
| `POST` | `/auth` | Authentication |
| `GET` | `/booking` | Booking listing |
| `POST` | `/booking` | Booking creation + contract validation |
| `PUT` | `/booking/:id` | Full update with authentication |
| `PATCH` | `/booking/:id` | Partial update with authentication |
| `DELETE` | `/booking/:id` | Resource deletion |
| `GET` | Non-existent booking | Negative validation |
| `PUT` | Booking without valid authentication | Authorization validation |

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

Run the complete test suite:

```bash
npm test
```

Run smoke tests:

```bash
npm run test:smoke
```

Run regression tests:

```bash
npm run test:regression
```

Run TypeScript validation:

```bash
npm run typecheck
```

Generate test coverage:

```bash
npm run test:coverage
```

---

## CI/CD Pipeline

The project uses **GitHub Actions** to automatically validate the API automation framework.

```text
Checkout repository
        ↓
Setup Node.js
        ↓
Install dependencies
        ↓
TypeScript validation
        ↓
Run API regression tests
        ↓
Generate test coverage
        ↓
Upload coverage artifact
```

The workflow is executed automatically for relevant repository changes and can also be manually triggered through the **Actions** tab.

The current pipeline status is displayed by the badge at the top of this README.

---

## Test Coverage Report

Jest coverage is generated through:

```bash
npm run test:coverage
```

The report provides visibility into executed code across metrics such as:

- Statements
- Branches
- Functions
- Lines

In CI, the generated coverage report is uploaded as a GitHub Actions artifact for later analysis.

---

## Applications Under Test

### RESTful Booker

RESTful Booker is a public API designed for practicing API testing.

The project uses its authentication and booking endpoints to demonstrate automated REST API validation.

The application is a public testing environment and is not affiliated with this project.

---

## Technical Decisions

### Why SuperTest?

SuperTest provides a simple API for performing HTTP requests and validating responses while integrating naturally with JavaScript and TypeScript test environments.

### Why Jest?

Jest provides test organization, assertions, filtering, coverage and a mature test runner suitable for API automation.

### Why API Clients?

Dedicated clients encapsulate HTTP operations and prevent request implementation details from being duplicated throughout the test suite.

This allows tests to remain focused on expected behavior.

### Why Test Data Factories?

Factories provide valid default payloads while allowing scenarios to customize only the data relevant to each test.

This reduces duplicated test data and improves maintainability.

### Why JSON Schema?

Functional assertions validate expected values, while JSON Schema provides an additional layer for validating response structure and data types.

### Why TypeScript?

TypeScript makes API models and framework contracts explicit and provides static validation before the automated tests are executed.

### Why GitHub Actions?

Continuous integration provides a repeatable environment for validating the framework and demonstrates that the test suite does not depend exclusively on local configuration.

---

## Skills Demonstrated

This project demonstrates practical experience with:

`API Testing` • `REST` • `Test Automation` • `TypeScript` • `Jest` • `SuperTest` • `CRUD` • `Authentication` • `Positive Testing` • `Negative Testing` • `Contract Testing` • `JSON Schema` • `Test Data Management` • `CI/CD` • `GitHub Actions`

---

## Roadmap

Possible next improvements:

- [ ] Environment-specific configuration
- [ ] Dedicated HTML test report
- [ ] Data-driven testing
- [ ] Additional JSON Schema coverage
- [ ] Controlled retry strategy for external API instability
- [ ] Scheduled smoke test execution
- [ ] Test execution summary in CI
- [ ] Additional negative scenarios

---

## Author

**Wesley Coutinho**

QA Engineer | Test Automation

Playwright • Cypress • API Testing • JavaScript • TypeScript • SQL • CI/CD

LinkedIn: https://www.linkedin.com/in/wesleycoutinhoqa/  
GitHub: https://github.com/WesleyCouti
