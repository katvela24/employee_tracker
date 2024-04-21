CREATE DATABASE if not exists employee_db;

use employee_db;

CREATE TABLE department (
id int not null auto_increment primary key,
name VARCHAR(30)
);

CREATE table role(
id int not null auto_increment primary key,
title VARCHAR(30),
salary decimal,
department_id int not null,
foreign key (department_id) references department(id)
);

CREATE table employee(
id int not null auto_increment primary key,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT not null,
manager_id int,
foreign key (id) references department(id),
foreign key (role_id) references role(id)
);