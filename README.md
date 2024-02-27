# Web Application for Business User Content Management

## Overview

The Holy Items Website is an e-commerce platform specializing in sacred religious artifacts. Users can browse, add products to their cart, and place orders. Additionally, the platform offers an admin interface for managing inventory, users, products, and more.
The application incorporates a variety of features and functionalities tailored to enhance user experience and content management.

## Features

### Main Interface

-**User Authentication**: Secure user authentication system allowing users to sign up, log in, and manage their accounts.

- **Product Management**: Comprehensive product management system enabling administrators to add, edit, and delete products from the inventory.
- **Content Display Page**: A central page that displays content dynamically.
- **Login System**: Includes access to a management interface for content control.
- **Server-Side Content Storage**: Ensures safe and efficient storage of content data.
- **Order Processing**: Smooth order processing functionality allowing users to add items to their cart, review their orders, and complete transactions .
- - **Inventory Management**: Inventory management system for administrators to monitor inventory levels, track product availability and update inventory as needed.
- **User Management**: Administrative control panel for managing user accounts, permissions, and access levels. Users are allowed three login attempts with an incorrect password. After three failed attempts, the user account is automatically locked for 24 hours. Additionally, there is an option for users to reset their password by a verification email.
- **Logout**: Allows the application/website to log out the user if inactive for more than 4 hours, enhancing security and privacy.
- **Request Rate Limiting**: Restricts the number of requests a user can make to the server within a 24-hour period to protect the server from attacks aimed at slowing down or crashing it.
- **Contact Form (Formspree)**: Users can send messages through a contact form using a service like Formspree to establish communication with the website or application.

### User Interaction

- **Dynamic Navigation Menus**: Navigation menus vary depending on the user type, including regular users, business users, and admin. A business user is essentially a user logged into the website with a registered account.
- **Search Field in Navigation Menu**: For easy access and searchability.
- **Dark Mode Toggle**: Allows users to switch between light and dark display modes.

### Forms and Verification

- **Forms with verification**: ensures the integrity of the data before sending the form.
- **Feedback on CRUD operations**: Alerts users to the success or failure of their operations.
- **Card creation form**: for adding new content.
- **Card editing form**: Allows admin to change existing content.

### Product management (administrator only)

- **Product editing and deletion**: System administrators can edit or delete products (tickets) from the system.
- **Business User Functionality**:
  - **Favorites Management**: Registered business users can add items to their favorites list and remove them.
  - **Interaction with shopping cart**: Normal or business(registered) user can add items to their shopping cart and remove them.
  - **Likes**:An admin user can see next to each product the amount of likes that product received.

### Additional Features

- **User Profile Editing**: Allows logged-in users to modify their personal details.
- **CRM System for Admin Users**: Enables admin-type users to view, edit, and delete user information.

### Popup Notifications

- **SweetAlert2 Integration**: Utilized for elegant and responsive popup messages, enhancing the user interaction with real-time feedback and alerts.

### Technical Aspects

- **HTTP Calls**: Implemented using Axios library for client-server communication.
- **Error Handling**: Utilizes try & catch mechanism for robust error management.
- **Database**: Utilizes MongoDB as the primary database for storing and managing data.

### Design and Aesthetics

- **Responsive Design**: Using Bootstrap library.
- **Icon Usage**: Incorporates icons from Bootstrap .
- **SCSS for Styling**: Ensures a modular and organized approach to CSS.

## Reflection

This project embodies a comprehensive understanding and application of web development techniques, particularly in React.js. It emphasizes clean, organized coding practices, real content usage, and adheres to modern design principles.
