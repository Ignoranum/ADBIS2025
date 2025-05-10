-- Drop existing tables if they exist to avoid conflicts during creation
DROP TABLE IF EXISTS Logs;
DROP TABLE IF EXISTS UsersCheckedIn;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Worklog;
DROP TABLE IF EXISTS Customers;

-- Create Customers table to store customer details
CREATE TABLE Customers (
    customerId INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for each customer
    name TEXT NOT NULL, -- Name of the customer
    email TEXT UNIQUE NOT NULL, -- Unique email of the customer
    phoneNumber TEXT, -- Contact number of the customer
    address TEXT -- Address of the customer
);

-- Create Worklog table to store Worklog details
CREATE TABLE Worklog (
    worklogId INTEGER PRIMARY KEY AUTOINCREMENT,
    checkInTime TEXT,
    checkOutTime TEXT,
    checkingIn INTEGER DEFAULT 0,
    longitude REAL,
    latitude REAL
);

-- Create Users table to store user user details
CREATE TABLE Users (
    userId INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for each user
    name TEXT UNIQUE NOT NULL, -- Unique name of the user
    email TEXT UNIQUE NOT NULL, -- Unique email of the user
    password TEXT NOT NULL, -- Password for the user account
    phoneNumber TEXT -- Contact number of the user
);

-- Create table for users checking in
CREATE TABLE UsersCheckedIn (
    worklogId INTEGER,
    userId INTEGER,
    PRIMARY KEY (worklogId, userId), -- Composite primary key
    FOREIGN KEY (worklogId) REFERENCES Worklog(worklogId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);

-- Create Logs table to store log details for user activities
CREATE TABLE Logs (
    logId INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for each log entry
    logTime TEXT DEFAULT (datetime('now')), -- Timestamp of the log entry
    userId INTEGER NOT NULL, -- Foreign key referencing Users table
    MFA INTEGER NOT NULL, -- Multi-Factor Authentication status (0 for FALSE, 1 for TRUE)
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE -- Cascade delete if the user is deleted
);