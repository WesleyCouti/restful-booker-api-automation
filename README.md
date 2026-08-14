# RESTful Booker API Automation

Framework de automação de testes de API criado como projeto de portfólio de **Quality Assurance**, com foco em cobertura REST, organização de código, validação de contratos e execução contínua.

## Objetivo

Demonstrar uma abordagem dedicada para testes automatizados de API, separando responsabilidades entre clientes HTTP, dados de teste, contratos e cenários.

A aplicação utilizada é a API pública **RESTful Booker**.

## Stack

- TypeScript
- Jest
- SuperTest
- Ajv / JSON Schema
- Node.js
- GitHub Actions

## Cobertura

### Autenticação
- Token com credenciais válidas
- Credenciais inválidas

### Booking
- GET lista de reservas
- POST criação
- GET por ID
- PUT atualização completa
- PATCH atualização parcial
- DELETE remoção
- Validação de JSON Schema
- Cenário de recurso inexistente
- Cenário sem autenticação válida

## Estrutura

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
└── tsconfig.json
```

## Decisões de arquitetura

- **Clients:** centralizam chamadas HTTP e evitam repetição nos testes.
- **Factory:** mantém os dados de booking reutilizáveis e permite sobrescrever apenas o necessário.
- **Types:** tornam os contratos utilizados pelo código explícitos.
- **JSON Schema:** valida a estrutura da resposta além dos valores funcionais.
- **Testes independentes:** cenários que alteram reservas criam seus próprios dados.
- **CI:** a suíte é executada automaticamente no GitHub Actions.

## Instalação

```bash
npm install
```

## Execução

Todos os testes:

```bash
npm test
```

Smoke:

```bash
npm run test:smoke
```

Regressão:

```bash
npm run test:regression
```

Type check:

```bash
npm run typecheck
```

Cobertura:

```bash
npm run test:coverage
```

## Configuração

Por padrão, o projeto utiliza:

```text
https://restful-booker.herokuapp.com
```

Variáveis opcionais:

```text
BASE_URL
API_USERNAME
API_PASSWORD
```

O arquivo `.env.example` documenta os valores esperados. Credenciais reais não devem ser versionadas.

## CI/CD

O workflow `API Tests` executa:

1. Checkout do código
2. Configuração do Node.js
3. Instalação das dependências
4. Validação TypeScript
5. Suíte de regressão
6. Geração de cobertura
7. Publicação da cobertura como artifact

O workflow também pode ser iniciado manualmente pela aba **Actions**.

## Competências demonstradas

Este projeto foi estruturado para evidenciar:

- API Testing
- REST
- Test Automation
- TypeScript
- Jest
- SuperTest
- CRUD
- Autenticação
- Positive and Negative Testing
- Contract Testing
- JSON Schema Validation
- Test Data Management
- Git/GitHub
- CI/CD
- GitHub Actions

## Próximas evoluções

- Separação por ambientes
- Relatório HTML dedicado
- Testes orientados a dados
- Retry controlado para indisponibilidade externa
- Contract testing mais abrangente
- Execução agendada de smoke tests

## Autor

**Wesley Coutinho**  
QA Engineer | Test Automation

LinkedIn: https://www.linkedin.com/in/wesleycoutinhoqa/  
GitHub: https://github.com/WesleyCouti
