const inquirer = require('inquirer');
const queries = require('../utils/queries');
const validator = require('../utils/inputCheck');
const db = require('../db/connection');
const inputCheck = require('../utils/inputCheck');

class App {
  initApp() {
    db.connect((err) => {
      if (err) throw err;
      console.log('Database connected.');
    });
    console.log(`
==========================================
Welcome to the Roundabout Employee Tracker
==========================================
`);

    this.topMenu();
  }

  topMenu() {
    inquirer
      .prompt({
        type: 'list',
        name: 'selection',
        choices: [
          { name: 'View all departments', value: 'deps' },
          { name: 'View all roles', value: 'roles' },
          { name: 'View all employees', value: 'employees' },
          { name: 'Add a department', value: 'addDep' },
          { name: 'Add an employee', value: 'addEmployee' },
          { name: 'Update an employee role', value: 'updateRole' },
        ],
        message: 'What would you like to do?',
      })
      .then((data) => {
        this.nav(data);
      });
  }

  nav(data) {
    switch (data.selection) {
      case 'deps':
        return this.showDeps();
      case 'roles':
        return this.showRoles();
      case 'employees':
        return this.showEmployees();
      case 'addDep':
        return this.addDep();
      case 'addEmployee':
        return this.addEmployee();
      case 'addRole':
        return this.addRole();
      case 'updateRole':
        return this.updateRole();
      default:
        break;
    }
  }
  showDeps() {
    const departments = this.getData('getDeps');
    console.table(departments);
    this.topMenu();
  }
  showEmployees() {
    const employees = this.getData('getEmployees');
    console.table(employees);
    this.topMenu();
  }
  showRoles() {
    const roles = this.getData('getRoles');
    console.table(roles);
    this.topMenu();
  }
  addDep() {
    //inquirer input
    inquirer
      .prompt({
        type: 'input',
        name: 'dep_name',
        message: "What is the name of the department you'd like to add?",
      })
      .then((data) => {
        const sql = this.getQuery('setDep');
        //validate data
        const errors = inputCheck(data, 'dep_name');
        if (errors) {
          console.log(errors);
          return this.topMenu();
        }
        const params = [data.dep_name];
        db.query(sql, params, (err, result) => {
          if (err) throw err;
          return result;
        });
      })
      .then(() => {
        return this.topMenu();
      });
    //set data to database
  }
  addRole() {
    //get data about department ids
    const departments = this.getData('getDeps');
    const list = departments.map(({ dep_name, id }) => {
      return { name: dep_name, value: id };
    });

    //inquirer input
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'What is the name of this role?',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary for this role?',
        },
        {
          type: 'list',
          choices: list,
          message: 'Which department does this role belong to?',
        },
      ])
      .then();
    //error checking?
    //set data to database
  }
  addEmployee() {
    //inquirer input
    //get ids of input fields
    //error check if exists
    //set data to database
  }
  updateRole() {
    //inquirer input
    //get data of employee to update
    //set data to database
  }
  getData(query) {
    //take in query to determine type
    const sql = this.getQuery(query);
    //query database
    const data = db.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
      }
      return rows;
    });
    //return data
    return data;
  }
  //   setData(data, query) {
  //     //take in query to determine what to update
  //     const sql = this.getQuery(query);
  //     //validate data
  //     const errors = inputCheck(data, );
  //     if (errors) {
  //         console.log(errors);
  //         return this.topMenu();
  //     }
  //     const params = [
  //         data.dep_name
  //     ]
  //     const data = db.query(sql, params, (err, result) =>{
  //         if (err) throw err;
  //         return result;
  //     })
  //     //update database with new data
  //   }
  getQuery(query) {
    switch (query) {
      case 'getDeps':
        //query for getting departments
        return `SELECT * FROM departments`;
      case 'getEmployees':
        //query for getting employees
        return `SELECT employees.id AS id, employees.first_name, employees.last_name, title, dep_name AS department, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees m ON m.manager_id = employees.id`;
      case 'getRoles':
        //query for getting roles
        return `SELECT title, roles.id, dep_name AS department, salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id`;
      case 'setDep':
        return `INSERT INTO departments (dep_name) VALUES (?)`;
      case 'setEmployee':
        return `INSERT INTO employees (first_name, last_name, role_id) VALUES (?,?,?)`;
    }
  }
}

module.exports = App;
