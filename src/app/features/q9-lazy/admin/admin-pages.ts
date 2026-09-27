import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-roles',
  template: `
    <h2>Roles</h2>
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Members</th>
            <th>Access</th>
          </tr>
        </thead>
        <tbody>
          @for (role of roles; track role.name) {
            <tr>
              <td>{{ role.name }}</td>
              <td>{{ role.members }}</td>
              <td>{{ role.access }}</td>
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
export class AdminRoles {
  protected readonly roles = [
    { name: 'Administrator', members: 2, access: 'Full access' },
    { name: 'HR Manager', members: 4, access: 'Employees, Reports' },
    { name: 'Employee', members: 120, access: 'Own profile' },
  ];
}

@Component({
  selector: 'app-admin-settings',
  template: `
    <h2>System settings</h2>
    <label class="row"><input type="checkbox" checked /> Require two-factor sign-in</label>
    <label class="row"><input type="checkbox" /> Maintenance mode</label>
  `,
  styles: `
    h2 {
      font-size: 16px;
      margin-bottom: 12px;
    }
    label {
      margin-bottom: 8px;
    }
  `,
})
export class AdminSettings {}
