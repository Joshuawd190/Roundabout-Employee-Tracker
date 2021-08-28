const inquirer = require('inquirer');
const queries = require('../utils/queries');
const validator = require('../utils/inputCheck');
const db = require('../db/connection');

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
    //set data to database
  }
  addEmployee() {
    //inquirer input
    //set data to database
  }
  updateRole() {
    //inquirer input
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
  setData(data, query) {
    //take in query to determine what to update
    //validate data
    //update database with new data
  }
  getQuery(query) {
    switch (query) {
      case 'getDeps':
        //query for getting departments
        return `SELECT * FROM departments`;
      case 'getEmployees':
        //query for getting employees
        return 'SELECT id, first_name, last_name, title, dep_name, salary, manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employees m ON m.manager_id = employees.id';
      case 'getRoles':
        //query for getting roles
        return 'SELECT title, id, dep_name, salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id';
    }
  }
}

module.exports = App;
