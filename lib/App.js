const inquirer = require('inquirer');
const queries = require('../utils/queries');
const validator = require('../utils/inputCheck');

class App {
  initApp() {
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
    const departments = this.getData();
    console.table(departments);
    this.topMenu();
  }
  showEmployees() {
    const employees = this.getData();
    console.table(employees);
    this.topMenu();
  }
  showRoles() {
    const roles = this.getData();
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
    //query database
    //return data
  }
  setData(data, query) {
    //take in query to determine what to update
    //validate data
    //update database with new data
  }
}

module.exports = App;
