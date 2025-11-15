# Testing Policy

## Overview

This application uses **integration tests only**. Tests interact with the actual database using the real Prisma singleton instance, ensuring tests validate the complete request-response cycle from the user's perspective.

## Core Principles

### 1. Integration Testing Only
- **Use the actual database**: Tests must use the real Prisma client singleton from `@beroboard/db`
- **No mocks for database**: Do not mock Prisma or database operations
- **No mocks for authentication**: Do not mock user authentication or authorization. Always create real users through better-auth endpoints
- **Real HTTP requests**: Tests use Elysia's `handle()` method with Web Standard `Request` objects

### 2. User-Centric Coverage
- **Cover all HTTP response scenarios**: Test all possible HTTP status codes and response bodies that users might encounter
- **Focus on user experience**: Test what the user sees, not internal implementation details
- **Skip edge cases**: Do not test database connection errors, external service failures, or server infrastructure issues

### 3. Simplicity and Conciseness
- **Keep tests small**: Each test should verify one specific behavior
- **Test input/output**: Focus on request inputs and response outputs
- **Avoid over-engineering**: Simple, readable tests are preferred over complex test setups

## Technical Implementation

### Test Framework
- **Runtime**: Bun with built-in test runner
- **Test API**: `bun:test` module (Jest-like API)
- **Framework**: Elysia.js for HTTP request simulation

### Request Handling
Tests use Elysia's `handle()` method which accepts a Web Standard `Request` and returns a `Response`:

```typescript
import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";

describe("Feature", () => {
   it("should return expected response", async () => {
      const app = new Elysia().get("/endpoint", () => ({ data: "value" }));

      const response = await app.handle(new Request("http://localhost/endpoint"));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ data: "value" });
   });
});
```

### URL Requirements
**Important**: Request URLs must be fully qualified, not partial paths:

| URL                   | Valid |
| --------------------- | ----- |
| `http://localhost/user` | ✅    |
| `/user`                 | ❌    |

### Database Access
Import and use the Prisma singleton directly:

```typescript
import prisma from "@beroboard/db";

// Use prisma directly in tests - no mocking
const user = await prisma.user.create({ data: { ... } });
```

### User Authentication
**Never mock user authentication or authorization**. Instead, use the global test authentication setup from `apps/server/src/modules/auth/auth.test.ts` which creates real users through better-auth endpoints.

The global setup provides:
- `testAuth`: A Promise that automatically initializes when first accessed - **recommended for most tests**
- `getTestAuth()`: Function that returns the singleton test user (backward compatible)
- `createAdditionalTestUser()`: Creates additional users for testing multi-user scenarios

**Important**: Always use the app instance exported from `apps/server/src/index.ts` which includes all routes and middleware configured for the application.

#### Recommended Pattern: Using `testAuth` Promise

The `testAuth` export is automatically initialized when first accessed, so you don't need to call any setup function:

```typescript
import { testAuth, createAdditionalTestUser } from "@/modules/auth/auth.test";
import { app } from "@/index";

// Use the exported app instance from index.ts - it includes all routes and auth endpoints

describe("Protected Endpoint", () => {
   it("should access protected route with authenticated user", async () => {
      // Just await testAuth - it's automatically initialized!
      const auth = await testAuth;

      const response = await app.handle(
         new Request("http://localhost/protected", {
            headers: {
               cookie: auth.sessionCookie,
            },
         })
      );

      expect(response.status).toBe(200);
   });

   it("should return 403 when user lacks permission", async () => {
      // Create an additional user for testing authorization
      const otherUserCookie = await createAdditionalTestUser(
         `other-${Date.now()}@example.com`,
         "password123",
         "Other User"
      );

      const response = await app.handle(
         new Request("http://localhost/protected", {
            headers: {
               cookie: otherUserCookie,
            },
         })
      );

      expect(response.status).toBe(403);
   });
});
```

#### Alternative Pattern: Using `getTestAuth()` in beforeEach

You can also use `getTestAuth()` in `beforeEach` hooks if you prefer:

```typescript
import { getTestAuth, createAdditionalTestUser } from "@/modules/auth/auth.test";
import { app } from "@/index";

describe("Protected Endpoint", () => {
   let auth: Awaited<ReturnType<typeof getTestAuth>>;

   beforeEach(async () => {
      // Get or create the global test user (created only once)
      auth = await getTestAuth();
   });

   it("should access protected route with authenticated user", async () => {
      const response = await app.handle(
         new Request("http://localhost/protected", {
            headers: {
               cookie: auth.sessionCookie,
            },
         })
      );

      expect(response.status).toBe(200);
   });
});
```

**Important**: 
- **Use the exported app from `@/index`**: Always import `{ app }` from `apps/server/src/index.ts` - it includes all routes, middleware, and auth endpoints configured for the application
- **Prefer `testAuth` promise**: It's automatically initialized when first accessed, no setup needed
- The test user is created only once and reused across all tests (singleton pattern)
- Always creates real users through `/api/auth/sign-up/email` and `/api/auth/sign-in/email` endpoints
- Never mock `auth.api.getSession()` or any authentication methods
- Use `createAdditionalTestUser()` when you need multiple users for authorization testing

## Test Structure

### Basic Test Pattern

```typescript
import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import prisma from "@beroboard/db";
import { app } from "@/index";

describe("Feature Name", () => {
   beforeEach(async () => {
      // Setup: Create test data in database
      await prisma.model.create({ data: { ... } });
   });

   afterEach(async () => {
      // Cleanup: Remove test data
      await prisma.model.deleteMany({});
   });

   it("should return 200 with valid data", async () => {
      const response = await app.handle(
         new Request("http://localhost/endpoint")
      );
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("expectedField");
   });

   it("should return 404 when resource not found", async () => {
      const response = await app.handle(
         new Request("http://localhost/endpoint/999")
      );
      
      expect(response.status).toBe(404);
   });

   it("should return 400 with invalid input", async () => {
      const response = await app.handle(
         new Request("http://localhost/endpoint", {
            method: "POST",
            body: JSON.stringify({ invalid: "data" }),
            headers: { "Content-Type": "application/json" },
         })
      );
      
      expect(response.status).toBe(400);
   });
});
```

## Coverage Requirements

### HTTP Response Scenarios
For each endpoint, test all possible HTTP responses:

1. **Success cases** (200, 201, 204,...):
   - Valid requests return expected data
   - Response body matches expected structure

2. **Client errors** (400, 401, 403, 404):
   - Invalid input validation (400)
   - Unauthorized access (401)
   - Forbidden access (403)
   - Resource not found (404)

3. **Response format**:
   - JSON structure matches API contract
   - Error messages are user-friendly

### Example: Complete Endpoint Coverage

```typescript
import { describe, expect, it } from "bun:test";
import prisma from "@beroboard/db";
import { app } from "@/index";
import { createAdditionalTestUser } from "@/modules/auth/auth.test";

describe("GET /projects/:id", () => {
   it("should return 200 with project data when project exists", async () => {
      // Setup: Create project in database
      const project = await prisma.project.create({ data: { ... } });
      
      const response = await app.handle(
         new Request(`http://localhost/projects/${project.id}`)
      );
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("id", project.id);
   });

   it("should return 404 when project does not exist", async () => {
      const response = await app.handle(
         new Request("http://localhost/projects/999")
      );
      
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toHaveProperty("message");
   });

   it("should return 401 when user is not authenticated", async () => {
      // No auth headers
      const response = await app.handle(
         new Request("http://localhost/projects/1")
      );
      
      expect(response.status).toBe(401);
   });

   it("should return 403 when user lacks permission", async () => {
      // Setup: Create real user through better-auth, but without project access
      const { createAdditionalTestUser } = await import("@/modules/auth/auth.test");
      const unauthorizedCookie = await createAdditionalTestUser(
         `unauthorized-${Date.now()}@example.com`,
         "password123",
         "Unauthorized User"
      );
      
      const response = await app.handle(
         new Request("http://localhost/projects/1", {
            headers: { cookie: unauthorizedCookie },
         })
      );
      
      expect(response.status).toBe(403);
   });
});
```

## What NOT to Test

Do not write tests for:

- ❌ Database connection failures
- ❌ Prisma query errors (network issues, timeouts)
- ❌ External service failures
- ❌ Server infrastructure errors
- ❌ Internal implementation details
- ❌ Edge cases outside normal user flows

## What NOT to Mock

Do not mock the following:

- ❌ **User authentication**: Never mock `auth.api.getSession()` or any authentication methods
- ❌ **User authorization**: Never mock user roles or permissions
- ❌ **Database operations**: Never mock Prisma client methods
- ❌ **Better-auth endpoints**: Always use real `/api/auth/*` endpoints to create users and sessions

Instead, create real users through better-auth sign-up/sign-in endpoints and use the actual session cookies in your test requests.

## Best Practices

1. **Database Cleanup**: Always clean up test data in `afterEach` or `afterAll` hooks
2. **Test Isolation**: Each test should be independent and not rely on other tests
3. **Descriptive Names**: Test names should clearly describe what is being tested
4. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification phases
5. **Minimal Setup**: Only create the minimum data needed for each test

## Running Tests

```bash
# Run all tests
bun test:integration

# Run tests in specific directory
docker-compose -f docker-compose.development.yaml up -d \
  && until [ \"$(docker inspect -f '{{.State.Health.Status}}' beroboard-db-1)\" = \"healthy\" ]; do echo \"⏳ Aguardando DB...\"; sleep 1; done \
  && turbo -F @beroboard/db db:migrate \
  && bun test app/server \
  ; docker-compose -f docker-compose.development.yaml down

# Run specific test file
docker-compose -f docker-compose.development.yaml up -d \
  && until [ \"$(docker inspect -f '{{.State.Health.Status}}' beroboard-db-1)\" = \"healthy\" ]; do echo \"⏳ Aguardando DB...\"; sleep 1; done \
  && turbo -F @beroboard/db db:migrate \
  && bun test apps/server/src/modules/feature/feature.test.ts \
  ; docker-compose -f docker-compose.development.yaml down
```

Tests are automatically run on pre-commit via Husky hook (see `.husky/pre-commit`).

## Reference

For Elysia testing patterns, see: https://elysiajs.com/patterns/unit-test.md

