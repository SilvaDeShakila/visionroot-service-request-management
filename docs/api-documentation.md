# VisionRoot REST API Documentation

## 1. Overview

**Base URL:** `http://localhost:5000/api/v1`

The VisionRoot Service Request Management System provides a RESTful API built with Node.js, Express.js, TypeScript, and MongoDB.

### General Information

- **Request and response format:** JSON
- **Authentication:** JWT-based authentication using HTTP-only cookies
- **Authorization:** Role-based access control (RBAC)
- **Database:** MongoDB
- **API version:** v1

Protected endpoints require a valid authenticated session. Administrator-only operations require the `ADMIN` role.

---

## 2. Health Check API

**Endpoint:** `/health`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/health` | Public | Check API availability |

**Example:**

```http
GET /api/v1/health
```

---

## 3. Authentication API

**Base path:** `/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Sign in |
| POST | `/auth/logout` | Authenticated | Sign out |
| GET | `/auth/me` | Authenticated | Retrieve the current user |
| PUT | `/auth/profile` | Authenticated | Update user profile |
| POST | `/auth/avatar` | Authenticated | Upload a profile avatar |
| PUT | `/auth/avatar/preset` | Authenticated | Select a preset avatar |

### 3.1 User Registration

**Endpoint:** `POST /api/v1/auth/register`

**Request body:**

```json
{
  "name": "Sample User",
  "email": "user@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

Creates a new user account after validating the submitted information.

### 3.2 User Login

**Endpoint:** `POST /api/v1/auth/login`

**Request body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

Authenticates the user and establishes an authenticated session using an HTTP-only cookie.

### 3.3 User Logout

**Endpoint:** `POST /api/v1/auth/logout`

Invalidates the current authenticated session and clears the authentication cookie.

### 3.4 Retrieve Current User

**Endpoint:** `GET /api/v1/auth/me`

Returns the authenticated user's profile information.

### 3.5 Update Profile

**Endpoint:** `PUT /api/v1/auth/profile`

Updates the authenticated user's profile information.

### 3.6 Avatar Management

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/avatar` | Upload a profile avatar |
| PUT | `/api/v1/auth/avatar/preset` | Select a preset avatar |

Both operations require authentication.

### 3.7 Authentication Rate Limits

| Endpoint | Limit |
|---|---|
| Login | 10 attempts per 15 minutes |
| Registration | 5 attempts per 15 minutes |
| General API requests | 100 requests per 15 minutes in production; 1,000 in development |

---

## 4. Service Request API

**Base path:** `/requests`

All endpoints require authentication.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/requests` | Authenticated | Create a service request |
| GET | `/requests` | Authenticated | List accessible requests |
| GET | `/requests/:id` | Authenticated | Retrieve request details |
| PATCH | `/requests/:id` | Authenticated | Update a service request |
| PATCH | `/requests/:id/status` | Authenticated | Change request status |
| DELETE | `/requests/:id` | Authenticated | Delete an eligible request |

### 4.1 Create Service Request

**Endpoint:** `POST /api/v1/requests`

**Request body:**

```json
{
  "title": "Unable to access dashboard",
  "description": "I cannot access the service dashboard.",
  "category": "TECHNICAL_SUPPORT",
  "priority": "MEDIUM"
}
```

Creates a service request for the authenticated user.

### 4.2 List Service Requests

**Endpoint:** `GET /api/v1/requests`

Supported query parameters:

| Parameter | Description |
|---|---|
| `search` | Search requests |
| `status` | Filter by request status |
| `category` | Filter by request category |
| `priority` | Filter by priority |
| `page` | Page number |
| `limit` | Number of records per page |
| `sortBy` | Field used for sorting |
| `sortOrder` | Sorting order (`asc` or `desc`) |

**Example:**

```http
GET /api/v1/requests?status=PENDING&page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

### 4.3 Pagination

The service request list response includes pagination metadata.

**Example pagination object:**

```json
{
  "page": 1,
  "limit": 10,
  "total": 25,
  "totalPages": 3
}
```

The response contains the requested records together with pagination information.

### 4.4 Retrieve Request Details

**Endpoint:** `GET /api/v1/requests/:id`

Retrieves the details of a specific service request.

Regular users can retrieve their own requests. Administrators can access requests across users according to their permissions.

### 4.5 Update Service Request

**Endpoint:** `PATCH /api/v1/requests/:id`

**Request body example:**

```json
{
  "title": "Updated request title",
  "priority": "HIGH"
}
```

Regular users are permitted to edit their own requests while the request is in the `PENDING` status.

### 4.6 Change Request Status

**Endpoint:** `PATCH /api/v1/requests/:id/status`

**Request body:**

```json
{
  "status": "IN_PROGRESS"
}
```

Status changes are validated by the backend according to the permitted transition rules.

### 4.7 Delete Service Request

**Endpoint:** `DELETE /api/v1/requests/:id`

Deletes an eligible service request according to the authenticated user's permissions and the implemented business rules.

### 4.8 Request Status Transition Rules

| Current Status | Allowed Next Status |
|---|---|
| `PENDING` | `IN_PROGRESS`, `CANCELLED` |
| `IN_PROGRESS` | `RESOLVED`, `CANCELLED` |
| `RESOLVED` | No further transitions |
| `CANCELLED` | No further transitions |

Regular users can access their own service requests. Administrators can manage requests across users according to their permissions.

---

## 5. Support Centre API

**Base path:** `/support`

All endpoints require authentication.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/support` | USER | Create a support ticket |
| GET | `/support` | Authenticated | List accessible tickets |
| GET | `/support/:id` | Authenticated | Retrieve ticket details |
| POST | `/support/:id/replies` | Authenticated | Add a reply |
| PATCH | `/support/:id/status` | ADMIN | Update ticket status |

### 5.1 Create Support Ticket

**Endpoint:** `POST /api/v1/support`

**Request body:**

```json
{
  "subject": "Unable to access my account",
  "message": "I need assistance accessing my account.",
  "category": "ACCOUNT",
  "priority": "MEDIUM"
}
```

Creates a new support ticket for the authenticated user.

### 5.2 List Support Tickets

**Endpoint:** `GET /api/v1/support`

Returns support tickets accessible to the authenticated user.

Regular users can access their own tickets, while administrators can access tickets across users.

### 5.3 Retrieve Support Ticket Details

**Endpoint:** `GET /api/v1/support/:id`

Retrieves the details and conversation history of a specific support ticket, subject to access permissions.

### 5.4 Add Reply

**Endpoint:** `POST /api/v1/support/:id/replies`

**Request body:**

```json
{
  "message": "Thank you for the update."
}
```

Adds a reply to an existing support ticket.

Ticket status is updated according to the role of the user submitting the reply:

- User replies move the ticket to `IN_PROGRESS`.
- Administrator replies move the ticket to `WAITING_FOR_USER`.
- Replies to `CLOSED` tickets are rejected.

### 5.5 Update Ticket Status

**Endpoint:** `PATCH /api/v1/support/:id/status`

**Access:** ADMIN

**Request body:**

```json
{
  "status": "RESOLVED"
}
```

Allows administrators to update the status of a support ticket.

### 5.6 Support Ticket Statuses

| Status | Description |
|---|---|
| `OPEN` | Newly created support ticket |
| `IN_PROGRESS` | Support request is being handled |
| `WAITING_FOR_USER` | Waiting for a user response |
| `RESOLVED` | Issue has been resolved |
| `CLOSED` | Support ticket is closed |

---

## 6. User Preferences API

**Base path:** `/preferences`

All endpoints require authentication.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/preferences` | Authenticated | Retrieve user preferences |
| PATCH | `/preferences` | Authenticated | Update user preferences |

### 6.1 Retrieve Preferences

**Endpoint:** `GET /api/v1/preferences`

Returns the authenticated user's saved preferences.

### 6.2 Update Preferences

**Endpoint:** `PATCH /api/v1/preferences`

**Request body example:**

```json
{
  "theme": "dark",
  "density": "compact",
  "emailNotifications": true,
  "requestUpdates": true,
  "productAnnouncements": false,
  "reduceMotion": false
}
```

Updates the authenticated user's application preferences.

---

## 7. Admin User Management API

**Base path:** `/users`

All endpoints in this section require authentication and the `ADMIN` role.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | ADMIN | Retrieve the user list |
| PATCH | `/users/:id/role` | ADMIN | Update a user's role |

### 7.1 List Users

**Endpoint:** `GET /api/v1/users`

Returns the list of registered users.

**Example response:**

```json
{
  "success": true,
  "data": {
    "users": []
  }
}
```

### 7.2 Update User Role

**Endpoint:** `PATCH /api/v1/users/:id/role`

**Request body example:**

```json
{
  "role": "ADMIN"
}
```

The supported role values are:

- `USER`
- `ADMIN`

Administrators can manage user roles subject to the following restrictions:

- An administrator cannot demote their own account.
- The last remaining administrator cannot be demoted.

User role permissions are validated on the backend.

---

## 8. Authentication and Authorization

The API implements authentication and authorization controls to protect user accounts and application resources.

### Authentication

- Authentication uses JWT-based sessions stored in HTTP-only cookies.
- Protected endpoints require a valid authenticated session.
- Passwords are hashed before being stored in the database.
- Logout invalidates the current session.
- Authentication middleware verifies the user and session validity.

### Authorization

- Role-based access control distinguishes regular users and administrators.
- Regular users can access only their own service requests and support tickets.
- Administrator-only operations require the `ADMIN` role.
- User permissions and resource ownership are checked on the backend.
- Client-side role information is not trusted as the source of authorization.

---

## 9. Response Format

The API uses JSON for successful responses and errors.

### 9.1 Successful Response

Example:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

The response data depends on the requested endpoint.

### 9.2 Error Response

Example:

```json
{
  "success": false,
  "message": "An error occurred."
}
```

Validation errors may include additional details describing the invalid input.

### 9.3 Paginated Response

List endpoints that support pagination return records together with pagination metadata.

Service request pagination example:

```json
{
  "success": true,
  "data": {
    "requests": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

## 10. HTTP Status Codes

| Status Code | Meaning |
|---|---|
| `200` | Successful request |
| `201` | Resource created successfully |
| `400` | Invalid input or business rule violation |
| `401` | Authentication required or invalid |
| `403` | Insufficient permissions |
| `404` | Resource or endpoint not found |
| `500` | Internal server error |

---

## 11. Security

The API includes the following security measures:

- Helmet security middleware.
- CORS configured for the frontend origin with credentials.
- HTTP-only authentication cookies.
- Password hashing using bcrypt.
- Authentication and role-based authorization middleware.
- Server-side request validation.
- Resource ownership checks.
- Request body size limits.
- API rate limiting.
- Centralized error handling.
- Session invalidation during logout.
- Database-level validation and constraints.

---

## 12. Documentation Notes

- The base URL assumes the backend is running locally on port `5000`.
- All request and response examples are illustrative.
- Protected endpoints require authentication unless explicitly marked as public.
- Administrator endpoints require the `ADMIN` role.
- Actual validation rules and accepted field values are enforced by the backend validators and services.
- Response properties may vary depending on the endpoint.
- For deployment, configure the API URL, CORS origin, database connection, and authentication settings using environment variables.

