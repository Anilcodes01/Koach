
# Koach - User Management API

The Koach User Management API provides functionality for managing user accounts, authentication, and profile management. It allows users to register, log in, update their profile, and delete their account. The API uses JWT-based authentication for secure access.

## Features

- **User Registration**: Allows users to create a new account with a name, email, and password.
- **User Login**: Authenticates users with email and password, providing a JWT for secure access to protected routes.
- **User Profile**: Retrieve and update the authenticated user's profile information.
- **Account Deletion**: Allows users to delete their account.
- **JWT Authentication**: The API uses JWTs to secure the endpoints, ensuring only authorized users can access protected routes.

## API Documentation

The API documentation is available via Swagger UI at the following endpoint:


This UI provides interactive access to all available endpoints, request parameters, and responses.

## Requirements

Before you can run the API, you need to install the following dependencies:

- [Node.js](https://nodejs.org/en/) (v14.x or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) or another supported database

## Endpoints

### Authentication

#### Register a new user
-   **POST** `/api/users/register`


#### User Login

-   **POST** `/api/users/login`


### Profile

#### Get User Profile

-   **GET** `/api/users/profile`
-   **Security**: Requires Bearer Authentication


#### Update User Profile

-   **PUT** `/api/users/profile`
-   **Security**: Requires Bearer Authentication


#### Delete User Profile

-   **DELETE** `/api/users/profile`
-   **Security**: Requires Bearer Authentication


## Security

The API uses **JWT** for authentication. The `BearerAuth` security scheme is used for all protected routes. To access protected routes, include the JWT token in the `Authorization` header of your requests.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Anilcodes01/Koach.git
   cd koach-api
2. Install dependencies
   ```bash
   npm install
3. Create a `.env` file to configure environment variables
      ```bash
   touch .env
4. Add the following content to `.env` (adjust values as needed)
      ```bash
      PORT=3000 
      MONGODB_URI=mongodb://localhost:27017/koach-db 
      JWT_SECRET=your-jwt-secret
5. Run the application
     ```bash
     npm run dev
## License

This project is licensed under the MIT License - see the LICENSE file for details.