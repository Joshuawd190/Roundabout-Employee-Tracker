const inquirer = require('inquirer');
const db = require('../db/connection');
const inputCheck = require('../utils/inputCheck');

class App {
  initApp() {
    db.promise()
      .connect()
      .then(() => {
        console.log('Database connected.');
      })
      .then(() => {
        console.log(`
    ==========================================
    Welcome to the Roundabout Employee Tracker
    ==========================================
    `);
      })
      .then(() => {
        this.topMenu();
      });
  }

  topMenu() {
    console.log(`
      
      `);
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
          { name: 'Add an employee role', value: 'addRole' },
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
    this.getData('getDeps')
      .then(([rows]) => {
        console.log(`

      ================
      `);
        console.table(rows);
      })
      .then(() => {
        this.topMenu();
      });
  }
  showEmployees() {
    this.getData('getEmployees')
      .then(([rows]) => {
        console.log(`
        
      ================
      `);
        console.table(rows);
      })
      .then(() => {
        this.topMenu();
      });
  }
  showRoles() {
    this.getData('getRoles')
      .then(([rows]) => {
        console.log(`
      
    ================
    `);
        console.table(rows);
      })
      .then(() => {
        this.topMenu();
      });
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
        db.promise()
          .query(sql, params)
          .then(() =>
            console.log(`
        Department Added.
        `)
          );
      })
      .then(() => {
        return this.topMenu();
      });
    //set data to database
  }
  addRole() {
    //get data about department ids
    this.getData('getDeps')
      .then(([rows]) => {
        const list = rows.map(({ dep_name, id }) => {
          return { name: dep_name, value: id };
        });
        return list;
      })
      .then((list) => {
        //inquirer input
        return inquirer.prompt([
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
            name: 'dep_id',
            choices: list,
            message: 'Which department does this role belong to?',
          },
        ]);
      })
      .then((data) => {
        const sql = this.getQuery('addRole');
        //validate data
        const errors = inputCheck(data, 'dep_id', 'salary', 'title');
        if (errors) {
          console.log(errors);
          return this.topMenu();
        }

        const params = [data.title, data.salary, data.dep_id];
        db.promise()
          .query(sql, params)
          .then(() =>
            console.log(`
        Role Added.
        `)
          )
          .then(() => {
            return this.topMenu();
          })
          .catch((err) => console.log(err));
      });
  }
  addEmployee() {
    this.getData('getRoles')
      .then(([rows]) => {
        const list = rows.map(({ title, id }) => {
          return { name: title, value: id };
        });
        return list;
      })
      .then((list) => {
        //inquirer input
        return inquirer.prompt([
          {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of this employee?',
          },
          {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of this employee?',
          },
          {
            type: 'list',
            name: 'role_id',
            choices: list,
            message: 'What role does this employee perform?',
          },
        ]);
      })
      .then((data) => {
        const sql = this.getQuery('setEmployee');
        //validate data
        const errors = inputCheck(data, 'role_id', 'first_name', 'last_name');
        if (errors) {
          console.log(errors);
          return this.topMenu();
        }

        const params = [
          data.first_name,
          data.last_name,
          data.role_id,
          managerData,
        ];
        db.promise()
          .query(sql, params)
          .then(() =>
            console.log(`
          Employee Added.
          `)
          )
          .then(() => {
            return this.topMenu();
          })
          .catch((err) => console.log(err));
      });
  }
  updateRole() {
    //inquirer input
    //get data of employee to update
    //set data to database
  }
  addManager() {
    this.getData('getEmployees')
      .then(([rows]) => {
        const list = rows.map(({ first_name, id }) => {
          return { name: first_name, value: id };
        });
        return list;
      })
      .then((list) => {
        return inquirer
          .prompt([
            {
              type: 'list',
              name: 'employee_id',
              choices: list,
              message: 'Add a manager to who?',
            },
            {
              type: 'list',
              name: 'manager_id',
              choices: list,
              message: 'Which employee is the manager?',
            },
          ])
          .then((data) => {
            return db
              .promise()
              .query(
                `UPDATE employees SET manager_id=${data.manager_id} WHERE id=${data.employee_id}`
              );
          })
          .then(() => {
            return this.topMenu();
          })
          .catch((err) => console.log(err));
      });
  }
  getData(query) {
    //take in query to determine type
    const sql = this.getQuery(query);
    //query database
    return db
      .promise()
      .query(sql)
      .catch((err) => console.log(err));
  }
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
      case 'addRole':
        return `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
      case 'addManager':
        return `INSERT INTO employees (manager_id) VALUES (?)`;
    }
  }
}

module.exports = App;
