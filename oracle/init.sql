-- This script is run when the container starts for the first time.
-- It creates a new user and grants it the necessary permissions
-- for the Laravel application to connect and manage its schema.

-- In modern Oracle versions, creating users requires a special session setting.
ALTER SESSION SET "_ORACLE_SCRIPT"=true;

-- 1. Create the user for Laravel. Replace 'password' with a strong password.
CREATE USER ECOM_PROJECT IDENTIFIED BY 1212;

-- 2. Grant the user essential privileges.
--    'CONNECT' allows the user to connect to the database.
--    'RESOURCE' allows the user to create objects like tables, triggers, etc.
GRANT CONNECT, RESOURCE TO ECOM_PROJECT;

-- 3. Grant unlimited tablespace quota to the user.
--    This allows the user to store data in the database without a size limit.
GRANT UNLIMITED TABLESPACE TO ECOM_PROJECT;
