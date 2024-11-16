# CRM-Tool
Contact Management System that allows users to manage contacts with functionalities such as adding, editing, deleting, and viewing contact details. The system also supports user authentication (login and registration), and provides a responsive and interactive UI.

## Tech Stack

- **Frontend**: React, Material UI
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
  
## 🛠Installation
To get started with Adopet, follow these steps:

1. Clone the repository to your local machine.

```bash
git clone https://github.com/Shubh220904/CRM-Tool.git
```

## Setup Environment Variables

Create a .env file in the backend folder with the following content:

.env
```bash
PORT=5000
DB_USER=YOUR_USER
DB_HOST=localhost
DB_DATABASE=YOUR_DATABASE
DB_PASSWORD=YOUR_PASSWORD
DB_PORT=5432
JWT_SECRET=YOUR_JWT_SECRET_KEY
```

Replace the DB_PASSWORD and JWT_SECRET with your own values.

2.Create Database Tables

Connect to your PostgreSQL database and run the following SQL commands to create the necessary tables:

```bash
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(100),
  job_title VARCHAR(100)
);
```

3.Start the Backend Server

Run the following command to start the backend server:

```bash
npm run start
```

The backend server will run on http://localhost:5000.

4.Frontend Setup
Navigate to the Frontend Directory

```bash
cd frontend
```

Install Frontend Dependencies

```bash
npm install
```

Start the Frontend Server

```bash
npm run start
```

The frontend will be accessible at http://localhost:3000.

 

