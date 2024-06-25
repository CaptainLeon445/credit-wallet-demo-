# Credit wallet demo application
This repository contains all the business logics and API endpoints for the credit wallet demo application.


A comprehensive documentation for building server-side application for credit wallet demo application with Express.js, Postgresql, Knex and TypeScript.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [DOCUMENTATION](#documentation)
  



## Introduction

This project implements a basic wallet service for a mobile lending app using NodeJS, TypeScript, and PostgreSQL.
This documentation provides the guidelines in cloning the repository and running the codes on your local machine.

## Features

- Create an account
- Fund account
- Transfer funds to another user’s account
- Withdraw funds from account
- Prevent users in the Lendsqr Adjutor Karma blacklist from onboarding

## Technologies

- NodeJS (LTS version)
- TypeScript
- KnexJS ORM
- PostgresSQL database

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

  * The API documentation is available on [credit wallet API endpoints] (https://christopher-ifeoluwa-oni-lendsqr-be-test.onrender.com/api-docs)

  