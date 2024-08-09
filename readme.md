# Project ERD Documentation

This document provides an Entity Relationship Diagram (ERD) for the project. The ERD visually represents the relationships between different entities in the database schema.

## ERD Diagram

```mermaid
erDiagram
    USER {
        String id
        String name
        String email
        String password
    }
    PROFILE {
        String id
        String userId
        String identityType
        String identityNumber
        String address
    }
    BANKACCOUNT {
        String id
        String userId
        String bankName
        String bankAccountNumber
        Float balance
    }
    TRANSACTION {
        String id
        String sourceAccountId
        String destinationAccountId
        Float amount
    }
    WITHDRAWAL {
        String id
        String accountId
        Float amount
        DateTime createdAt
    }
    DEPOSIT {
        String id
        String accountId
        Float amount
        DateTime createdAt
    }

    USER ||--o| PROFILE : has
    USER ||--o{ BANKACCOUNT : owns
    BANKACCOUNT ||--o{ TRANSACTION : source
    BANKACCOUNT ||--o{ TRANSACTION : destination
    BANKACCOUNT ||--o{ WITHDRAWAL : has
    BANKACCOUNT ||--o{ DEPOSIT : has
    PROFILE ||--o| USER : belongs_to
    TRANSACTION ||--o| BANKACCOUNT : sourceAccount
    TRANSACTION ||--o| BANKACCOUNT : destAccount
    WITHDRAWAL ||--o| BANKACCOUNT : belongs_to
    DEPOSIT ||--o| BANKACCOUNT : belongs_to
```
