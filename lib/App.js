const inquirer = require('inquirer');

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
  showDeps() {}
  showEmployees() {}
  showRoles() {}
  addDep() {}
  addEmployee() {}
  updateRole() {}
  getData(query) {}
  setData(data, query) {}
}

module.exports = App;
