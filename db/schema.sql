DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

CREATE table department (
id serial primary key,
name VARCHAR(30)
);

CREATE table role(
id serial primary key,
title VARCHAR(30),
salary decimal,
department_id int references department(id)
);

CREATE table employee(
id serial primary key,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT references role(id),
manager_id int references employee(id)
);
