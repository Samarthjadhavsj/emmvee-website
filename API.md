# Emmvee Careers Platform - API Documentation

Base URL (Development): `http://localhost:8080/api`
Base URL (Production): `https://your-api-domain.com/api`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Access**: Public

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Validation**:
- `name`: Required, not blank
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters

**Response** (201 Created):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}
```

**Error Responses**:
- 400 Bad Request: Validation errors or email already registered
- 500 Internal Server Error: Server error

---

#### POST `/api/auth/login`
Login to get JWT token.

**Access**: Public

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}
```

**Error Responses**:
- 400 Bad Request: Invalid credentials
- 500 Internal Server Error: Server error

---

### 2. Jobs/Careers Endpoints

#### GET `/api/careers/jobs`
Get list of jobs with pagination, filtering, and sorting.

**Access**: Public

**Query Parameters**:
- `search` (optional): Search in job title
- `department` (optional): Filter by department
- `location` (optional): Filter by location
- `employmentType` (optional): Filter by employment type
- `page` (optional, default: 0): Page number
- `size` (optional, default: 10): Page size
- `sortBy` (optional, default: "id"): Sort field (id, title, location, department, employmentType)
- `direction` (optional, default: "asc"): Sort direction (asc, desc)

**Example Request**:
```
GET /api/careers/jobs?search=engineer&department=Engineering&page=0&size=10&sortBy=title&direction=asc
```

**Response** (200 OK):
```json
{
  "content": [
    {
      "id": 1,
      "title": "Software Engineer",
      "location": "Bengaluru",
      "department": "Engineering",
      "employmentType": "Full Time"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "number": 0,
  "size": 10,
  "first": true,
  "last": true
}
```

---

#### GET `/api/careers/jobs/{id}`
Get job details by ID.

**Access**: Public

**Path Parameters**:
- `id`: Job ID

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Software Engineer",
  "location": "Bengaluru",
  "department": "Engineering",
  "employmentType": "Full Time"
}
```

**Error Responses**:
- 404 Not Found: Job not found

---

#### POST `/api/careers/jobs`
Create a new job posting.

**Access**: ADMIN only

**Authentication**: Required (JWT token with ADMIN role)

**Request Body**:
```json
{
  "title": "Senior Software Engineer",
  "location": "Bengaluru",
  "department": "Engineering",
  "employmentType": "Full Time"
}
```

**Validation**:
- All fields are required and must not be blank

**Response** (200 OK):
```json
{
  "id": 2,
  "title": "Senior Software Engineer",
  "location": "Bengaluru",
  "department": "Engineering",
  "employmentType": "Full Time"
}
```

**Error Responses**:
- 401 Unauthorized: Missing or invalid JWT token
- 403 Forbidden: User is not an admin
- 400 Bad Request: Validation errors

---

#### PUT `/api/careers/jobs/{id}`
Update an existing job.

**Access**: ADMIN only

**Authentication**: Required (JWT token with ADMIN role)

**Path Parameters**:
- `id`: Job ID

**Request Body**: Same as POST `/api/careers/jobs`

**Response** (200 OK): Same as POST `/api/careers/jobs`

**Error Responses**:
- 401 Unauthorized: Missing or invalid JWT token
- 403 Forbidden: User is not an admin
- 404 Not Found: Job not found
- 400 Bad Request: Validation errors

---

#### DELETE `/api/careers/jobs/{id}`
Delete a job posting.

**Access**: ADMIN only

**Authentication**: Required (JWT token with ADMIN role)

**Path Parameters**:
- `id`: Job ID

**Response** (200 OK):
```
Job deleted successfully
```

**Error Responses**:
- 401 Unauthorized: Missing or invalid JWT token
- 403 Forbidden: User is not an admin
- 404 Not Found: Job not found

---

### 3. User Endpoints

#### GET `/api/user/profile`
Get authenticated user's profile.

**Access**: Authenticated users only

**Authentication**: Required (JWT token)

**Response** (200 OK):
```
Authenticated user: john@example.com
```

**Error Responses**:
- 401 Unauthorized: Missing or invalid JWT token

---

### 4. Application Endpoints

#### POST `/api/applications`
Submit a job application.

**Access**: Authenticated users only

**Authentication**: Required (JWT token)

**Request Body**:
```json
{
  "jobId": 1,
  "resumeUrl": "https://example.com/resume.pdf",
  "coverLetter": "I am interested in this position..."
}
```

**Validation**:
- `jobId`: Required
- `resumeUrl`: Required, not blank
- `coverLetter`: Required, not blank

**Response** (200 OK):
```json
{
  "id": 1,
  "userId": 1,
  "userName": "John Doe",
  "jobId": 1,
  "jobTitle": "Software Engineer",
  "resumeUrl": "https://example.com/resume.pdf",
  "coverLetter": "I am interested in this position...",
  "status": "APPLIED",
  "appliedAt": "2026-08-21T12:00:00"
}
```

**Error Responses**:
- 401 Unauthorized: Missing or invalid JWT token
- 400 Bad Request: Validation errors, job not found, or already applied
- 404 Not Found: Job not found

---

#### GET `/api/applications/my`
Get all applications submitted by the authenticated user.

**Access**: Authenticated users only

**Authentication**: Required (JWT token)

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "userId": 1,
    "userName": "John Doe",
    "jobId": 1,
    "jobTitle": "Software Engineer",
    "resumeUrl": "https://example.com/resume.pdf",
    "coverLetter": "I am interested in this position...",
    "status": "APPLIED",
    "appliedAt": "2026-08-21T12:00:00"
  }
]
```

**Error Responses**:
- 401 Unauthorized: Missing or invalid JWT token

---

### 5. Admin Application Endpoints

#### GET `/api/admin/applications`
Get all applications (admin only).

**Access**: ADMIN only

**Authentication**: Required (JWT token with ADMIN role)

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "userId": 1,
    "userName": "John Doe",
    "jobId": 1,
    "jobTitle": "Software Engineer",
    "resumeUrl": "https://example.com/resume.pdf",
    "coverLetter": "I am interested in this position...",
    "status": "APPLIED",
    "appliedAt": "2026-08-21T12:00:00"
  }
]
```

**Error Responses**:
- 401 Unauthorized: Missing or invalid JWT token
- 403 Forbidden: User is not an admin

---

#### PUT `/api/admin/applications/{id}/status`
Update application status (admin only).

**Access**: ADMIN only

**Authentication**: Required (JWT token with ADMIN role)

**Path Parameters**:
- `id`: Application ID

**Request Body**:
```json
{
  "status": "SHORTLISTED"
}
```

**Valid Status Values**:
- `APPLIED`
- `REVIEWING`
- `SHORTLISTED`
- `REJECTED`
- `HIRED`

**Response** (200 OK):
```json
{
  "id": 1,
  "userId": 1,
  "userName": "John Doe",
  "jobId": 1,
  "jobTitle": "Software Engineer",
  "resumeUrl": "https://example.com/resume.pdf",
  "coverLetter": "I am interested in this position...",
  "status": "SHORTLISTED",
  "appliedAt": "2026-08-21T12:00:00"
}
```

**Error Responses**:
- 401 Unauthorized: Missing or invalid JWT token
- 403 Forbidden: User is not an admin
- 400 Bad Request: Invalid status or application not found
- 404 Not Found: Application not found

---

### 6. Actuator Endpoints

#### GET `/actuator/health`
Get application health status.

**Access**: Public

**Response** (200 OK):
```json
{
  "status": "UP"
}
```

---

#### GET `/actuator/info`
Get application information.

**Access**: Public

**Response** (200 OK):
```json
{
  "app": {
    "name": "Emmvee Careers Backend",
    "version": "1.0",
    "description": "Careers management backend"
  }
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

For validation errors:

```json
{
  "fieldName": "Error message",
  "anotherField": "Another error message"
}
```

---

## HTTP Status Codes

- `200 OK`: Successful GET, PUT, DELETE
- `201 Created`: Successful POST for creation
- `400 Bad Request`: Validation errors or invalid request
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: Authenticated but not authorized (wrong role)
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## CORS Configuration

The backend supports CORS for configured frontend origins. In production, ensure the `CORS_ALLOWED_ORIGINS` environment variable is set to your frontend domain.

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting in production.

## Security Notes

1. JWT tokens expire after 1 hour by default (configurable via `JWT_EXPIRATION`)
2. Passwords are hashed using BCrypt before storage
3. JWT secret must be changed in production (minimum 64 characters)
4. Always use HTTPS in production
5. Never expose JWT tokens in logs or error messages
