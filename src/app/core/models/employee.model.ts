/** Shape of the sample employees given in Q1 and reused in Q8. */
export interface Employee {
  id: number;
  name: string;
  department: string;
}

/** Q3 fields: Employee ID, Employee Name, Department, Email. */
export interface ManagedEmployee extends Employee {
  email: string;
}

/** Q10: an employee mapped from the dashboard API. */
export interface DashboardEmployee extends ManagedEmployee {
  title: string;
  age: number;
  active: boolean;
}
