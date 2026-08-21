# Emmvee Careers Platform - Testing Guide

## Automated Tests

### Backend Tests

The backend includes unit and integration tests using JUnit 5, Spring Boot Test, and H2 in-memory database.

#### Running All Tests

```bash
cd backend
./mvnw test  # Linux/Mac
.\mvnw.cmd test  # Windows
```

#### Test Coverage

Current tests cover:

1. **AuthenticationTests**:
   - User registration
   - User login
   - JWT token generation

2. **JobServiceTests**:
   - Job creation
   - Job retrieval by ID
   - Job not found handling
   - Invalid sort field handling

3. **BackendApplicationTests**:
   - Application context loading

#### Test Configuration

Tests use H2 in-memory database configured in `backend/src/test/resources/application-test.properties`.

No external database required for running tests.

---

## Manual Testing Guide

### Prerequisites

1. **Backend running** on `http://localhost:8080`
2. **MySQL database** running with `emmvee_careers` database
3. **Roles inserted** in database:
   ```sql
   INSERT INTO roles (name) VALUES ('ADMIN');
   INSERT INTO roles (name) VALUES ('USER');
   ```

---

### Test Scenarios

#### 1. User Registration and Login

**Test Case**: Register a new user

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

**Expected**: HTTP 201, response with user details

**Test Case**: Register with duplicate email

```bash
# Run the same request again
```

**Expected**: HTTP 400, error message about email already registered

**Test Case**: Login with valid credentials

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

**Expected**: HTTP 200, response with JWT token

**Save the token** for subsequent tests.

**Test Case**: Login with invalid credentials

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword"
  }'
```

**Expected**: HTTP 400, error message

---

#### 2. Public Job Endpoints

**Test Case**: Get all jobs (empty list initially)

```bash
curl http://localhost:8080/api/careers/jobs
```

**Expected**: HTTP 200, paginated empty response

---

#### 3. Admin Job Management

First, create an admin user:

```sql
-- Update a user to ADMIN role
UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'ADMIN') 
WHERE email = 'admin@example.com';
```

**Test Case**: Create a job (without authentication)

```bash
curl -X POST http://localhost:8080/api/careers/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer",
    "location": "Bengaluru",
    "department": "Engineering",
    "employmentType": "Full Time"
  }'
```

**Expected**: HTTP 401 or 403 (Unauthorized/Forbidden)

**Test Case**: Create a job (with admin token)

```bash
# First login as admin to get admin token
ADMIN_TOKEN="<admin_jwt_token>"

curl -X POST http://localhost:8080/api/careers/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "title": "Software Engineer",
    "location": "Bengaluru",
    "department": "Engineering",
    "employmentType": "Full Time"
  }'
```

**Expected**: HTTP 200, response with created job

**Test Case**: Create a job (with regular USER token)

```bash
# Use regular user token
curl -X POST http://localhost:8080/api/careers/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "title": "Backend Engineer",
    "location": "Bengaluru",
    "department": "Engineering",
    "employmentType": "Full Time"
  }'
```

**Expected**: HTTP 403 (Forbidden)

**Test Case**: Get job by ID

```bash
curl http://localhost:8080/api/careers/jobs/1
```

**Expected**: HTTP 200, job details

**Test Case**: Get non-existent job

```bash
curl http://localhost:8080/api/careers/jobs/999999
```

**Expected**: HTTP 404, error message

**Test Case**: Update a job (admin)

```bash
curl -X PUT http://localhost:8080/api/careers/jobs/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "title": "Senior Software Engineer",
    "location": "Bengaluru",
    "department": "Engineering",
    "employmentType": "Full Time"
  }'
```

**Expected**: HTTP 200, updated job details

**Test Case**: Delete a job (admin)

```bash
curl -X DELETE http://localhost:8080/api/careers/jobs/1 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected**: HTTP 200, success message

---

#### 4. Job Search and Filtering

**Test Case**: Search by title

```bash
curl "http://localhost:8080/api/careers/jobs?search=Engineer"
```

**Expected**: HTTP 200, filtered results

**Test Case**: Filter by department

```bash
curl "http://localhost:8080/api/careers/jobs?department=Engineering"
```

**Expected**: HTTP 200, filtered results

**Test Case**: Pagination

```bash
curl "http://localhost:8080/api/careers/jobs?page=0&size=5"
```

**Expected**: HTTP 200, paginated results with 5 items per page

**Test Case**: Sorting

```bash
curl "http://localhost:8080/api/careers/jobs?sortBy=title&direction=desc"
```

**Expected**: HTTP 200, results sorted by title descending

**Test Case**: Invalid sort field

```bash
curl "http://localhost:8080/api/careers/jobs?sortBy=invalidField"
```

**Expected**: HTTP 400, error message

---

#### 5. Job Applications

**Test Case**: Apply for a job (without authentication)

```bash
curl -X POST http://localhost:8080/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": 1,
    "resumeUrl": "https://example.com/resume.pdf",
    "coverLetter": "I am interested in this position."
  }'
```

**Expected**: HTTP 401 (Unauthorized)

**Test Case**: Apply for a job (authenticated)

```bash
curl -X POST http://localhost:8080/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "jobId": 1,
    "resumeUrl": "https://example.com/resume.pdf",
    "coverLetter": "I am interested in this position."
  }'
```

**Expected**: HTTP 200, application details with status "APPLIED"

**Test Case**: Apply for the same job twice

```bash
# Run the same request again
```

**Expected**: HTTP 400, error message about already applied

**Test Case**: Apply for non-existent job

```bash
curl -X POST http://localhost:8080/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "jobId": 999999,
    "resumeUrl": "https://example.com/resume.pdf",
    "coverLetter": "I am interested in this position."
  }'
```

**Expected**: HTTP 400 or 404, error message

**Test Case**: Get my applications

```bash
curl http://localhost:8080/api/applications/my \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Expected**: HTTP 200, list of user's applications

---

#### 6. Admin Application Management

**Test Case**: Get all applications (admin only)

```bash
curl http://localhost:8080/api/admin/applications \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected**: HTTP 200, list of all applications

**Test Case**: Get all applications (regular user)

```bash
curl http://localhost:8080/api/admin/applications \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Expected**: HTTP 403 (Forbidden)

**Test Case**: Update application status (admin)

```bash
curl -X PUT http://localhost:8080/api/admin/applications/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "status": "SHORTLISTED"
  }'
```

**Expected**: HTTP 200, updated application with new status

**Valid statuses**: APPLIED, REVIEWING, SHORTLISTED, REJECTED, HIRED

---

#### 7. User Profile

**Test Case**: Get profile (authenticated)

```bash
curl http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Expected**: HTTP 200, user email

---

#### 8. Health Check

**Test Case**: Health endpoint

```bash
curl http://localhost:8080/actuator/health
```

**Expected**: HTTP 200, `{"status":"UP"}`

**Test Case**: Info endpoint

```bash
curl http://localhost:8080/actuator/info
```

**Expected**: HTTP 200, application info

---

### Frontend Manual Testing

1. **Start frontend**: `cd frontend && npm run dev`
2. **Open browser**: http://localhost:5173

#### Test Flows

1. **Homepage**:
   - [ ] Page loads correctly
   - [ ] Navigation works
   - [ ] All links functional

2. **Registration**:
   - [ ] Can access registration page
   - [ ] Form validation works (empty fields, invalid email)
   - [ ] Can register successfully
   - [ ] Duplicate email shows error
   - [ ] Redirects to login after successful registration

3. **Login**:
   - [ ] Can access login page
   - [ ] Form validation works
   - [ ] Login with valid credentials succeeds
   - [ ] Login with invalid credentials shows error
   - [ ] JWT token saved to localStorage
   - [ ] Redirects to appropriate page after login

4. **Careers/Jobs Page**:
   - [ ] Jobs list loads
   - [ ] Search works
   - [ ] Filters work (department, location, employment type)
   - [ ] Pagination works
   - [ ] Can view job details
   - [ ] Apply button visible for authenticated users

5. **Job Application**:
   - [ ] Application form loads
   - [ ] Form validation works
   - [ ] Can submit application
   - [ ] Shows error if already applied
   - [ ] Redirects after successful submission

6. **My Applications** (authenticated user):
   - [ ] Can access My Applications page
   - [ ] Applications list loads
   - [ ] Shows correct status
   - [ ] Shows application details

7. **Admin Dashboard** (admin user):
   - [ ] Can access admin dashboard
   - [ ] Can create job
   - [ ] Can edit job
   - [ ] Can delete job
   - [ ] Can view all applications
   - [ ] Can update application status

8. **Protected Routes**:
   - [ ] Unauthenticated users redirected to login
   - [ ] Regular users cannot access admin routes
   - [ ] Proper authorization checks work

9. **Logout**:
   - [ ] Logout clears token
   - [ ] Redirects to home/login
   - [ ] Cannot access protected routes after logout

---

### CORS Testing

Test CORS from a different origin:

```html
<!-- Create test.html and open in browser -->
<!DOCTYPE html>
<html>
<body>
<script>
fetch('http://localhost:8080/api/careers/jobs')
  .then(res => res.json())
  .then(data => console.log('CORS works!', data))
  .catch(err => console.error('CORS failed:', err));
</script>
</body>
</html>
```

If CORS works, you'll see the response in console. If not, check backend CORS configuration.

---

### JWT Token Testing

**Test Case**: Expired token

1. Set `JWT_EXPIRATION=1000` (1 second)
2. Login to get token
3. Wait 2 seconds
4. Try accessing protected endpoint

**Expected**: HTTP 401 or token validation error

**Test Case**: Invalid token

```bash
curl http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected**: HTTP 401 or authentication error

**Test Case**: Missing token

```bash
curl http://localhost:8080/api/user/profile
```

**Expected**: HTTP 401 or authentication required error

---

## Browser Testing

Test on multiple browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

Test responsive design on different screen sizes.

---

## Performance Testing

Use tools like Apache JMeter or k6 for load testing:

```bash
# Example k6 test
k6 run --vus 10 --duration 30s load-test.js
```

Test scenarios:
- Concurrent user logins
- Concurrent job applications
- Job search with high load
- Admin operations under load

---

## Security Testing

1. **SQL Injection**: Try SQL injection in search/filter fields
2. **XSS**: Try injecting scripts in text fields
3. **CSRF**: Verify CSRF is disabled (as expected for JWT-based APIs)
4. **Authentication**: Verify all protected endpoints require valid JWT
5. **Authorization**: Verify role-based access control
6. **Password Security**: Verify passwords are hashed (check database)

---

## Continuous Integration

Tests run automatically on every commit via GitHub Actions (`.github/workflows/ci.yml`).

View test results in GitHub Actions tab of the repository.

---

## Test Report Template

Use this template for documenting test results:

```markdown
## Test Execution Report

**Date**: YYYY-MM-DD
**Tester**: Name
**Environment**: Development/Staging/Production

### Automated Tests
- Backend Tests: PASS/FAIL
- Test Coverage: X%

### Manual Tests
| Test Case | Expected | Actual | Status |
|-----------|----------|--------|--------|
| User Registration | Success | Success | PASS |
| User Login | JWT Token | JWT Token | PASS |
| ... | ... | ... | ... |

### Issues Found
1. Issue description
2. Issue description

### Recommendations
1. Recommendation
2. Recommendation
```
