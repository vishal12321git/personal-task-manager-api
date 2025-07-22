```markdown
# 🗂️ Personal Task Manager API

A secure and modular **Personal Task Manager API** built using **Node.js**, **Express**, **PostgreSQL**, and **Sequelize ORM**. This API allows users to register, log in, and manage their daily tasks with features like filtering, sorting, authentication, and more.

---

## 🚀 Features Implemented

### ✅ User Authentication
- **JWT-based authentication** for secure user sessions.
- **User registration and login** routes.
- Passwords are securely **hashed using bcrypt**.
- Auth middleware to protect sensitive routes.

### 📝 Task Management (CRUD)
- Users can **Create**, **Read**, **Update**, and **Delete** tasks.
- Each task is associated with a **logged-in user** only.
- Data validation and user authorization on all task routes.

### 🔍 Filtering & Sorting
- Tasks can be **filtered** by:
  - `priority` (`low`, `medium`, `high`)
  - `status` (`pending`, `completed`)
  - `dueDate` range
- Tasks can be **sorted** by:
  - `priority`
  - `dueDate`

### 🔐 Middleware
- **Authentication Middleware** to verify JWT token on protected routes.
- **Error Handling Middleware** for clean and consistent error responses.

### 📁 Modular Structure
```

├── config/          # Sequelize & DB config
├── controllers/     # Auth & Task logic
├── models/          # Sequelize models
├── migrations/      # Sequelize migrations
├── routes/          # Express routes
├── middleware/      # Auth & error middlewares
├── services/        # Reusable services (e.g., token, hashing)
└── app.js           # Entry point

```

### 🧪 Sequelize ORM
- Used Sequelize to:
  - Define models with associations.
  - Run migrations to manage schema.
  - Perform query filtering, sorting, and joins.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL (can switch to MySQL)
- **ORM**: Sequelize
- **Authentication**: JWT, bcrypt
- **Environment**: dotenv
- **Others**: cookie-parser, cors

---

## 📌 API Endpoints

### 🔐 Auth Routes
| Method | Endpoint            | Description            |
|--------|---------------------|------------------------|
| POST   | `/auth/register`    | Register new user      |
| POST   | `/auth/login`       | Log in user & get token|
| POST   | `/auth/logout`      | Log out user (cookie)  |

### 📋 Task Routes (Protected)
| Method | Endpoint             | Description                           |
|--------|----------------------|---------------------------------------|
| GET    | `/tasks`             | Get all tasks (with filters/sort)     |
| GET    | `/tasks/:id`         | Get a specific task                   |
| POST   | `/tasks`             | Create a new task                     |
| PUT    | `/tasks/:id`         | Update an existing task               |
| DELETE | `/tasks/:id`         | Delete a task                         |

### 🔎 Filtering & Sorting (Query Params Example)
```

GET /tasks?priority=high\&status=pending\&sortBy=dueDate\&order=asc

````

---

## ✅ Getting Started

### 1. Clone the repo
```bash
git clone https://gitlab.com/js-drills1/personal-task-manager-api.git
cd personal-task-manager-api
````

### 2. Install dependencies

```bash
npm install
```

### 3. Setup `.env` file

```env
PORT=8000
JWT_SECRET=your_jwt_secret
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=localhost
```

### 4. Run Migrations

```bash
npx sequelize-cli db:migrate
```

### 5. Start the server

```bash
npm run dev
```

---

## 📄 Future Improvements

* ✅ Add **pagination** support to task listing
* ⏳ Add **reminder feature** using email or notifications
* 📚 Swagger/Postman-based **API documentation**

```
