# Database Schema Documentation

## 1. Database Overview

The application uses MongoDB with Mongoose ODM.

The main collections are:

- `users`
- `servicerequests`
- `supporttickets`

All three models use automatic `createdAt` and `updatedAt` timestamps. The Mongoose `__v` version field is disabled.

## 2. Users Collection

Collection: `users`

| Field | Type | Required | Description |
|---|---|---|---|
| _id | ObjectId | Yes | Unique user identifier |
| name | String | Yes | User's name (2–80 characters) |
| email | String | Yes | Unique, lowercase email address |
| password | String | Yes | Hashed password; excluded from normal queries |
| role | String | Yes | USER or ADMIN; defaults to USER |
| avatar | String / null | No | Avatar path or URL |
| preferences | Embedded document | Yes | User interface and notification preferences |
| tokenVersion | Number | Yes | Session invalidation version; defaults to 0 |
| createdAt | Date | Automatic | Creation timestamp |
| updatedAt | Date | Automatic | Last update timestamp |

### User Preferences

| Field | Type | Default |
|---|---|---|
| theme | String | light |
| density | String | comfortable |
| emailNotifications | Boolean | true |
| requestUpdates | Boolean | true |
| productAnnouncements | Boolean | false |
| reduceMotion | Boolean | false |

Allowed values:

- `role`: USER, ADMIN
- `theme`: light, dark
- `density`: comfortable, compact

The email field has a unique constraint. Password and tokenVersion fields are excluded from normal query results.

## 3. Service Requests Collection

Collection: `servicerequests`

| Field | Type | Required | Description |
|---|---|---|---|
| _id | ObjectId | Yes | Unique request identifier |
| user | ObjectId | Yes | Reference to the owning User |
| title | String | Yes | Request title (5–120 characters) |
| description | String | Yes | Request description (10–2,000 characters) |
| category | String | Yes | Request category |
| priority | String | Yes | Request priority; defaults to MEDIUM |
| status | String | Yes | Request status; defaults to PENDING |
| createdAt | Date | Automatic | Creation timestamp |
| updatedAt | Date | Automatic | Last update timestamp |

### Allowed Values

Categories:

- TECHNICAL_SUPPORT
- BILLING
- ACCOUNT
- GENERAL

Priorities:

- LOW
- MEDIUM
- HIGH

Statuses:

- PENDING
- IN_PROGRESS
- RESOLVED
- CANCELLED

## 4. Support Tickets Collection

Collection: `supporttickets`

| Field | Type | Required | Description |
|---|---|---|---|
| _id | ObjectId | Yes | Unique support ticket identifier |
| user | ObjectId | Yes | Reference to the ticket owner |
| subject | String | Yes | Ticket subject (5–120 characters) |
| message | String | Yes | Initial message (10–3,000 characters) |
| category | String | Yes | Support category |
| priority | String | Yes | Ticket priority; defaults to MEDIUM |
| status | String | Yes | Ticket status; defaults to OPEN |
| replies | Array | Yes | Conversation replies; defaults to an empty array |
| createdAt | Date | Automatic | Creation timestamp |
| updatedAt | Date | Automatic | Last update timestamp |

### Allowed Values

Categories:

- TECHNICAL
- ACCOUNT
- BILLING
- GENERAL

Priorities:

- LOW
- MEDIUM
- HIGH

Statuses:

- OPEN
- IN_PROGRESS
- WAITING_FOR_USER
- RESOLVED
- CLOSED

### Reply Subdocument

Each reply contains:

| Field | Type | Required | Description |
|---|---|---|---|
| _id | ObjectId | Automatic | Reply identifier |
| sender | ObjectId | Yes | Reference to the User who sent the reply |
| senderRole | String | Yes | USER or ADMIN |
| message | String | Yes | Reply content (1–3,000 characters) |
| createdAt | Date | Automatic | Reply timestamp |

## 5. Relationships

- One User can own multiple Service Requests.
- One User can create multiple Support Tickets.
- One Support Ticket can contain multiple replies.
- Each support reply references the User who sent it.
- Service Requests and Support Tickets reference their owner through ObjectId fields.

## 6. Database Indexes

### Users

- Unique index on `email`, created by the schema's unique constraint.

### Service Requests

- Index on `user` for ownership queries.
- Index on `status` for status-based queries.
- Compound index on `{ user: 1, createdAt: -1 }`.
- Compound index on `{ status: 1, createdAt: -1 }`.

### Support Tickets

- Index on `user` for ownership queries.
- Index on `status` for status-based queries.
- Compound index on `{ user: 1, createdAt: -1 }`.
- Compound index on `{ status: 1, priority: 1, createdAt: -1 }`.

## 7. Data Integrity and Access Control

- Mongoose schemas enforce required fields, field types, enums, defaults, and length constraints.
- User passwords and token versions are excluded from normal query results.
- Backend authorization restricts regular users to their own service requests and support tickets.
- Administrators can access records across users according to their role permissions.
- Business rules are enforced by the backend service layer in addition to frontend restrictions.

## 8. Notes

This document describes the Mongoose schemas implemented in the project. API-level validation and business rules may impose additional restrictions beyond the database schema.
