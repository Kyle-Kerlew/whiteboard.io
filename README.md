Whiteboard.IO

A full-stack collaborative whiteboard application built to support real-time drawing, shared workspaces, user accounts, and persistent whiteboard data.

Live application: https://whiteboard.kylekerlew.com
Repository: https://github.com/Kyle-Kerlew/whiteboard.io

Overview

Whiteboard.IO is a full-stack web application that allows users to create and collaborate on digital whiteboards in real time.

The project was built as an end-to-end software engineering project, covering the frontend, backend, database layer, authentication, real-time communication, session management, and cloud deployment.

The application demonstrates how a browser-based client can communicate with a Node.js backend while maintaining synchronized state between multiple connected users.

What users can do

Create an account and authenticate

Create and access individual whiteboards

Draw on a shared canvas

See which other users are active on the same board

Collaborate with other connected users in real time

Rename whiteboards

Share a whiteboard using a URL

Maintain whiteboard data through a persistent MongoDB-backed application

Use the application through a production cloud deployment

Why I Built It

I built Whiteboard.IO to work through several areas of full-stack application development that are important in production software:

Real-time client/server communication

Persistent application state

User authentication and authorization

Session management

Database integration

REST API design

WebSocket communication

Frontend state management

Cloud deployment

Production-oriented security and middleware configuration

Rather than treating the application as a static frontend project, the goal was to build the supporting infrastructure required for multiple users to interact with the same application state.

Architecture

Whiteboard.IO is organized into three primary areas:

whiteboard.io/
├── client/       # React frontend
├── server/       # Node.js / Express backend
└── build-tool/   # Build and deployment-related tooling

High-level flow

┌──────────────────────┐
│      React Client    │
│                      │
│  UI / Canvas / State │
└──────────┬───────────┘
           │
           │ HTTP / REST
           │
           │ WebSockets
           ▼
┌──────────────────────┐
│   Node.js / Express  │
│                      │
│ Auth / API / Sessions│
│ Socket.IO / Business │
│ Logic                │
└───────┬────────┬─────┘
        │        │
        │        │ Socket.IO
        │        ▼
        │   Connected Users
        │
        ▼
┌──────────────────────┐
│       MongoDB        │
│                      │
│ Users / Boards /     │
│ Sessions / Data      │
└──────────────────────┘

The backend uses Express for HTTP APIs and Socket.IO for real-time communication. MongoDB provides persistence, while Express sessions and Passport support authentication and user session handling.

Technology Stack

Frontend

Technology

Purpose

React 17

Application UI

Redux / React Redux

Client-side state management

React Router

Client-side routing

Material UI

UI components

Bootstrap / React Bootstrap

Layout and UI utilities

Socket.IO Client

Real-time communication

Axios

HTTP requests

Formik + Yup

Form handling and validation

Backend

Technology

Purpose

Node.js

Server-side runtime

Express

HTTP server and API layer

Socket.IO

Real-time communication

MongoDB

Persistent data storage

Passport

Authentication

Express Session

Session management

Connect Mongo

MongoDB-backed session storage

bcrypt

Password hashing

Helmet

HTTP security middleware

CORS

Cross-origin request configuration

dotenv

Environment-based configuration

Deployment

The production application is deployed to Google Cloud Platform using App Engine with a custom domain.

The repository's original deployment configuration is designed around a cloud-hosted Node.js application and a separately built React frontend.

Core Features

Real-Time Collaboration

Socket.IO provides the communication layer required for users to interact with the same whiteboard while connected to the application.

Changes can be transmitted between connected clients without requiring users to refresh the page.

Whiteboard Management

Users can:

Create whiteboards

Open existing whiteboards

Rename boards

Share boards through URLs

See other active users on a board

Authentication

The application includes account-based authentication using Passport and Express sessions.

Authentication-related functionality includes:

Local email/password authentication

Guest access

Password verification

Session-based authentication

Session persistence through MongoDB

Passwords are handled through bcrypt rather than storing plaintext passwords.

Persistent Data

MongoDB is used as the application's persistence layer.

The server accesses MongoDB through an environment-provided connection string rather than embedding database credentials directly in application code.

Production Middleware

The backend uses middleware for several production concerns, including:

Helmet security headers

CORS configuration

Compression

Cookie parsing

Session management

JSON request parsing

Security & Configuration

Sensitive configuration is intentionally kept outside the repository.

The application reads environment variables for values such as:

DB_URI
SESSION_SECRET
REACT_APP_BASE_URL
PORT
NODE_ENV

Create a local .env file for development rather than committing credentials to source control.

Example:

DB_URI=<your-mongodb-connection-string>
SESSION_SECRET=<your-random-session-secret>
REACT_APP_BASE_URL=http://localhost:3000
NODE_ENV=development
PORT=8080

Never commit real database credentials, session secrets, private keys, API secrets, or other credentials to the repository.

The repository's .gitignore excludes .env and .env.* files from version control.

Running Locally

Prerequisites

You will need:

Node.js 16.x

npm

MongoDB

Git

The backend currently specifies Node.js 16.13.1 in its package configuration.

1. Clone the repository

git clone https://github.com/Kyle-Kerlew/whiteboard.io.git
cd whiteboard.io

2. Configure the server

Create:

server/.env

Add your local configuration:

DB_URI=<your-mongodb-connection-string>
SESSION_SECRET=<your-session-secret>
REACT_APP_BASE_URL=http://localhost:3000
NODE_ENV=development
PORT=8080

3. Install backend dependencies

cd server
npm install

4. Start the backend

npm start

The backend listens on port 8080 by default.

5. Install frontend dependencies

Open another terminal:

cd client
npm install

6. Start the React development server

npm run dev

The frontend development server will start using the Create React App development tooling.

Project Structure

client/
├── public/
└── src/
    ├── components/
    ├── containers/
    ├── redux/
    ├── services/
    └── ...

server/
├── configuration/
│   └── passportConfig.js
├── persistence/
│   └── connections/
│       └── mongodb.js
├── rest/
│   └── controller/
├── service/
├── socket/
│   └── socketHandler
├── app.js
└── package.json

The backend is separated into application concerns such as REST controllers, services, persistence, authentication configuration, and Socket.IO communication.

This separation makes the project easier to extend without placing all application logic inside a single server file.

Technical Highlights

This project demonstrates experience with several areas that commonly appear in professional full-stack development:

Full-stack development
Designed and implemented both the React client and Node.js backend.

Real-time systems
Used Socket.IO to establish persistent communication between connected users and synchronize collaborative activity.

Authentication
Implemented Passport-based authentication with local and guest strategies.

Session management
Used Express Session with MongoDB-backed session storage so sessions can persist beyond an individual server process.

Database integration
Built a MongoDB persistence layer for application data and sessions.

State management
Used Redux to manage client-side application state.

API development
Structured backend functionality around REST controllers and services.

Cloud deployment
Deployed the application to Google Cloud Platform App Engine with a custom domain.

Security-conscious configuration
Used environment variables for credentials and secrets, Helmet for HTTP security headers, secure production cookies, and CORS configuration.

Production Application

The application is available at:

https://whiteboard.kylekerlew.com

The live deployment provides a working example of the application architecture represented in this repository.

Project Status

Whiteboard.IO is a portfolio project demonstrating full-stack application development and real-time collaboration.

The project is not intended to compete with feature-heavy commercial whiteboard platforms. Its purpose is to demonstrate the engineering required to build a multi-user application from the frontend through the backend, database, authentication, real-time communication, and cloud deployment layers.

Author

Kyle Kerlew

Software Engineer specializing in full-stack web application development, backend systems, cloud technologies, and modern JavaScript applications.

GitHub: https://github.com/Kyle-Kerlew

LinkedIn: https://www.linkedin.com/in/kylekerlew/

Portfolio: https://kylekerlew.com
