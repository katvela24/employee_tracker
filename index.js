const mysql = require ('mysql2/promise');
require("dotenv").config()

const connect_db = async() => {
    try {
        const connection = await mysql.createConnection(
          `mysql://root:${process.env.DATABASE_PASSWORD}@localhost:3306/employee_db`
        );
        console.log("connected", connection)
    } catch (err) {
      console.log(err);
    }
} 
connect_db();