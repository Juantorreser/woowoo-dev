# BACK END

## Introduction
The `backend` folder contains the files for the API. The API is relatively simple and is built using Express, Sequelize, and MySQL. *You must ensure the XAMPP is running before trying to initialize the database*. 

## Table Of Contents

*BACKEND*

TEch Stack
    ↳ [Express](#Express)
    ↳ [MySQL](#MySQL)
    ↳ [Sequelize](#Sequelize)

Documentation
    ↳ [Setup](#Setup)
    ↳ [To Do](#To-Do)
    ↳ [Adding To The Api](#Adding-To-The-API)

Folder Structure
    ↳ [Config](#Config)
    ↳ [Controllers](#Controllers)
    ↳ [Middleware](#Middleware)
    ↳ [Models](#Models)
    ↳ [Routes](#Routes)
    ↳ [Booking](#Booking)
    ↳ [Public](#Public)
    

## TECH STACK

### Express
#### Overview
*Express.js* is used to create the backend server that the fronend communicates with. This server listens on port *localhost:8080* on this DEV enviroment. Ensure that this port is not the same port the frontend is using. ALso ensure that the frontend is sending requests to this port when it attempts to retrieve data from the API. 

#### Configuring the Express.js server
To change the server port and listening ports for the backend edit the **corsOptions** and **PORT** variables in the [server.js](/App/Backend/server.js) file. 

#### Adding To The API
Adding new tables to the SQL database will mean you will need to update the routes for the API. This has a cascade effect. Small and simple changes must be made to several files> Don't fret they're easy to make, adding new tables and defining their routes is simple. But it is time consuming. Details on how to do so require their own section highlighted [here](#Adding-To-The-API)

### MySQL 
The relational SQL database is populated by the the SEQUELIZE models defined in the [/models](/App/Backend/app/models) folder.  We focused on creating an effecient relational model using good design principles that minimize table redundency and NULL values. The model is consistent and seems to be without error at the moment. Improvements can be made. 

UML Diagram Database was built using
![](../../Documentation/COSC499/uml/updated_database.png)

### Sequelize 
The relational SQL database is populated by the the SEQUALIZE models defined in the [/models](/App/Backend/app/models) folder.  We focused on creating an effecient relational model using good design principles that minimize table redundency and NULL values. The model is consistent and seems to be without error at the moment. Improvements can be made. 

## Documentation

### Development Setup 
1) Download/Install XAMPP from https://www.apachefriends.org/ 
2) Download/Install MySQL from https://dev.mysql.com/downloads/installer/ 
3) Download/Install MySQL Workbench from https://dev.mysql.com/downloads/workbench/)
4) Create the dev connection as follows: 
    4a) Setup New Connection
    4b) Connection Name: woowoodev, all others default values (ensure port 3306)
5) Start XAMPP. Ensure MYSQL is enabled. 
6) in the root folder, launch "launch backend.bat"
7) *Optional: Test Endpoints using either the frontEnd or [Postman](/Testing)*

NOTE: Frontend and Backend must not be on the same port. If you start the backend first, ensure it is on any port but localhost:4200. 

## To Do
1) Adding additional tables outlined in the [UML DIAGRAM](../../Documentation/uml/updated_database.png) diagram that are required to enable features like reviews
2) Connect the Booking/Scheduling/Availability/Payment APIS selected by 2 teams responsible for those goals

## Adding To The Api
To Add to the API follow these Step by step instructions

1) Add `require("./app/routes/[TABLE-NAME].routes")(app);` to [server.js](/App/Backend/server.js) 
2) Add routes to [/app/routes](/App/Backend/app/routes/api-router.js). 
3) Referencing other routes, document the appropriate API endpoints for the date users will retrieve from the new table in the newly created `[TABLE-NAME].routes.js` file from step 2
4) Add `[TABLE-NAME].model.js` file to the [/app/models](/App/Backend/app/models) folder. 
5) Referencing other `.models.js` files, define the sequelize model that will ultimately go on to automatically create your new table in the database in the `[TABLE-NAME].model.js`file created in step 4
6) Add `[TABLE-NAME].controller.js` file to the [/app/controllers](/App/Backend/app/controllers) folder. 
7) Referencing other `.controller.js` files, create a controller that defines the actions performed by the API when calls are made to the endpoints you defined in step 2 in the `[TABLE-NAME].controller.js`file created in step 6. *This controller is where your SQL queries are defined*

## Folder Structure

### Config 
- `db.config.js`: where the MySQL connection and authentication data is defined for use
- `google.config.js`: where the GOOGLE MAPS API token is stored 

### Controllers
- Controllers for every table in the database. Each controller is where queries used to access the table's data is defined. 
### Middleware
-  `geocoding.js`: The module designed to handle all backend requests sent to the GOOGLE MAPS API. It performs geocoding from the addresses submitted by users. 
-  `imageHandler.js`: The module designed to handle all image uploads made my users. It performs image verification for image size and file type. It saves the approved uploaded images in the [/Backend/public/imgs](/App/Backend/public/imgs) folder. 

### Models
- Table models for every table in the database. Each model defines the structure of a given table in the database. 
### Routes
- Each Route file documents the endpoints of the API, allowing users the ability to make well-formed requests to the server. 
### Booking 
The users will book appointments on a third-party API widget. They will have the abilities to select the services of their choice, the time frame they desired and some personal information for further contact. 

### Public
- The location of images and other public files the frontend require that the backend stores




