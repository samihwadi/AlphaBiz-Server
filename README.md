# BizPoints Backend - Client Registration & Authentication System

This repository contains the backend code for the **Client Registration & Authentication System** of the BizPoints loyalty portal. The system is designed to handle client registration, authentication, and role-based access control (RBAC), providing secure access to the loyalty features available in the BizPoints platform. Built with **Node.js**, **Express**, and **MongoDB**, this sub-project serves as the core access layer for clients and admins alike.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Security and Data Protection](#security-and-data-protection)
- [License](#license)

## Features

1. **Client Registration**: Allows clients to sign up securely and create accounts for the loyalty program.
2. **Authentication**: Provides secure login mechanisms using JWT (JSON Web Tokens).
3. **Role-Based Access Control (RBAC)**: Enables different levels of access based on user roles (e.g., client, admin).
4. **Seamless Integration**: Easily connects with other BizPoints components to create a unified experience.
5. **Data Security**: Ensures client data protection through encryption and secure handling of credentials.

## Technologies Used

- **Node.js** - Server environment
- **Express** - Web framework for Node.js
- **MongoDB** - NoSQL database to store client and authentication data
- **Mongoose** - ODM for MongoDB
- **JSON Web Tokens (JWT)** - For secure client authentication and session management
- **Bcrypt** - Password hashing for enhanced security

## Security and Data Protection

- **Password Encryption**: Uses `bcrypt` for hashing client passwords, ensuring that sensitive data is securely stored.
- **JWT Authentication**: Employs JSON Web Tokens (JWT) for secure and stateless client authentication, maintaining session integrity.
- **Role-Based Access Control (RBAC)**: Protects sensitive routes by assigning permissions based on user roles, allowing access only to authorized users.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
