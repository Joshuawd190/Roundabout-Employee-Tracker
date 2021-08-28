INSERT INTO departments
    (dep_name)
VALUES
    ('Sales'),
    ('Dev'),
    ('Ops'),
    ('Managment'),
    ('Executive');

INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('Seller', "10.00", "1"),
    ('Buyer', "5.00", "1"),
    ('Coder', "15.00", "2"),
    ('Product Manager', "20.00", "3"),
    ('Team Lead', "30.00", "4"),
    ('CEO', "1000.00", "5");


INSERT INTO employees
    (first_name, last_name, role_id)
VALUES
  ('Jack', 'London', '4'),
  ('Robert', 'Bruce', '5'),
  ('Peter', 'Greenaway', '3'),
  ('Derek', 'Jarman', '1'),
  ('Paolo', 'Pasolini', '2');
    
