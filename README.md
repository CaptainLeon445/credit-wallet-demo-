# Credit wallet demo application
This repository contains all the business logics and API endpoints for the credit wallet demo application.


A comprehensive documentation for building server-side application for credit wallet demo application with Express.js, Postgresql, Knex and TypeScript.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [DOCUMENTATION](#documentation)
  



## Introduction


This documentation provides the guidelines in cloning the repository and running the codes on your local machine. 

## Features

- Express.js for handling HTTP requests.
- TypeScript for type safety and enhanced developer experience.
- Customizable project structure with clear separation of concerns.
- Configurable environment variables using `.env.example` file.
- Pre-configured logging and error handling middleware.
- Includes common dependencies such as `dotenv`, `Joi`, `Typescript`, `pg`, `knex` for database interactions, and others.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- Basic knowledge of TypeScript and Express.js.

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CaptainLeon445/credit-wallet-demo-.git
   cd credit-wallet-demo-
   
2. Install dependencies
   ```bash
   npm install


### Running the Development Server

1. Runs the application in development mode

   ```bash
   npm run dev

2. Open Browser or Postman

  * Open your browser to [http://localhost:3000](http://localhost:3000)
  * Invoke the `/` endpoint
  ```shell
  curl http://localhost:3000/
  ```
  * The `/api-docs` endpoint is for the swagger UI
  ```shell
  curl http://localhost:3000/api-docs
  ```
 
  * Check the routes files to get the other resource

### DOCUMENTATION

  * The API documentation is available on [credit wallet API endpoints] ()

  