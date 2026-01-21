Store Rating & Directory Application
A full-stack web application built for an internship assignment. The platform allows users to find and rate stores, store owners to view their performance metrics, and system administrators to manage the entire ecosystem.

🚀 Key Features
Role-Based Access Control (RBAC): Distinct dashboards for Admin, Store Owner, and User.

User Dashboard: Searchable store directory with real-time filtering and rating submission system.

Store Owner Dashboard: Data visualization for average ratings and total reviews, including a table of specific user feedback.

Admin Dashboard: Global statistics (Total Users, Stores, Ratings) and a comprehensive store management table.

Secure Authentication: User signup and login with JWT-based sessions and bcrypt password hashing.

Profile Management: Capability for users to update their passwords securely.

🛠️ Tech Stack
Frontend: React.js, Axios, React Router

Backend: Node.js, Express.js

Database: MySQL

Authentication: JSON Web Tokens (JWT) & Bcrypt

📂 Project Structure
    store-rating-app/
    ├── client/           # React Frontend
    ├── server/           # Node.js Backend
    └── database_init.sql # Database schema and seed data

⚙️ Setup Instructions
1. Database Setup
Open MySQL Workbench or any MySQL client.

Import and run the database_init.sql file provided in the root directory.

Ensure your MySQL server is running on the default port (3306).

2. Backend Configuration
    1.Navigate to the server folder: cd server

    2.Install dependencies: npm install

    3.Create a .env file and add your credentials:
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=store_rating_db
    JWT_SECRET=your_secret_key
    PORT=5000

    4.Start the server: node index.js

3. Frontend Configuration
Navigate to the client folder: cd client

Install dependencies: npm install

Start the React app: npm start

The app will open at http://localhost:3000 

Role	        Email	         Password
System Admin	admin@test.com	 Admin123!
Store Owner	    owner@test.com	 Owner123!
Regular User	user@test.com	 User123!

