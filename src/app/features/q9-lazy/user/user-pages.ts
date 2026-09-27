import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  template: `
    <h2>My profile</h2>
    <dl class="facts">
      <dt>Name</dt>
      <dd>John Doe</dd>
      <dt>Department</dt>
      <dd>IT</dd>
      <dt>Email</dt>
      <dd>john.doe&#64;company.com</dd>
    </dl>
  `,
  styles: `
    h2 {
      font-size: 16px;
      margin-bottom: 12px;
    }
    .facts {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 8px;
      margin: 0;
    }
    dt {
      color: var(--muted);
    }
    dd {
      margin: 0;
      font-weight: 500;
    }
  `,
})
export class UserProfile {}

@Component({
  selector: 'app-user-preferences',
  template: `
    <h2>Preferences</h2>
    <label class="row"><input type="checkbox" checked /> Email me about payroll updates</label>
    <label class="row"><input type="checkbox" /> Weekly team digest</label>
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
export class UserPreferences {}
