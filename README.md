# Emmvee Careers Platform

[![CI](https://github.com/Samarthjadhavsj/emmvee-website/actions/workflows/ci.yml/badge.svg)](https://github.com/Samarthjadhavsj/emmvee-website/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

> A production-deployed full-stack careers management platform built with Spring Boot, React, JWT authentication, and role-based authorization. Deployed on AWS EC2 with comprehensive testing and production-ready security.

## 🌐 Live Demo

- **Frontend**: http://13.233.53.142
- **API**: http://13.233.53.142/api
- **Health Check**: http://13.233.53.142/actuator/health

_Note: Currently deployed on HTTP. HTTPS/domain configuration is planned infrastructure work._

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Testing](#-testing)
- [Security](#-security)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)

---

## ✨ Features

### User Features
- **Authentication**: User registration and JWT-based login
- **Job Browsing**: View and search available positions with pagination and sorting
- **Job Applications**: Submit applications for open positions
- **Application Tracking**: View status of submitted applications

### Admin Features
- **Job Management**: Create, update, and delete job postings
- **Application Management**: View all applications and update their status
- **Role-Based Access**: Protected administrative endpoints with JWT authorization

### Technical Features
- **Stateless Authentication**: JWT tokens for scalable authentication
- **Role-Based Authorization**: ADMIN and USER roles with Spring Security
- **Password Security**: BCrypt hashing with salt
- **CORS Protection**: Configured origins for production security
- **Input Validation**: Bean Validation API for request validation
- **Pagination & Sorting**: Efficient data retrieval for large datasets
- **Comprehensive Testing**: 7 automated backend tests with H2 in-memory database
- **Production Deployment**: Systemd service with Nginx reverse proxy

---

## 🏗️ Architecture

### System Architecture

```
Internet
   ↓
AWS EC2 Instance
   ├─── Nginx (Port 80)
   │      ├─── Serves React Frontend (static files)
   │      └─── Reverse Proxy to Backend API
   │
   ├─── Spring Boot (Port 8080)
   │      ├─── Spring Security + JWT Filter
   │      ├─── REST Controllers
   │      ├─── Service Layer
   │      └─── JPA Repositories
   │
   └─── MySQL (Port 3306, localhost only)
          └─── Relational Database
```

### Authentication Flow

```
1. User submits credentials
   ↓
2. Spring Security validates
   ↓
3. JWT token generated (signed with HMAC-SHA512)
   ↓
4. Client stores token
   ↓
5. Subsequent requests include: Authorization: Bearer <token>
   ↓
6. JwtAuthenticationFilter validates token
   ↓
7. Spring Security sets authentication context
   ↓
8. Role-based authorization applied
```

### Deployment Architecture

```
Developer Machine              GitHub                    AWS EC2
     ↓                            ↓                         ↓
   git push  →  feature/production-deployment  →  git pull
                                                            ↓
                                                     Maven Build
                                                            ↓
                                                  systemd backend.service
                                                  (auto-restart enabled)
                                                            ↓
                                                     npm run build
                                                            ↓
                                                   Nginx serves /dist
```

---

## 🛠️ Tech Stack

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot 4.1.0
- **Security**: Spring Security 7 + JWT (jjwt 0.12.6)
- **Database**: MySQL 8.0 (Production), H2 (Testing)
- **ORM**: Spring Data JPA + Hibernate 7.4.1
- **Build Tool**: Maven 3.9
- **Testing**: JUnit 5, Spring Boot Test, Mockito

### Frontend
- **Language**: TypeScript 5
- **Framework**: React 19
- **Build Tool**: Vite 8
- **Router**: React Router DOM 7
- **HTTP Client**: Native Fetch API
- **Styling**: CSS3

### DevOps & Infrastructure
- **CI/CD**: GitHub Actions
- **Hosting**: AWS EC2 (Ubuntu)
- **Web Server**: Nginx 1.28
- **Process Manager**: systemd
- **Version Control**: Git / GitHub

---

## 🚀 Quick Start

### Prerequisites

- Java 21
- Node.js 22+
- MySQL 8.0
- Maven 3.9+ (or use included wrapper)

### 1. Clone Repository

```bash
git clone https://github.com/Samarthjadhavsj/emmvee-website.git
cd emmvee-website
```

### 2. Database Setup

```sql
-- Create database
CREATE DATABASE emmvee_careers;

-- Create roles
USE emmvee_careers;
INSERT INTO roles (name) VALUES ('ADMIN'), ('USER');
```

### 3. Backend Setup

```bash
cd backend

# Create environment file
cat > .env << EOF
DB_PASSWORD=your_password
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/emmvee_careers
SPRING_DATASOURCE_USERNAME=root
JWT_SECRET=your_64_character_minimum_secret_key_change_this_in_production
JWT_EXPIRATION=3600000
CORS_ALLOWED_ORIGINS=http://localhost:5173
EOF

# Run backend
./mvnw spring-boot:run

# Backend available at: http://localhost:8080
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env

# Run frontend
npm run dev

# Frontend available at: http://localhost:5173
```

---

## 🧪 Testing

### Automated Backend Tests

```bash
cd backend
./mvnw test
```

**Test Results**: ✅ 7/7 passing

- **AuthenticationTests** (2 tests)
  - User registration
  - User login and JWT token generation
  
- **JobServiceTests** (4 tests)
  - Create job
  - Retrieve job by ID
  - Job not found exception
  - Job pagination

- **BackendApplicationTests** (1 test)
  - Spring context loads successfully

**Test Configuration**: Tests use H2 in-memory database and do not require MySQL.

### Frontend Build Verification

```bash
cd frontend
npm run build
```

**Build Status**: ✅ Successful (44 modules transformed, 254KB JS bundle)

### Manual Testing

See [TESTING.md](TESTING.md) for comprehensive manual testing scenarios including:
- Registration and login flows
- Job creation (ADMIN)
- Authorization verification
- Application submission
- CORS verification

---

## 🔒 Security

### Implemented Security Measures

#### Authentication & Authorization
- **JWT Tokens**: Stateless authentication with HMAC-SHA512 signing
- **Token Expiration**: 1-hour default (configurable)
- **Role-Based Access Control**: ADMIN and USER roles
- **Password Hashing**: BCrypt with salt (default strength factor: 10)

#### API Security
- **Protected Endpoints**: Admin operations require ADMIN role JWT
- **CORS Configuration**: Environment-based allowed origins
- **Input Validation**: Bean Validation API (@Valid, @NotBlank, @Email)
- **SQL Injection Protection**: JPA parameterized queries

#### Infrastructure Security
- **MySQL Binding**: Localhost only (not exposed publicly)
- **Environment Variables**: Sensitive data stored in `.env` files (not committed)
- **Service Isolation**: Backend runs as dedicated systemd service

### Security Configuration

**Environment Variables** (Production):

```bash
# Backend
JWT_SECRET=<minimum_64_character_random_string>
DB_PASSWORD=<strong_production_password>
CORS_ALLOWED_ORIGINS=https://your-domain.com

# Frontend
VITE_API_BASE_URL=https://your-api-domain.com/api
```

⚠️ **CRITICAL**: Never commit `.env` files or hardcode secrets in source code.

---

## 📖 API Documentation

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/careers/jobs` | List jobs (paginated, sortable) |
| GET | `/api/careers/jobs/{id}` | Get job details |

### Authenticated Endpoints (JWT Required)

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/user/profile` | Get user profile | USER |
| POST | `/api/applications` | Submit application | USER |
| GET | `/api/applications/my` | Get my applications | USER |

### Admin Endpoints (JWT + ADMIN Role Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/careers/jobs` | Create job |
| PUT | `/api/careers/jobs/{id}` | Update job |
| DELETE | `/api/careers/jobs/{id}` | Delete job |
| GET | `/api/admin/applications` | View all applications |
| PUT | `/api/admin/applications/{id}/status` | Update application status |

**Full API documentation**: [API.md](API.md)

**Example Request**:

```bash
# Login
curl -X POST http://13.233.53.142/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Create Job (ADMIN)
curl -X POST http://13.233.53.142/api/careers/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "title":"Senior Software Engineer",
    "location":"Bangalore",
    "department":"Engineering",
    "employmentType":"Full Time",
    "description":"Build scalable systems"
  }'
```

---

## 🚀 Deployment

### Current Production Deployment

- **Platform**: AWS EC2 (Ubuntu)
- **Backend**: systemd service with auto-restart
- **Frontend**: Nginx static file serving + API reverse proxy
- **Database**: MySQL 8.0
- **CI/CD**: GitHub Actions (automated testing)

**Deployment Status**: ✅ Production-ready and deployed

### Deployment Verification

```bash
# Health check
curl http://13.233.53.142/actuator/health
# {"status":"UP"}

# API test
curl http://13.233.53.142/api/careers/jobs
# Returns paginated job list

# Frontend
curl http://13.233.53.142/
# Returns React application HTML
```

**Detailed deployment guide**: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📁 Project Structure

```
emmvee-website/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
│
├── backend/                     # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/emmvee/backend/
│   │   │   │   ├── config/    # Security, CORS, Password config
│   │   │   │   ├── controller/# REST Controllers
│   │   │   │   ├── dto/       # Data Transfer Objects
│   │   │   │   ├── entity/    # JPA Entities
│   │   │   │   ├── repository/# Spring Data Repositories
│   │   │   │   ├── security/  # JWT Filter
│   │   │   │   ├── service/   # Business Logic
│   │   │   │   └── exception/ # Custom Exceptions
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/              # JUnit Tests
│   │       ├── java/
│   │       └── resources/
│   │           └── application-test.properties
│   ├── pom.xml                 # Maven Dependencies
│   ├── .env.example            # Environment Variable Template
│   └── mvnw, mvnw.cmd          # Maven Wrapper
│
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable React Components
│   │   ├── pages/             # Page Components
│   │   ├── services/          # API Service Layer
│   │   ├── App.tsx            # Root Component
│   │   └── main.tsx           # Entry Point
│   ├── public/                # Static Assets
│   ├── dist/                  # Production Build Output
│   ├── package.json           # npm Dependencies
│   ├── tsconfig.json          # TypeScript Configuration
│   ├── vite.config.ts         # Vite Build Configuration
│   └── .env.example           # Frontend Env Template
│
├── API.md                      # REST API Documentation
├── DEPLOYMENT.md               # Deployment Guide
├── TESTING.md                  # Testing Guide
├── PRODUCTION_READINESS_REPORT.md  # Audit Report
├── docker-compose.yml          # Docker Development Setup
└── README.md                   # This File
```

---

## 📊 Project Status

| Component | Status | Details |
|-----------|--------|---------|
| Backend Tests | ✅ 7/7 Passing | JUnit + Spring Boot Test |
| Frontend Build | ✅ Success | Vite production build |
| Security Audit | ✅ Passed | No secrets committed, JWT configured |
| Production Deployment | ✅ Live | AWS EC2 with systemd + Nginx |
| CI/CD | ✅ Configured | GitHub Actions |
| Documentation | ✅ Complete | API, Deployment, Testing guides |

---

## 🔮 Future Enhancements

### Infrastructure
- [ ] HTTPS/SSL configuration with Let's Encrypt
- [ ] Custom domain with DNS setup
- [ ] CloudWatch monitoring and alerting
- [ ] Automated database backups
- [ ] Blue-green deployment pipeline

### Features
- [ ] Resume/CV upload for applications
- [ ] Email notifications for application status changes
- [ ] Advanced search filters (location, department, employment type)
- [ ] User profile management (change password, update details)
- [ ] Application deadline enforcement
- [ ] Admin analytics dashboard

### Technical Improvements
- [ ] JWT refresh tokens for extended sessions
- [ ] Rate limiting for API endpoints
- [ ] Redis caching for frequently accessed data
- [ ] WebSocket support for real-time notifications
- [ ] Frontend pagination for large job lists
- [ ] Enhanced frontend error handling

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [API.md](API.md) | Complete REST API reference with request/response examples |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guide with systemd and Nginx setup |
| [TESTING.md](TESTING.md) | Manual testing scenarios and verification steps |
| [PRODUCTION_READINESS_REPORT.md](PRODUCTION_READINESS_REPORT.md) | Comprehensive audit results and security analysis |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is proprietary software owned by Emmvee Solar.

---

## 🙏 Acknowledgments

- **Spring Boot** - Comprehensive Java framework
- **React** - Modern UI library
- **JWT** - Stateless authentication standard
- **AWS** - Cloud infrastructure

---

**Built with precision for Emmvee Solar's career management needs.**
