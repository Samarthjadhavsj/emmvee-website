# Emmvee Website - Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables (CRITICAL)

#### Backend Environment Variables
Create a `.env` file in the backend directory or set these as environment variables:

```bash
# Database Configuration
DB_PASSWORD=<strong_production_password>
SPRING_DATASOURCE_URL=jdbc:mysql://<host>:<port>/emmvee_careers
SPRING_DATASOURCE_USERNAME=<db_username>

# JWT Configuration (CRITICAL - MUST BE CHANGED IN PRODUCTION)
JWT_SECRET=<minimum_64_character_random_secret>
JWT_EXPIRATION=3600000

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://your-production-domain.com
```

**SECURITY WARNING**: The JWT_SECRET MUST be changed to a strong random value in production. Generate it using:
```bash
# Linux/Mac
openssl rand -base64 64

# Or use a password generator for a 64+ character random string
```

#### Frontend Environment Variables
Set during build or in `.env`:
```bash
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### 2. Database Setup

1. Create MySQL database `emmvee_careers`
2. The application will auto-create tables on first run (spring.jpa.hibernate.ddl-auto=update)
3. Manually insert ADMIN and USER roles:

```sql
INSERT INTO roles (name) VALUES ('ADMIN');
INSERT INTO roles (name) VALUES ('USER');
```

4. Create an admin user:
```sql
-- First, register via API, then update role:
UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'ADMIN') WHERE email = 'admin@emmvee.com';
```

### 3. Docker Deployment

#### Option A: Using Docker Compose (Recommended for Testing)

```bash
# Set DB_PASSWORD in .env file
echo "DB_PASSWORD=your_secure_password" > .env

# Start all services
docker-compose up -d

# Services will be available at:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:8081/api
# - MySQL: localhost:3307
```

#### Option B: Individual Docker Images

Build images:
```bash
# Backend
cd backend
docker build -t emmvee-backend:latest .

# Frontend
cd frontend
docker build --build-arg VITE_API_BASE_URL=https://your-api.com/api -t emmvee-frontend:latest .
```

### 4. Production Deployment (AWS EC2 Example)

#### Backend Deployment

1. **Install Java 21**
```bash
sudo apt update
sudo apt install openjdk-21-jdk
```

2. **Set up MySQL** (or use Amazon RDS)

3. **Upload and run backend**
```bash
# Upload backend JAR
scp backend/target/backend-0.0.1-SNAPSHOT.jar ec2-user@your-server:/app/

# Set environment variables
export DB_PASSWORD=your_secure_password
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/emmvee_careers
export JWT_SECRET=your_production_secret_minimum_64_chars
export CORS_ALLOWED_ORIGINS=https://yourdomain.com

# Run backend
java -jar /app/backend-0.0.1-SNAPSHOT.jar
```

4. **Use systemd service** (recommended)
```bash
sudo nano /etc/systemd/system/emmvee-backend.service
```

```ini
[Unit]
Description=Emmvee Careers Backend
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/app
Environment="DB_PASSWORD=your_secure_password"
Environment="SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/emmvee_careers"
Environment="JWT_SECRET=your_production_secret"
Environment="CORS_ALLOWED_ORIGINS=https://yourdomain.com"
ExecStart=/usr/bin/java -jar /app/backend-0.0.1-SNAPSHOT.jar
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable emmvee-backend
sudo systemctl start emmvee-backend
```

#### Frontend Deployment

1. **Build frontend with production API URL**
```bash
cd frontend
VITE_API_BASE_URL=https://your-api.com/api npm run build
```

2. **Deploy dist folder** to:
   - Nginx server
   - AWS S3 + CloudFront
   - Netlify
   - Vercel

Example Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/emmvee-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 5. Security Checklist

- [ ] JWT_SECRET changed to production value (minimum 64 characters)
- [ ] DB_PASSWORD is strong and secure
- [ ] CORS_ALLOWED_ORIGINS set to production frontend URL only
- [ ] HTTPS enabled for both frontend and backend
- [ ] Database accessible only from backend server
- [ ] Firewall rules configured (only necessary ports open)
- [ ] Backend runs as non-root user
- [ ] Environment variables not committed to git

### 6. Health Check

After deployment, verify:

```bash
# Backend health
curl https://your-api.com/api/actuator/health

# Expected response:
{"status":"UP"}

# Backend info
curl https://your-api.com/api/actuator/info
```

### 7. Post-Deployment Testing

1. **Register a test user** via frontend
2. **Login** and verify JWT token works
3. **Test public endpoints**:
   - GET /api/careers/jobs
   - GET /api/careers/jobs/{id}
4. **Test authenticated endpoints** (with JWT):
   - POST /api/applications
   - GET /api/applications/my
5. **Test admin endpoints** (with admin JWT):
   - POST /api/careers/jobs
   - PUT /api/careers/jobs/{id}
   - DELETE /api/careers/jobs/{id}
   - GET /api/admin/applications

### 8. Monitoring

- Monitor backend logs: `journalctl -u emmvee-backend -f`
- Monitor database connections
- Set up alerts for application errors
- Monitor API response times

### 9. Backup Strategy

- Regular MySQL database backups
- Backup uploaded resumes (if stored on server)
- Backup environment configuration

### 10. Scaling Considerations

- Use load balancer for multiple backend instances
- Use Redis for session management (if needed)
- Use CDN for frontend assets
- Use cloud storage (S3) for resume uploads
