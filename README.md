# Course Management Web Project

## Description
This project is a web application built using **Vue.js** for the frontend and a **Node.js** server with **Express** for the backend. Users can log in and access their personal space to visualize their schedule, manage their courses, and send messages to other users.

### Technologies Used

#### Frontend
- **Vue.js**: A progressive JavaScript framework for building user interfaces.
- **Vue Router**: For implementing client-side routing.
- **CSS**: For styling components.

#### Backend
- **Node.js**: A runtime environment for server-side JavaScript.
- **Express**: A fast, unopinionated, and minimalist web framework for Node.js.
- **MySQL2**: A library to interact with MySQL databases.
- **bcrypt**: For hashing and securely storing passwords.
- **jsonwebtoken**: For handling authentication via JSON Web Tokens (JWT).

---

## Features

### General
- **User Management**: Users can register, log in, and update their profiles.
- **Authentication**: Secure authentication using JWT.
- **Database Integration**: All data (users, courses, messages) are stored in a MySQL database.
- **Password Encryption**: User passwords are encrypted using BCRYPT before being stored.

### User Features
- **View Schedule**: Users can visualize their course schedules.
- **Manage Courses**: Add, edit, or delete courses as per user roles (admin/teacher).
- **Messaging System**: Send and receive messages to/from other users.

### Admin Features
- **Manage Users**: View, add, edit, or delete user profiles.
- **Manage Courses**: Admins can create and organize courses.

---

## Prerequisites
To run this project, you need:

1. **Node.js** (v14 or later)
   - [Download Node.js](https://nodejs.org/en)
2. **MySQL** (any version compatible with MySQL2)
   - [Download MySQL](https://www.mysql.com/downloads/)
3. **Browser**: Chrome, Firefox, or any Chromium-based browser.

---

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm install vue-router@4 express mysql2 bcrypt jsonwebtoken
   ```

3. **Configure the Database**
   - Update the database credentials in `server.js` & `database.js`:
     ```javascript
     const SqlUsername = '<your-username>';
     const SqlPassword = '<your-password>';
     ```

4. **Create the Database**
   - Run the database setup script:
     ```bash
     node database.js
     ```

---

## Launch the Project

### 1. Backend
- Move to the backend directory:
   ```bash
   cd backend
   ```
- Start the server:
   ```bash
   node server.js
   ```

### 2. Frontend
- Start the Vue.js development server:
   ```bash
   npm run dev
   ```

- Open the application in your browser at: `http://localhost:5173` (default for Vite).

---

## Project Structure
```plaintext
project-directory/
|-- backend/
|   |-- database.js              # Script to initialize the database
|   |-- server.js                # Express server 
|
|-- node_modules/                # Installed dependencies
|-- public/                      # Static files for the frontend
|   |-- favicon.png              # Favicon of the website
|
|-- src/                         # Source code directory
|   |-- components/              
|   |   |-- adminboard.vue       # Admin dashboard component
|   |   |-- home.vue             # Home page component
|   |   |-- item.vue             # Reusable item component
|   |   |-- itemdetail.vue       # Detailed view for a singleitem
|   |   |-- itemlist.vue         # List view for displayingitems
|   |   |-- login.vue            # Login page component
|   |   |-- logout.vue           # Logout handler component
|   |   |-- studentboard.vue     # Student dashboard component
|   |   |-- teacherboard.vue     # Teacher dashboard component
|
|   |-- router/
|       |-- index.js             # Manage the routes of the website
|
|   |-- App.vue                  # Main App of the vue project
|   |-- main.js                  # Main javascript file of the project
|
|-- index.html                   # Main HTML entry point
|-- jsconfig.json                # JavaScript project configuration
|-- package.json                 # Project metadata and dependencies
|-- package-lock.json            # Lock file for npm dependencies
|-- README.md                    # Project documentation
|-- Script.sql                   # SQL script for database setup
|-- vite.config.js               # Vite configuration for the frontend
```
---

## Usage
1. Register a user from the login page.
2. Log in using the registered credentials.
3. Explore the dashboard:
   - View your courses.
   - Send messages.
   - Admins can manage users and courses.


## License
This project is licensed under the MIT License.



