---
name: Testing
about: That`s need to test
title: "[ TESTING ]"
labels: testing
assignees: Kutsiy

---

## What needs to be tested?

Describe which module, service, resolver, controller, or feature needs test coverage.

Example:

* Auth module
* User module
* Refresh token flow
* GraphQL resolvers
* Exception filters
* Prisma repositories

## Why is this needed?

Explain the reason for adding tests.

Example:
The current code does not have enough automated test coverage, so regressions can happen after refactoring or adding new features.

## Test type

Select what kind of tests should be added:

* [ ] Unit tests
* [ ] Integration tests
* [ ] E2E tests
* [ ] GraphQL resolver tests
* [ ] Repository tests
* [ ] Service tests

## Test cases

List the main cases that should be covered.

Example:

* [ ] Successful operation
* [ ] Validation error
* [ ] Unauthorized request
* [ ] Not found case
* [ ] Conflict/duplicate case
* [ ] Database error handling
* [ ] Token expiration case

## Expected result

Describe what should be true after this issue is completed.

Example:

* Tests are added for the selected module or feature.
* Existing tests pass successfully.
* Test coverage is improved.
* Edge cases and error cases are covered.

## Additional context

Add any useful notes, related files, screenshots, logs, or links.
