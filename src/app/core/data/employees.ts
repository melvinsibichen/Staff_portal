import { Employee, ManagedEmployee } from '../models/employee.model';

/**
 * Sample data from Q1. The first three records are the ones given in the task;
 * the rest are extra records so searching and selecting has something to work with.
 */
export const EMPLOYEES: readonly Employee[] = [
  { id: 1, name: 'John Doe', department: 'IT' },
  { id: 2, name: 'Jane Smith', department: 'HR' },
  { id: 3, name: 'David Miller', department: 'Finance' },
  { id: 4, name: 'Priya Nair', department: 'IT' },
  { id: 5, name: 'Michael Brown', department: 'Sales' },
  { id: 6, name: 'Aisha Khan', department: 'Marketing' },
  { id: 7, name: 'Carlos Garcia', department: 'Finance' },
  { id: 8, name: 'Emily Johnson', department: 'HR' },
  { id: 9, name: 'Rahul Menon', department: 'IT' },
  { id: 10, name: 'Sophie Martin', department: 'Operations' },
];

/** Starting data for the Q3 CRUD page (Employee ID, Employee Name, Department, Email). */
export const INITIAL_MANAGED_EMPLOYEES: readonly ManagedEmployee[] = [
  { id: 101, name: 'John Doe', department: 'IT', email: 'john.doe@company.com' },
  { id: 102, name: 'Jane Smith', department: 'HR', email: 'jane.smith@company.com' },
  { id: 103, name: 'David Miller', department: 'Finance', email: 'david.miller@company.com' },
];

export const DEPARTMENTS: readonly string[] = [
  'IT',
  'HR',
  'Finance',
  'Sales',
  'Marketing',
  'Operations',
];
