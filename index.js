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
  const [rows] = await connection.query("select employee.id, first_name, last_name, title from employee inner join role on role_id = role.id");
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
  const { firstName, lastName } = await inquirer.prompt([{
    name: "firstName",
    type: "input",
    message: "What is the employee's first name?",
  },

  {
    name: "lastName",
    type: "input",
    message: "What is the employee's last name?",
  }


  ])
  const [roleRows] = await connection.query("select * from role");

  const { title } = await inquirer.prompt([{
    name: "title",
    type: "list",
    message: "What role will this employee have?",
    // using the .map method to generate an array of just the row titles
    choices: roleRows.map((role) => role.title)
  }
  ])

  const [employeeRows] = await connection.query("select * from employee");

  const { manager } = await inquirer.prompt([{
    name: "manager",
    type: "list",
    message: "Who will the employee report to?",
    choices: employeeRows.map((employee) => employee.first_name + " " + employee.last_name)
  }
  ])

  // This line uses a .find against the database results rows and it finds the row that name property equals the name the user chose
  // It also extracts the id that we need to complete the table insertion

  const { id: roleId } = roleRows.find((row) => row.title === title);
  const { id: managerId } = employeeRows.find((row) => row.first_name + " " + row.last_name === manager);
  const [result] = await connection.query("insert into employee (first_name, last_name, role_id, manager_id) values (?,?,?,?)", [firstName, lastName, roleId, managerId])
  console.log(`successfully added employee: ${firstName} ${lastName}`);
}

const updateAnEmployeeRole = async () => {
  const [employeeRows] = await connection.query("select * from employee")
  const [roleRows] = await connection.query("select * from role")

  const { employee, title } = await inquirer.prompt([{
    type: "list",
    name: "employee",
    message: "Which employee would you like to update?",
    choices: employeeRows.map((employee) => employee.first_name + " " + employee.last_name)
  },

  {
    type: "list",
    name: "title",
    message: "What will the employee's new title be?",
    choices: roleRows.map((role) => role.title)

  }

  ])
  const { id: roleId } = roleRows.find((row) => row.title === title);
  const { id } = employeeRows.find((row) => row.first_name + " " + row.last_name === employee);

const [result] = await connection.query("update employee set role_id = ? where id = ?", [roleId, id])
console.log(`Updated employee: ${employee} to role: ${title}`);


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

      case "update an employee role":
      await updateAnEmployeeRole();
      break;

    default:
      process.exit();

  }
  // This brings the menu back
  startWizard();

}
connect_db();
