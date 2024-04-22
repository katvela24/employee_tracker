const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
let connection;
require("dotenv").config()

const connect_db = async () => {
  try {
    connection = await mysql.createConnection(
      `mysql://root:${process.env.DATABASE_PASSWORD}@localhost:3306/employee_db`
    );
    console.log("connected")
    startWizard()
  } catch (err) {
    console.log(err);
  }
}
const viewAllDepartments = async () => {
  const [rows] = await connection.query("select * from department");
  console.table(rows);
}

const viewAllRoles = async () => {
  const [rows] = await connection.query("select * from role");
  console.table(rows);
}

const viewAllEmployees = async () => {
  const [rows] = await connection.query("select * from employee");
  console.table(rows);
}

const addADepartment = async () => {
  const { department } = await inquirer.prompt([{
    name: "department",
    type: "input",
    message: "What department do you want to add",
  }])

  const [result] = await connection.query(`insert into department (name) values ("${department}")`);
  // console.table(rows);
  console.log(`Successfully added department: ${department}`);
}

const addARole = async () => {
  const [rows] = await connection.query("select * from department");


  const { department, title, salary } = await inquirer.prompt([{
    name: "department",
    type: "list",
    message: "What department do you want to add a role to?",
    choices: rows
  }, {
    name: "title",
    type: "input",
    message: "What role would you like to add",
  }, {
    name: "salary",
    type: "input",
    message: "What salary will this role have?",
  }
  ])
  // This line uses a .find against the database results rows and it finds the row that name property equals the name the user chose
  // It also extracts the id that we need to complete the table insertion
  const { id } = rows.find((row) => row.name === department);

  const [result] = await connection.query("insert into role (title,salary,department_id) values (?,?,?)", [title, parseInt(salary), id]);
  console.log(`Role successfully added: ${title}`);
}

const addAnEmployee = async () => {
  const [rows] = await connection.query("select * from department");

  const { department } = await inquirer.prompt([{
    name: "department",
    type: "list",
    message: "What department do you want to add an employee to?",
    choices: rows
  }
  ])

  // This line uses a .find against the database results rows and it finds the row that name property equals the name the user chose
  // It also extracts the id that we need to complete the table insertion
  const { id } = rows.find((row) => row.name === department);
  console.log(id);

  const [roleRows] = await connection.query("select * from role where `department_id` = ?",[parseInt(id)]);
  const { title } = await inquirer.prompt([{
    name: "title",
    type: "list",
    message: "What role will this employee have?",
    choices: roleRows
  }
  ])
  // const [result] = await connection.query("insert into role (title,salary,department_id) values (?,?,?)", [title, parseInt(salary), id]);
  // console.log(`Role successfully added: ${title}`);
  console.log(roleRows);
}

const startWizard = async () => {
  let rows;
  const { action } = await inquirer.prompt([{
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "Exit"],
  }])

  //Switch statement 
  switch (action) {
    case "view all departments":
      await viewAllDepartments();
      break;

    case "view all roles":
      await viewAllRoles();
      break;

    case "view all employees":
      await viewAllEmployees();
      break;

    case "add a department":
      await addADepartment();
      break;

    case "add a role":
      await addARole();
      break;

    case "add an employee":
      await addAnEmployee();
      break;

    default:
      process.exit();

  }
  // This brings the menu back
  startWizard();

}
connect_db();
