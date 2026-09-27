import { Component } from '@angular/core';
import { EMPLOYEES } from '../../../core/data/employees';

@Component({
  selector: 'app-reports-summary',
  template: `
    <h2>Monthly summary</h2>
    <ul>
      <li>{{ total }} employees on record</li>
      <li>{{ departments }} departments</li>
      <li>Report generated {{ today }}</li>
    </ul>
  `,
  styles: `
    h2 {
      font-size: 16px;
      margin-bottom: 12px;
    }
    ul {
      margin: 0;
      padding-left: 18px;
    }
  `,
})
export class ReportsSummary {
  protected readonly total = EMPLOYEES.length;
  protected readonly departments = new Set(EMPLOYEES.map((e) => e.department)).size;
  protected readonly today = new Date().toDateString();
}

@Component({
  selector: 'app-reports-headcount',
  template: `
    <h2>Headcount by department</h2>
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Employees</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows; track row.department) {
            <tr>
              <td>{{ row.department }}</td>
              <td>{{ row.count }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    h2 {
      font-size: 16px;
      margin-bottom: 12px;
    }
  `,
})
export class ReportsHeadcount {
  protected readonly rows = Object.entries(
    EMPLOYEES.reduce<Record<string, number>>((acc, e) => {
      acc[e.department] = (acc[e.department] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([department, count]) => ({ department, count }));
}
