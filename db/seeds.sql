insert INTO department (name) 
VALUES
('hr'), 
('engineering'), 
('product dev'), 
('design');

insert INTO role (title, salary, department_id) 
values
('coordinator', 60000, 1),
('generalist', 90000, 1),
('lead engineer', 100000, 2),
('vp engineer', 150000, 2),
('lead product developer', 80000, 3),
('project manager', 110000, 3),
('lead design', 70000, 4),
('graphic manager', 100000, 4);


insert INTO employee (first_name, last_name, role_id, manager_id) 
values
('James', 'Franco', 4, null),
('Peter', 'Ross', 3, 1);
