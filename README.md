# VisionRoot – Service Request Management System

<p align="center">
  <strong>A Full-Stack Service Request Management Platform</strong>
  <br />
  Software Engineering Intern Technical Assignment
  <br />
  <strong>VisionRoot (Pvt) Ltd</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Language-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

<p align="center">
  <a href="docs/api-documentation.md">API Documentation</a> •
  <a href="docs/database-schema.md">Database Schema</a> •
  <a href="#installation-and-setup">Installation Guide</a>
</p>

---

## Application Preview

<p align="center">
  <img src="docs/screenshots/user-dashboard.png" alt="VisionRoot User Dashboard" width="90%" />
</p>

<p align="center">
  <em>A centralized platform for submitting, tracking, and managing customer service requests.</em>
</p>

## About the Project

VisionRoot Service Request Management System is a full-stack web application designed to streamline customer service request management.

Customers can register, submit service requests, track progress, manage eligible requests, and communicate with the support team. Administrators can manage requests across users, monitor service activities, update request statuses, and respond to support tickets.

### Key Highlights

- **User Management** – Registration, authentication, profile management, and role-based access.
- **Service Requests** – Create, view, edit, cancel, and track service requests.
- **Admin Dashboard** – Centralized request management with search, filtering, sorting, and pagination.
- **Support Centre** – Customer support tickets and two-way communication.
- **User Preferences** – Profile and application preference management.
- **Security** – Protected API endpoints, validation, authentication, and authorization.
- **Automated Testing** – Backend unit and integration test coverage.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB, Mongoose |
| Authentication | JWT, HTTP-only Cookies |
| Testing | Jest, Supertest |
| Styling | Tailwind CSS |

## Screenshots

### User Interface

| Login | User Dashboard |
|---|---|
| ![Login](docs/screenshots/login.png) | ![User Dashboard](docs/screenshots/user-dashboard.png) |

| Create Request | Request Details |
|---|---|
| ![Create Request](docs/screenshots/create-request.png) | ![Request Details](docs/screenshots/request-details.png) |

### Administration and Support

| Admin Dashboard | Support Centre |
|---|---|
| ![Admin Dashboard](docs/screenshots/admin-dashboard.png) | ![Support Centre](docs/screenshots/support-centre.png) |

### User Preferences

<p align="center">
  <img src="docs/screenshots/preferences.png" alt="User Preferences" width="85%" />
</p>

---




## Table of Contents



1. Project Overview

2. Project Objectives

3. Features and Functionalities

4. Technology Stack

5. System Architecture

6. Project Directory Structure

7. Database Design

8. Business Rules

9. Authentication and Authorization

10. REST API Documentation

11. Environment Configuration

12. Installation and Setup

13. Running the Application

14. Testing and Verification

15. Security Implementation

16. Error Handling and Validation

17. Frontend Application

18. Production Build

19. Known Limitations and Future Improvements

20. Developer Information



---



# 1. Project Overview



The **VisionRoot Service Request Management System** is a full-stack web application developed to simplify the process of submitting, tracking, and managing customer service requests.



The application provides a centralized platform where customers can create service requests, monitor their progress, and manage eligible requests. Administrators can access a dedicated dashboard to review requests submitted by all users, search and filter records, and manage request statuses.



The application supports two primary roles:



- **USER:** Can register, log in, submit service requests, view personal request history, edit pending requests, and cancel or delete eligible requests.

- **ADMIN:** Can access the administration dashboard, view requests from all users, search and filter requests, and manage request statuses according to defined business rules.



The frontend is developed using React and TypeScript. The backend uses Node.js, Express, and TypeScript, with MongoDB for persistent data storage.



The system follows a modular frontend structure and a layered backend architecture to support maintainability, security, and separation of responsibilities.



## Project Information



| Property | Description |

|---|---|

| Project Name | VisionRoot Service Request Management System |

| Organization | VisionRoot (Pvt) Ltd |

| Project Type | Full-Stack Web Application |

| Frontend | React + TypeScript |

| Backend | Node.js + Express + TypeScript |

| Database | MongoDB |

| Database ODM | Mongoose |

| Architecture | Client-Server Architecture |

| API Style | RESTful API |

| Authentication | JWT with HTTP-only Cookies |

| User Roles | USER, ADMIN |



---



# 2. Project Objectives



The primary objectives are:



- Develop a user-friendly service request management platform.

- Allow customers to submit and track service requests.

- Provide administrators with centralized request management functionality.

- Implement secure user authentication.

- Enforce role-based access control.

- Protect request ownership and prevent unauthorized access.

- Implement controlled request status transitions.

- Support searching, filtering, sorting, and pagination.

- Validate user input on both frontend and backend.

- Maintain a modular and maintainable codebase.

- Provide automated backend tests and reliable API responses.



---



# 3. Features and Functionalities



## 3.1 User Authentication



- User registration.

- User login.

- User logout.

- Current authenticated user retrieval.

- Password hashing.

- JWT-based authentication.

- HTTP-only authentication cookies.

- Session invalidation after logout.

- Protected frontend routes.



## 3.2 Service Request Management



Authenticated users can:



- Create new service requests.

- View their own submitted requests.

- View individual request details.

- Edit their own pending requests.

- Cancel their own pending requests.

- Delete their own pending requests.

- Search their request history.

- Filter requests by status.

- Navigate through paginated results.



### Service Request Information



| Field | Description |

|---|---|

| Title | Short description of the issue |

| Description | Detailed explanation of the issue |

| Category | Type of service request |

| Priority | Request priority |

| Status | Current request status |

| Created At | Request creation timestamp |

| Updated At | Last modification timestamp |



### Available Categories



- `TECHNICAL\_SUPPORT`

- `BILLING`

- `ACCOUNT`

- `GENERAL`



### Available Priorities



- `LOW`

- `MEDIUM`

- `HIGH`



### Available Statuses



- `PENDING`

- `IN\_PROGRESS`

- `RESOLVED`

- `CANCELLED`



## 3.3 Administrator Dashboard



Administrators have access to a dedicated administration dashboard.



Features include:



- View service requests submitted by all users.

- View total matching request count.

- View request status summaries for the current page.

- Search requests by title and description.

- Filter requests by status.

- Filter requests by category.

- Filter requests by priority.

- View individual request details.

- Update request statuses according to business rules.

- Navigate through paginated results.

- Refresh request information.



## 3.4 User Interface



- Dedicated login and registration pages.

- User request dashboard.

- Service request creation form.

- Service request editing form.

- Individual request details page.

- Administrator dashboard.

- Form validation and error messages.

- Loading indicators.

- Empty-state messages.

- Request status indicators.

- Responsive layouts.



---



# 4. Technology Stack



## 4.1 Frontend Technologies



| Technology | Purpose |

|---|---|

| React | Component-based user interface |

| TypeScript | Static typing |

| Vite | Development server and build tooling |

| Tailwind CSS v4 | Utility-first CSS styling |

| React Router | Client-side routing |

| TanStack Query | Server-state management and caching |

| Axios | HTTP communication |

| React Hook Form | Form management |

| Zod | Schema validation |

| @hookform/resolvers | Form validation integration |

| Lucide React | Interface icons |



## 4.2 Backend Technologies



| Technology | Purpose |

|---|---|

| Node.js | JavaScript runtime |

| Express.js | Backend REST API framework |

| TypeScript | Static typing |

| MongoDB | NoSQL database |

| Mongoose | MongoDB object modeling |

| Zod | Request validation |

| JSON Web Token | Authentication token generation and verification |

| bcryptjs | Password hashing |

| Helmet | HTTP security headers |

| CORS | Cross-origin request configuration |

| cookie-parser | Cookie parsing |

| express-rate-limit | API rate limiting |

| dotenv | Environment configuration |



## 4.3 Testing Technologies



| Technology | Purpose |

|---|---|

| Jest | Automated testing framework |

| ts-jest | TypeScript integration with Jest |

| Supertest | HTTP API integration testing |



---



# 5. System Architecture



The application follows a client-server architecture.



## 5.1 High-Level Architecture



```text

+--------------------------------+

|          FRONTEND              |

|                                |

|       React + TypeScript       |

|                                |

|  Pages and Components          |

|  React Router                  |

|  TanStack Query                |

|  Axios API Client              |

+---------------+----------------+

               |

               | HTTP / JSON

               | HTTP-only Cookie

               |

+---------------v----------------+

|           BACKEND              |

|                                |

|       Node.js + Express        |

|          TypeScript            |

|                                |

|  Routes                        |

|     |                          |

|  Middleware                    |

|     |                          |

|  Controllers                   |

|     |                          |

|  Services                      |

|     |                          |

|  Repositories                  |

|     |                          |

|  Mongoose Models               |

+---------------+----------------+

               |

               | Database Operations

               |

+---------------v----------------+

|            DATABASE            |

|                                |

|             MongoDB            |

|                                |

|  Users                         |

|  Service Requests              |

+--------------------------------+

```



## 5.2 Frontend Architecture



The frontend is organized by application features.



**Features:** Contains the main application modules, including authentication, service requests, and administration.



**Pages:** Route-level screens such as login, registration, request history, request details, and the administration dashboard.



**Components:** Reusable interface components and layout elements.



**Services:** Handle communication with backend API endpoints.



**Hooks:** Provide reusable data-fetching and mutation logic using TanStack Query.



**Schemas:** Define form validation rules using Zod.



**Types:** Define TypeScript interfaces and application types.



**Lib:** Contains shared configuration such as the Axios API client and TanStack Query client.



**Routes:** Defines application routes and protected route behavior.



## 5.3 Backend Layered Architecture



The backend follows a layered architecture.



| Layer | Responsibility |

|---|---|

| Routes | Define API endpoints |

| Middleware | Handle authentication, authorization, and errors |

| Controllers | Handle HTTP requests and responses |

| Services | Implement application business rules |

| Repositories | Perform database operations |

| Models | Define MongoDB schemas |

| Validators | Validate request data using Zod |

| Config | Manage environment and database configuration |

| Utils | Provide reusable utility functions |



### Request Processing Flow



```text

Client Request

     |

     v

Express Router

     |

     v

Authentication Middleware

     |

     v

Controller

     |

     v

Zod Validation

     |

     v

Service Layer

     |

     v

Repository Layer

     |

     v

MongoDB

     |

     v

JSON Response

     |

     v

Frontend

```



This separation keeps business logic independent from HTTP handling and database implementation.



---



# 6. Project Directory Structure



```text

visionroot-software-engineering-assignment/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡

ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ client/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ public/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ src/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ assets/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ components/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ layout/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ ui/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ features/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ admin/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ components/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ hooks/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ pages/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ auth/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ components/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ hooks/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ pages/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ schemas/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ types/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ requests/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡       ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ hooks/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡       ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ pages/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡       ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ schemas/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡       ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ services.ts

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡       ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ types/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ hooks/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ lib/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ pages/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ routes/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ schemas/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ services/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ types/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ utils/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ App.tsx

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ index.css

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ main.tsx

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ .env.example

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ package.json

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ vite.config.ts

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡

ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ server/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ src/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ config/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ database.ts

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ env.ts

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ controllers/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ middleware/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ models/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ User.ts

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ ServiceRequest.ts

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ repositories/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ routes/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ scripts/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ services/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ types/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ utils/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ validators/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ app.ts

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ server.ts

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ tests/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ integration/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ unit/

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ .env.example

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ jest.config.ts

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ package.json

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡   ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ tsconfig.json

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬Å¡

ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ .env.example

ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ .gitignore

ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ package.json

ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ README.md

```



The actual `.env` files and `node\_modules` directories are excluded from version control.



---



# 7. Database Design



MongoDB is used as the primary database, with Mongoose providing schema definitions, validation, and database interaction.



The application uses two main collections:



1. `users`

2. `servicerequests`



## 7.1 User Collection



| Field | Data Type | Description |

|---|---|---|

| \_id | ObjectId | Unique user identifier |

| name | String | User's full name |

| email | String | Unique email address |

| password | String | Hashed password |

| role | String | USER or ADMIN |

| tokenVersion | Number | Used for session invalidation |

| createdAt | Date | Account creation timestamp |

| updatedAt | Date | Last update timestamp |



### User Constraints



- Name is required and must contain 2ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“80 characters.

- Email is required, unique, normalized to lowercase, and trimmed.

- Password is required and stored as a hash.

- Role is restricted to USER or ADMIN.

- New registrations receive the USER role by default.



## 7.2 Service Request Collection



| Field | Data Type | Description |

|---|---|---|

| \_id | ObjectId | Unique request identifier |

| user | ObjectId | Reference to the request owner |

| title | String | Request title |

| description | String | Detailed request description |

| category | String | Request category |

| priority | String | Request priority |

| status | String | Current request status |

| createdAt | Date | Creation timestamp |

| updatedAt | Date | Last update timestamp |



### Service Request Constraints



- Title is required and must contain 5ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“120 characters.

- Description is required and must contain 10ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“2000 characters.

- Category must be one of the supported categories.

- Priority must be LOW, MEDIUM, or HIGH.

- Status must be one of the supported statuses.

- Every request must belong to a valid user.



## 7.3 Entity Relationship



```text

+------------------------+

|          USER          |

+------------------------+

| \_id                    |

| name                   |

| email                  |

| password               |

| role                   |

| tokenVersion           |

| createdAt              |

| updatedAt              |

+------------------------+

           |

           | 1

           |

           | Has many

           |

           | N

+------------------------+

|    SERVICE REQUEST     |

+------------------------+

| \_id                    |

| user                   |

| title                  |

| description            |

| category               |

| priority               |

| status                 |

| createdAt              |

| updatedAt              |

+------------------------+

```



One user can create multiple service requests. Each service request belongs to one user through the `user` ObjectId reference.



## 7.4 Database Indexes



The service request model defines indexes to support common queries:



- User and creation date.

- Status and creation date.



The email field also has a unique constraint.



---




Detailed collection fields, relationships, constraints, and indexes are documented in [`docs/database-schema.md`](docs/database-schema.md).
# 8. Business Rules



## 8.1 User Permissions



A regular user:



- Can create service requests.

- Can retrieve only their own requests.

- Can edit only their own pending requests.

- Can cancel only their own pending requests.

- Can delete only their own pending requests.

- Cannot assign themselves the ADMIN role.

- Cannot update requests to arbitrary statuses.

- Cannot access administrator-only resources.



## 8.2 Administrator Permissions



An administrator:



- Can retrieve requests from all users.

- Can search and filter all accessible requests.

- Can view request details.

- Can update request statuses according to permitted transitions.

- Cannot change requests from final statuses to earlier statuses.



## 8.3 Request Status Lifecycle



```text

                +-----------+

                |  PENDING  |

                +-----------+

                   /     \\

                  /       \\

                 v         v

         +-------------+  +-------------+

         | IN\_PROGRESS |  |  CANCELLED  |

         +-------------+  +-------------+

              /    \\

             /      \\

            v        v

     +----------+  +-------------+

     | RESOLVED |  |  CANCELLED  |

     +----------+  +-------------+

```



### Allowed Status Transitions



| Current Status | Allowed Next Statuses |

|---|---|

| PENDING | IN\_PROGRESS, CANCELLED |

| IN\_PROGRESS | RESOLVED, CANCELLED |

| RESOLVED | None |

| CANCELLED | None |



`RESOLVED` and `CANCELLED` are final statuses.



The backend checks the current status before allowing a transition. Regular users can only cancel their own pending requests.



---



# 9. Authentication and Authorization



## 9.1 Registration Workflow



1. A user submits registration information.

2. The backend validates the data using Zod.

3. The email address is normalized.

4. The system checks whether the email already exists.

5. The password is hashed using bcryptjs.

6. The new user is created with the default USER role.

7. An authentication token is generated.

8. The token is returned through an HTTP-only cookie.



The registration endpoint does not allow users to select their own role.



## 9.2 Login Workflow



1. The user submits their email and password.

2. The backend validates the input.

3. The user account is retrieved from MongoDB.

4. bcryptjs compares the submitted password with the stored hash.

5. A JWT is generated after successful authentication.

6. The JWT is stored in an HTTP-only cookie.

7. The frontend retrieves the authenticated user information.



## 9.3 Authentication Middleware



Protected backend routes use authentication middleware.



The middleware:



- Reads the configured authentication cookie.

- Verifies the JWT.

- Validates the token payload.

- Checks the user identifier.

- Retrieves the corresponding account.

- Checks the stored token version.

- Attaches authenticated user information to the request.



## 9.4 Logout and Session Invalidation



When a user logs out:



1. The backend increments the user's token version.

2. The authentication cookie is cleared.

3. Previously issued tokens with an outdated token version are rejected.



This prevents previously issued sessions from remaining valid after logout.



## 9.5 Role-Based Access Control



The application supports two roles:



- USER

- ADMIN



Backend authorization and ownership checks are the primary security boundary. Frontend protected routes provide additional navigation-level protection.



---



# 10. REST API Documentation

Detailed endpoint descriptions, request examples, authentication, and response formats are available in [API Documentation](docs/api-documentation.md).

## 10.1 Base URL



Local development API:



```text

http://localhost:5000/api/v1

```



The API uses JSON request and response bodies. Authentication is maintained through an HTTP-only cookie.



## 10.2 Health Check



| Method | Endpoint | Access | Description |

|---|---|---|---|

| GET | /health | Public | Check API availability |



Example:



```http

GET /api/v1/health

```



## 10.3 Authentication Endpoints



| Method | Endpoint | Access | Description |

|---|---|---|---|

| POST | /auth/register | Public | Register a new user |

| POST | /auth/login | Public | Authenticate a user |

| POST | /auth/logout | Authenticated | Log out and invalidate sessions |

| GET | /auth/me | Authenticated | Retrieve current user information |



### Register



```http

POST /api/v1/auth/register

Content-Type: application/json

```



Example request:



```json

{

 "name": "Sample User",

 "email": "user@example.com",

 "password": "SecurePass123",

 "confirmPassword": "SecurePass123"

}

```



### Login



```http

POST /api/v1/auth/login

Content-Type: application/json

```



Example request:



```json

{

 "email": "user@example.com",

 "password": "SecurePass123"

}

```



### Logout



```http

POST /api/v1/auth/logout

```



Invalidates existing sessions and clears the authentication cookie.



### Current User



```http

GET /api/v1/auth/me

```



Returns information about the currently authenticated user.



## 10.4 Service Request Endpoints



| Method | Endpoint | Access | Description |

|---|---|---|---|

| POST | /requests | Authenticated | Create a service request |

| GET | /requests | Authenticated | Retrieve accessible requests |

| GET | /requests/:id | Authenticated | Retrieve request details |

| PATCH | /requests/:id | Authenticated | Update request information |

| PATCH | /requests/:id/status | Authenticated | Change request status |

| DELETE | /requests/:id | Authenticated | Delete a request |



Access restrictions depend on the authenticated user's role, ownership, and the current request status.



### Create a Request



```http

POST /api/v1/requests

Content-Type: application/json

```



Example request:



```json

{

 "title": "Unable to access project dashboard",

 "description": "I cannot access the service dashboard after signing in. Please check my account access.",

 "category": "TECHNICAL\_SUPPORT",

 "priority": "MEDIUM"

}

```



The new request receives the default `PENDING` status.



### Retrieve Requests



```http

GET /api/v1/requests

```



Supported query parameters:



| Parameter | Description |

|---|---|

| search | Search title and description |

| status | Filter by status |

| category | Filter by category |

| priority | Filter by priority |

| page | Page number |

| limit | Number of records per page |

| sortBy | createdAt, updatedAt, priority, or status |

| sortOrder | asc or desc |



Example:



```http

GET /api/v1/requests?status=PENDING\&page=1\&limit=10\&sortBy=createdAt\&sortOrder=desc

```



Regular users receive only their own requests. Administrators can retrieve requests from all users.



### Retrieve Request Details



```http

GET /api/v1/requests/:id

```



The backend checks whether the authenticated user is permitted to access the requested record.



### Update Request Information



```http

PATCH /api/v1/requests/:id

Content-Type: application/json

```



Example request:



```json

{

 "title": "Unable to access project dashboard - Updated",

 "priority": "HIGH"

}

```



Only permitted fields are accepted. Regular users can edit only their own pending requests.



### Update Request Status



```http

PATCH /api/v1/requests/:id/status

Content-Type: application/json

```



Example request:



```json

{

 "status": "IN\_PROGRESS"

}

```



The backend validates the user's permissions and the allowed status transition.



### Delete a Request



```http

DELETE /api/v1/requests/:id

```



Regular users can delete only their own pending requests.




## 10.5 Support Centre Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /support | USER | Create a support ticket |
| GET | /support | Authenticated | Retrieve accessible support tickets |
| GET | /support/:id | Authenticated | Retrieve ticket details |
| POST | /support/:id/replies | Authenticated | Add a reply to a ticket |
| PATCH | /support/:id/status | ADMIN | Update ticket status |

Regular users can access only their own support tickets. Administrators can view tickets across users.

Support ticket statuses include OPEN, IN_PROGRESS, WAITING_FOR_USER, RESOLVED, and CLOSED.

Replies are not accepted for CLOSED tickets. A user reply moves the ticket to IN_PROGRESS, while an administrator reply moves it to WAITING_FOR_USER.
## 10.6 Response Structure



The API uses a consistent JSON response structure.



Illustrative successful response:



```json

{

 "success": true,

 "message": "Operation completed successfully.",

 "data": {}

}

```



Illustrative error response:



```json

{

 "success": false,

 "message": "An error occurred."

}

```



Validation errors may also include an `errors` array.



---



# 11. Environment Configuration



The application uses environment variables to separate configuration from application source code.



## 11.1 Backend Environment Variables



Create a file named:



`server/.env`



Example:



```env

NODE\_ENV=development

PORT=5000

MONGODB\_URI=mongodb://127.0.0.1:27017/visionroot\_service\_requests

CLIENT\_URL=http://localhost:5173

JWT\_SECRET=replace\_with\_a\_long\_random\_secret\_at\_least\_32\_characters

JWT\_EXPIRES\_IN=1d

COOKIE\_NAME=visionroot\_token



ADMIN\_NAME=System Administrator

ADMIN\_EMAIL=admin@example.com

ADMIN\_PASSWORD=replace\_with\_a\_secure\_password\_at\_least\_12\_characters

```



| Variable | Description |

|---|---|

| NODE\_ENV | Application environment |

| PORT | Backend server port |

| MONGODB\_URI | MongoDB connection string |

| CLIENT\_URL | Frontend origin allowed by CORS |

| JWT\_SECRET | Secret used for JWT signing and verification |

| JWT\_EXPIRES\_IN | Token expiration duration |

| COOKIE\_NAME | Authentication cookie name |

| ADMIN\_NAME | Initial administrator name |

| ADMIN\_EMAIL | Initial administrator email |

| ADMIN\_PASSWORD | Initial administrator password |



Use your own MongoDB connection string and secure credentials.



For MongoDB Atlas, use the connection string provided by your Atlas cluster.



## 11.2 Frontend Environment Variables



Create:



`client/.env`



Example:



```env

VITE\_API\_URL=http://localhost:5000/api/v1

```



| Variable | Description |

|---|---|

| VITE\_API\_URL | Backend API base URL |



## 11.3 Environment Security



- Never commit actual `.env` files.

- Never publish database credentials.

- Never publish JWT secrets.

- Use strong administrator credentials.

- Configure production secrets through the deployment environment.

- Use `.env.example` files as configuration templates.



---



# 12. Installation and Setup



## 12.1 Prerequisites



Install the following:



- Node.js (v20 or later recommended).

- npm.

- Git.

- MongoDB or a MongoDB Atlas account.



## 12.2 Clone the Repository



```bash

git clone YOUR\_REPOSITORY\_URL

cd visionroot-software-engineering-assignment

```



Replace `YOUR\_REPOSITORY\_URL` with the actual repository URL.



## 12.3 Install Backend Dependencies



```bash

npm --prefix ./server install

```



## 12.4 Install Frontend Dependencies



```bash

npm --prefix ./client install

```



## 12.5 Configure Backend Environment



Create `server/.env` using `server/.env.example` as a reference.



Configure the MongoDB connection string, JWT secret, frontend URL, and administrator account details.



## 12.6 Configure Frontend Environment



Create `client/.env` using the example in Section 11.



## 12.7 Create the Administrator Account



After configuring the backend environment, execute:



```bash

npm --prefix ./server run seed:admin

```



The administrator seed script creates the configured administrator account or updates the existing account.



Use the configured administrator credentials to sign in.



---



# 13. Running the Application



The frontend and backend run as separate processes during development.



## 13.1 Start the Backend



Open a terminal at the project root:



```bash

npm --prefix ./server run dev

```



The backend runs at:



```text

http://localhost:5000

```



The server connects to MongoDB before accepting requests.



## 13.2 Start the Frontend



Open another terminal:



```bash

npm --prefix ./client run dev

```



The frontend runs at:



```text

http://localhost:5173

```



Open the frontend URL in a web browser.



## 13.3 Application Routes



| Route | Description | Access |

|---|---|---|

| /login | Login page | Public |

| /register | Registration page | Public |

| /requests | My service requests | USER |

| /requests/new | Create a service request | Authenticated |

| /requests/:id | Request details | Authorized user |

| /requests/:id/edit | Edit a pending request | Authorized user |

| /admin | Administrator dashboard | ADMIN |



The `/dashboard` route redirects authenticated users to `/requests`.



---



# 14. Testing and Verification



Testing was performed using automated backend tests, production build checks, and manual browser/API verification.



## 14.1 Automated Backend Tests



Testing tools:



- Jest

- ts-jest

- Supertest



Run the test suite:



```bash

npm --prefix ./server test

```



### Authentication Validator Tests



The following scenarios are covered:



- Valid registration input.

- Invalid email addresses.

- Weak password rejection.

- Password confirmation mismatch.

- Email normalization.

- Valid login input.

- Missing password validation.



### Service Request Validator Tests



The following scenarios are covered:



- Valid request creation.

- Default priority.

- Invalid category.

- Invalid priority.

- Empty update rejection.

- Valid request update.

- Valid request status.

- Invalid request status.

- Default pagination and sorting.

- Maximum pagination limit.



### Service Request Service Tests



The following scenarios are covered:



- User request listing restricted to owned records.

- Administrator listing across all users.

- Rejection of edits to non-pending user requests.

- Rejection of invalid status transitions.

- Rejection of user cancellation of in-progress requests.

- Successful cancellation of an owned pending request.

- Rejection of unauthorized resource access.

- Successful update of an owned pending request.

- Successful administrator status transition.




### Support Ticket Service Tests

The following scenarios are covered:

- User ticket listing restricted to owned records.
- Administrator listing without an owner restriction.
- Rejection of unauthorized ticket access.
- Rejection of replies to closed tickets.
- Successful user replies and automatic IN_PROGRESS status.
- Successful administrator replies and automatic WAITING_FOR_USER status.
- Not-found support ticket handling.
### API Integration Tests



The following scenarios are covered:



- Health endpoint.

- Unknown route handling.

- Invalid registration.

- Invalid login.

- Authentication requirement for current user.

- Authentication requirement for request listing.

- Authentication requirement for request creation.



## 14.2 Latest Automated Test Results



| Metric | Result |

|---|---:|

| Test Suites Passed | 5 |

| Total Test Suites | 5 |

| Tests Passed | 45 |

| Total Tests | 45 |

| Failed Tests | 0 |



All 45 automated backend tests passed in the latest verification run.



## 14.3 Manual API Verification



The following behaviors were manually verified:



- User registration and login.

- Administrator login.

- Logout and session invalidation.

- Duplicate registration rejection.

- Unauthorized access rejection.

- Request ownership restrictions.

- Request creation and retrieval.

- Request editing restrictions.

- User cancellation restrictions.

- Invalid status transition rejection.

- Administrator request listing.

- Search and filtering.

- Sorting and pagination.

- Invalid query and payload rejection.

- Health endpoint.

- Error and not-found responses.



## 14.4 Frontend Manual Verification



### User Workflow



- Registration.

- Login.

- Logout.

- Empty request history.

- Create a service request.

- View request details.

- Edit a pending request.

- Verify updated request information.

- Cancel a pending request.

- Verify the final CANCELLED status.



### Administrator Workflow



- Administrator login.

- View requests from all users.

- Search and filter requests.

- View request details.

- Change PENDING to IN\_PROGRESS.

- Change IN\_PROGRESS to RESOLVED.

- Verify dashboard count updates.

- Verify CANCELLED and RESOLVED records.

- Administrator logout.




### Support Centre Workflow

The following support ticket workflow was manually verified:

- User creates a support ticket.
- User views their ticket and conversation.
- Administrator views the submitted ticket.
- User and administrator exchange replies.
- Reply actions update the ticket status.
- Administrator changes the ticket to RESOLVED.
- Administrator changes the ticket to CLOSED.
- The saved ticket and conversation were checked in MongoDB Atlas.
### Authorization Workflow



- A regular user attempted to access `/admin`.

- The frontend redirected the user to `/requests`.

- Backend role and ownership restrictions were also manually verified.



## 14.5 Production Build Verification



Frontend:



```bash

npm --prefix ./client run build

```



Result: Successful.



Backend:



```bash

npm --prefix ./server run build

```



Result: Successful.



The frontend production build reports a JavaScript chunk-size warning, but the build completes successfully.



---



# 15. Security Implementation



The application includes the following security measures:



| Security Measure | Implementation |

|---|---|

| Password protection | bcryptjs password hashing |

| Authentication | JWT |

| Cookie security | HTTP-only authentication cookie |

| Session invalidation | Token version |

| Role authorization | Backend role checks |

| Resource ownership | User ID verification |

| Input validation | Zod |

| HTTP security headers | Helmet |

| Cross-origin control | CORS |

| API rate limiting | express-rate-limit |

| Request body limits | Express body size configuration |

| Error handling | Centralized error middleware |

| Secret management | Environment variables |



### Additional Security Details



- Registration does not accept a user-selected administrator role.

- Password hashes are excluded from normal user retrieval.

- Authentication cookies use secure settings in production.

- Invalid and expired authentication tokens are rejected.

- Unauthorized users cannot access other users' service requests.

- Final request statuses cannot be changed through invalid transitions.

- Backend authorization is enforced independently of frontend route protection.



---



# 16. Error Handling and Validation



Zod is used to validate registration, login, service request, status update, and query data.



The backend uses centralized error-handling middleware to return consistent responses.



### HTTP Status Codes



| Status Code | Meaning |

|---|---|

| 200 | Successful request |

| 201 | Resource created |

| 400 | Invalid input or business rule violation |

| 401 | Authentication required or invalid session |

| 403 | Insufficient permissions |

| 404 | Resource or route not found |

| 409 | Duplicate resource conflict |

| 500 | Unexpected server error |



Validation is applied to:



- Registration data.

- Login data.

- Service request creation.

- Service request updates.

- Request status updates.

- Search and filtering parameters.

- Pagination and sorting parameters.



The API returns structured JSON error messages and avoids exposing internal stack traces to clients.



---



# 17. Frontend Application



The application provides dedicated interfaces for regular users and administrators.



## 17.1 Authentication Pages



- Login page.

- Registration page.

- Password visibility controls.

- Form validation.

- API error feedback.



## 17.2 User Pages



**My Service Requests**



Displays the user's request history, status filters, request summaries, and request navigation.



**Create Service Request**



Allows users to submit new service requests with title, description, category, and priority.



**Request Details**



Displays request information, status, timestamps, and available actions.



**Edit Service Request**



Allows users to update their own pending requests.



## 17.3 Administrator Pages



**Administration Dashboard**



Displays request summaries, request records, search, filters, pagination, and status management controls.



## 17.4 Screenshots



Suggested screenshots for the submission:



| Screenshot | Suggested File |

|---|---|

| Login Page | `login.png` |

| Registration Page | `register.png` |

| User Dashboard | `user-dashboard.png` |

| Create Request Page | `create-request.png` |

| Request Details | `request-details.png` |

| Edit Request | `edit-request.png` |

| Administrator Dashboard | `admin-dashboard.png` |

| Administrator Status Update | `admin-status-update.png` |



Place actual screenshots in:



```text

docs/screenshots/

```



Screenshots should be added to the repository before submission. Do not leave broken image references or placeholder screenshots.



---



# 18. Production Build



The frontend and backend have separate production build commands.



## 18.1 Frontend Production Build



```bash

npm --prefix ./client run build

```



The frontend build performs TypeScript compilation and Vite production bundling.



Generated production files:



```text

client/dist/

```



## 18.2 Backend Production Build



```bash

npm --prefix ./server run build

```



The backend TypeScript compiler generates JavaScript output in:



```text

server/dist/

```



## 18.3 Start Backend Production Server



```bash

npm --prefix ./server start

```



Production deployment requires:



- A reachable MongoDB database.

- Correct production environment variables.

- A configured frontend origin.

- A secure JWT secret.

- Appropriate hosting and network configuration.



The application has been verified through local production builds. A deployed production URL is not currently included.



---



# 19. Known Limitations and Future Improvements



The following areas can be improved in future development.



1. Add interactive OpenAPI/Swagger API documentation.

2. Expand frontend automated testing using Vitest and React Testing Library.

3. Increase backend test coverage for controllers and repositories.

4. Implement email notifications when request statuses change.

5. Add dashboard charts and advanced analytics.

6. Improve advanced request reporting.

7. Optimize frontend bundle splitting and loading performance.

8. Add production deployment configuration.

9. Expand accessibility testing.

10. Improve application monitoring and logging.



These are potential future improvements and are not claimed as completed functionality.



---



# 20. Developer Information



| Property | Details |

|---|---|

| Developer | Shakila De Silva |

| Organization | VisionRoot (Pvt) Ltd |

| Assignment | Software Engineering Intern Technical Assignment |

| Project | Service Request Management System |

| Academic Background | Bachelor of Information Technology (Hons.) in Software Engineering |

| Institution | ESOFT University |



---



## Final Note



The VisionRoot Service Request Management System demonstrates full-stack application development, REST API design, database integration, authentication, authorization, input validation, business rule enforcement, automated testing, and technical documentation.



The application was developed with a focus on modular architecture, maintainable code organization, secure request handling, and a practical user experience.



---


