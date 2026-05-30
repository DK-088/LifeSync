# LifeSync AI — Backend

> **Smart Personal Finance & Life Management** — Node.js + Express + MongoDB Backend

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Refresh Tokens |
| AI | OpenAI GPT-4o-mini + Whisper |
| OCR | Tesseract.js |
| Real-time | Socket.IO |
| Jobs | node-cron |
| Security | Helmet, Rate Limiting, Mongo Sanitize, AES-256 |
| Validation | Joi |
| Logging | Winston + Morgan |

---

## 📁 Project Structure

```
lifesync-backend/
├── src/
│   ├── config/          # DB, env, AI configuration
│   ├── controllers/     # Thin request handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic (AI, analytics, voice, OCR)
│   │   ├── ai/
│   │   ├── analytics/
│   │   ├── notification/
│   │   ├── ocr/
│   │   ├── reminder/
│   │   └── voice/
│   ├── middleware/      # Auth, error, validation, rate limiting
│   ├── utils/           # JWT, encryption, logger, helpers
│   ├── validators/      # Joi schemas
│   ├── jobs/            # Cron jobs (EMI, subscriptions, health score)
│   ├── sockets/         # Socket.IO real-time notifications
│   ├── app.js
│   └── server.js
└── uploads/             # Bills, voice files, temp
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Fill in your MONGO_URI, JWT_SECRET, AES_SECRET_KEY, and SMTP credentials.
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Run with Docker
```bash
docker-compose up -d
```

---

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get profile |
| POST | `/api/auth/forgot-password` | Request password reset OTP |
| POST | `/api/auth/verify-otp` | Verify 6-digit reset code |
| POST | `/api/auth/reset-password` | Reset password using verified OTP |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | List expenses (paginated) |
| POST | `/api/expenses` | Create expense |
| GET | `/api/expenses/summary` | Monthly summary |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

### Notifications (UPI Parsing)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notification/parse` | Parse UPI notification |
| GET | `/api/notification/transactions` | Get parsed transactions |

### Voice
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/voice/command` | Process voice command |
| GET | `/api/voice/history` | Command history |

### OCR
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ocr/scan` | Scan bill image |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Dashboard overview |
| GET | `/api/analytics/spending` | Category breakdown |
| GET | `/api/analytics/savings-prediction` | Savings forecast |

### Reminders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reminders` | List reminders |
| POST | `/api/reminders` | Create reminder |
| GET | `/api/reminders/smart-suggestions` | AI suggestions |
| PATCH | `/api/reminders/:id/complete` | Mark complete |

### Debts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/debts` | List debts with summary |
| POST | `/api/debts` | Add debt |
| PATCH | `/api/debts/:id/pay` | Mark as paid |

### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/goals` | List goals |
| POST | `/api/goals` | Create goal |
| PATCH | `/api/goals/:id/contribute` | Add contribution |

---

## 🛡️ Security Features
- JWT Authentication with Refresh Tokens
- AES-256 encryption for sensitive data
- MongoDB injection sanitization
- Helmet HTTP security headers
- Rate limiting (global, auth, AI)
- Request validation with Joi

---

## ⏰ Background Jobs
| Job | Schedule | Description |
|-----|----------|-------------|
| EMI Reminder | Daily 8 AM IST | Alerts for upcoming EMIs |
| Subscription Check | Daily 9 AM IST | Auto-creates subscription reminders |
| Financial Health | 1st of month 7 AM | Calculates health scores |

---

## 🔌 Real-time (Socket.IO)
Connect to `/notifications` namespace and join a room:
```js
socket.emit('join', userId);
// Receive: 'transaction', 'reminder', 'alert' events
```

---

## 📄 License
ISC — LifeSync AI Team
