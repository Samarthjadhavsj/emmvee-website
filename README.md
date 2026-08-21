# Emmvee Careers Platform

A full-stack job application and careers management platform built with Spring Boot (Java 21) and React (TypeScript).

## 🚀 Quick Links

- **[Production Readiness Report](PRODUCTION_READINESS_REPORT.md)** - Comprehensive audit and deployment status
- **[Deployment Guide](DEPLOYMENT.md)** - Step-by-step deployment instructions
- **[API Documentation](API.md)** - Complete REST API reference
- **[Testing Guide](TESTING.md)** - Manual and automated testing instructions

## 📋 Project Structure

```
emmvee-website/
├── backend/                 # Spring Boot backend (Java 21)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/       # Application source code
│   │   │   └── resources/  # Configuration files
│   │   └── test/           # Unit tests
│   ├── pom.xml             # Maven dependencies
│   └── .env.example        # Environment variable template
│
├── frontend/               # React frontend (TypeScript)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── services/      # API service layer
│   ├── package.json       # npm dependencies
│   └── .env.example       # Frontend env template
│
├── database/              # Database scripts
├── docs/                  # Additional documentation
├── .github/workflows/     # CI/CD workflows
├── docker-compose.yml     # Docker setup
└── README.md             # This file
```

## 🎯 Features

### For Users
- User registration and authentication
- Browse available job openings
- Search and filter jobs
- Submit job applications
- Track application status

### For Administrators
- Create, update, and delete job postings
- View all applications
- Update application statuses
- Manage career opportunities

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 4.1.0
- **Language**: Java 21
- **Database**: MySQL 8.0
- **Security**: Spring Security + JWT
- **Build Tool**: Maven
- **Testing**: JUnit 5, Spring Boot Test

### Frontend
- **Framework**: React 19
- **Language**: TypeScript 6
- **Build Tool**: Vite 8
- **Router**: React Router DOM 7
- **Styling**: CSS

## 🚦 Getting Started

### Prerequisites

- Java 21
- Node.js 18+
- MySQL 8.0
- Maven 3.6+
- npm or yarn

### Local Development Setup

#### 1. Clone Repository

```bash
git clone https://github.com/Samarthjadhavsj/emmvee-website.git
cd emmvee-website
```

#### 2. Database Setup

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE emmvee_careers;

# Insert roles
USE emmvee_careers;
INSERT INTO roles (name) VALUES ('ADMIN');
INSERT INTO roles (name) VALUES ('USER');
```

#### 3. Backend Setup

```bash
cd backend

# Create .env file (or set environment variables)
echo "DB_PASSWORD=your_password" > .env

# Build and run
./mvnw spring-boot:run

# Backend will start on http://localhost:8080
```

#### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8080/api" > .env

# Run development server
npm run dev

# Frontend will start on http://localhost:5173
```

### Using Docker Compose

```bash
# Set database password
echo "DB_PASSWORD=your_password" > .env

# Start all services
docker-compose up -d

# Services:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:8081
# - MySQL: localhost:3307
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
./mvnw test
```

All tests use H2 in-memory database and do not require MySQL.

### Frontend Build Test

```bash
cd frontend
npm run build
```

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [PRODUCTION_READINESS_REPORT.md](PRODUCTION_READINESS_REPORT.md) | Complete audit, test results, and deployment status |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guide with environment setup |
| [API.md](API.md) | REST API documentation with examples |
| [TESTING.md](TESTING.md) | Testing guide with manual test scenarios |

## 🔒 Security

### Environment Variables

**CRITICAL**: The following environment variables MUST be set for production:

#### Backend
```bash
DB_PASSWORD=<strong_password>
SPRING_DATASOURCE_URL=jdbc:mysql://<host>:3306/emmvee_careers
JWT_SECRET=<minimum_64_character_random_string>
CORS_ALLOWED_ORIGINS=https://your-domain.com
```

#### Frontend
```bash
VITE_API_BASE_URL=https://your-api-domain.com/api
```

See [backend/.env.example](backend/.env.example) for complete list.

### Security Features

- ✅ JWT-based authentication
- ✅ BCrypt password hashing
- ✅ Role-based access control (USER, ADMIN)
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection protection (JPA/Hibernate)

## 🎯 API Endpoints

### Public Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/careers/jobs` - List jobs (paginated, searchable)
- `GET /api/careers/jobs/{id}` - Get job details

### Authenticated Endpoints
- `GET /api/user/profile` - Get user profile
- `POST /api/applications` - Submit job application
- `GET /api/applications/my` - Get my applications

### Admin Endpoints
- `POST /api/careers/jobs` - Create job
- `PUT /api/careers/jobs/{id}` - Update job
- `DELETE /api/careers/jobs/{id}` - Delete job
- `GET /api/admin/applications` - View all applications
- `PUT /api/admin/applications/{id}/status` - Update application status

See [API.md](API.md) for complete documentation.

## 🚀 Deployment

### Quick Deployment Checklist

1. ✅ Build backend: `cd backend && ./mvnw clean package`
2. ✅ Build frontend: `cd frontend && npm run build`
3. ✅ Set production environment variables
4. ✅ Deploy backend JAR to server
5. ✅ Deploy frontend dist to web server/CDN
6. ✅ Configure HTTPS
7. ✅ Set up database (MySQL)
8. ✅ Insert roles and create admin user
9. ✅ Run smoke tests

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📊 Project Status

✅ **PRODUCTION READY**

- Backend: 7/7 tests passing
- Frontend: Build successful
- Security: Hardened and audited
- Documentation: Complete

**Only deployment tasks remain** (environment setup, infrastructure provisioning).

See [PRODUCTION_READINESS_REPORT.md](PRODUCTION_READINESS_REPORT.md) for complete audit.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is proprietary software owned by Emmvee Solar.

## 🐛 Known Issues

None. See [PRODUCTION_READINESS_REPORT.md](PRODUCTION_READINESS_REPORT.md) for details.

## 📞 Support

For issues or questions:
1. Check documentation in this repository
2. Review [TESTING.md](TESTING.md) for troubleshooting
3. Check application logs
4. Verify environment variables are set correctly

## 🎓 Learning Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [JWT Introduction](https://jwt.io/introduction)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 🏗️ Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────┐
│  React Frontend │ (Port 5173/80)
│   (TypeScript)  │
└────────┬────────┘
         │ REST API
         │ JWT Auth
         ▼
┌──────────────────┐
│ Spring Boot API  │ (Port 8080)
│    (Java 21)     │
└────────┬─────────┘
         │ JDBC
         ▼
┌──────────────────┐
│  MySQL Database  │ (Port 3306)
│      (8.0)       │
└──────────────────┘
```

## 📈 Next Steps

After deployment, consider:
- File upload for resumes
- Email notifications
- Advanced search filters
- User profile management
- Performance monitoring
- Additional security features (rate limiting, refresh tokens)

---

**Built with ❤️ for Emmvee Solar**
