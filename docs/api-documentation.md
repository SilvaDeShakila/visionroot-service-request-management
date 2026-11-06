\# VisionRoot REST API Documentation



\## 1. Overview



\*\*Base URL:\*\* `http://localhost:5000/api/v1`



The VisionRoot Service Request Management System provides a RESTful API built with Node.js, Express.js, TypeScript, and MongoDB.



\- Request and response format: JSON

\- Authentication: HTTP-only cookie

\- Protected routes require authentication.

\- Role-based access control is applied to restricted operations.



\## 2. Health Check



| Method | Endpoint | Access | Description |

|---|---|---|---|

| GET | `/health` | Public | Check API availability |



\*\*Example:\*\* `GET /api/v1/health`



\## 3. Authentication API



Base path: `/auth`



| Method | Endpoint | Access | Description |

|---|---|---|---|

| POST | `/auth/register` | Public | Register a new user |

| POST | `/auth/login` | Public | Sign in |

| POST | `/auth/logout` | Authenticated | Sign out |

| GET | `/auth/me` | Authenticated | Retrieve current user |

| PUT | `/auth/profile` | Authenticated | Update profile |

| POST | `/auth/avatar` | Authenticated | Upload profile avatar |

| PUT | `/auth/avatar/preset` | Authenticated | Select preset avatar |



\### Registration



`POST /api/v1/auth/register`



```json

{

&#x20; "name": "Sample User",

&#x20; "email": "user@example.com",

&#x20; "password": "SecurePass123",

&#x20; "confirmPassword": "SecurePass123"

}

```



\### Login



`POST /api/v1/auth/login`



```json

{

&#x20; "email": "user@example.com",

&#x20; "password": "SecurePass123"

}

```



\### Rate Limiting



\- Login: 10 attempts per 15 minutes.

\- Registration: 5 attempts per 15 minutes.

\- General API requests: 100 requests per 15 minutes.



\## 4. Service Request API



Base path: `/requests`



All endpoints require authentication.



| Method | Endpoint | Access | Description |

|---|---|---|---|

| POST | `/requests` | Authenticated | Create a service request |

| GET | `/requests` | Authenticated | List accessible requests |

| GET | `/requests/:id` | Authenticated | Retrieve request details |

| PATCH | `/requests/:id` | Authenticated | Update request |

| PATCH | `/requests/:id/status` | Authenticated | Change request status |

| DELETE | `/requests/:id` | Authenticated | Delete an eligible request |



\### Create Request



`POST /api/v1/requests`



```json

{

&#x20; "title": "Unable to access dashboard",

&#x20; "description": "I cannot access the service dashboard.",

&#x20; "category": "TECHNICAL\_SUPPORT",

&#x20; "priority": "MEDIUM"

}

```



\### List Requests



`GET /api/v1/requests`



Supported query parameters:



| Parameter | Description |

|---|---|

| search | Search requests |

| status | Filter by status |

| category | Filter by category |

| priority | Filter by priority |

| page | Page number |

| limit | Number of records per page |

| sortBy | Sorting field |

| sortOrder | Ascending or descending order |



Example:



`GET /api/v1/requests?status=PENDING\&page=1\&limit=10\&sortBy=createdAt\&sortOrder=desc`



\### Update Request



`PATCH /api/v1/requests/:id`



```json

{

&#x20; "title": "Updated request title",

&#x20; "priority": "HIGH"

}

```



\### Change Request Status



`PATCH /api/v1/requests/:id/status`



```json

{

&#x20; "status": "IN\_PROGRESS"

}

```



\### Status Transition Rules



| Current Status | Allowed Next Status |

|---|---|

| PENDING | IN\_PROGRESS, CANCELLED |

| IN\_PROGRESS | RESOLVED, CANCELLED |

| RESOLVED | No further transitions |

| CANCELLED | No further transitions |



Regular users can access their own requests. Administrators can manage requests across users according to the implemented permissions.



\## 5. Support Centre API



Base path: `/support`



All endpoints require authentication.



| Method | Endpoint | Access | Description |

|---|---|---|---|

| POST | `/support` | USER | Create support ticket |

| GET | `/support` | Authenticated | List accessible tickets |

| GET | `/support/:id` | Authenticated | Retrieve ticket details |

| POST | `/support/:id/replies` | Authenticated | Add a reply |

| PATCH | `/support/:id/status` | ADMIN | Update ticket status |



\### Create Support Ticket



`POST /api/v1/support`



```json

{

&#x20; "subject": "Unable to access my account",

&#x20; "message": "I need assistance accessing my account.",

&#x20; "category": "ACCOUNT",

&#x20; "priority": "MEDIUM"

}

```



\### Add Reply



`POST /api/v1/support/:id/replies`



```json

{

&#x20; "message": "Thank you for the update."

}

```



\### Update Ticket Status



`PATCH /api/v1/support/:id/status`



```json

{

&#x20; "status": "RESOLVED"

}

```



\### Support Ticket Statuses



\- OPEN

\- IN\_PROGRESS

\- WAITING\_FOR\_USER

\- RESOLVED

\- CLOSED



User replies move tickets to IN\_PROGRESS. Administrator replies move tickets to WAITING\_FOR\_USER. Replies to CLOSED tickets are rejected.



Regular users can access only their own tickets. Administrators can access tickets across users.



\## 6. User Preferences API



Base path: `/preferences`



All endpoints require authentication.



| Method | Endpoint | Access | Description |

|---|---|---|---|

| GET | `/preferences` | Authenticated | Retrieve user preferences |

| PATCH | `/preferences` | Authenticated | Update user preferences |



Example update:



`PATCH /api/v1/preferences`



```json

{

&#x20; "theme": "dark",

&#x20; "density": "compact",

&#x20; "emailNotifications": true,

&#x20; "requestUpdates": true,

&#x20; "productAnnouncements": false,

&#x20; "reduceMotion": false

}

```



\## 7. Authentication and Authorization



\- Authentication is maintained using an HTTP-only cookie.

\- Protected routes require a valid authenticated session.

\- Regular users can access only their own service requests and support tickets.

\- Administrator-only operations require the ADMIN role.

\- Resource ownership and business rules are enforced by the backend.

\- Login and registration endpoints have additional rate limiting.



\## 8. Response Format



Successful response example:



```json

{

&#x20; "success": true,

&#x20; "message": "Operation completed successfully.",

&#x20; "data": {}

}

```



Error response example:



```json

{

&#x20; "success": false,

&#x20; "message": "An error occurred."

}

```



Validation errors may include additional error details.



\## 9. HTTP Status Codes



| Status Code | Meaning |

|---|---|

| 200 | Successful request |

| 201 | Resource created |

| 400 | Invalid input or business rule violation |

| 401 | Authentication required or invalid |

| 403 | Insufficient permissions |

| 404 | Resource or endpoint not found |

| 500 | Internal server error |



\## 10. Security



\- Helmet security middleware.

\- CORS configured for the frontend origin with credentials.

\- HTTP-only authentication cookies.

\- Authentication and role-based authorization middleware.

\- Request body size limits.

\- API rate limiting.

\- Server-side validation and centralized error handling.



\---



\*\*Documentation Note:\*\* Request fields and examples are illustrative. Refer to the backend validators and controllers for exact validation rules and response details.

