import { TestBed } from '@angular/core/testing';
import { EmployeeManagement } from './employee-management';

describe('EmployeeManagement', () => {
  beforeEach(() => localStorage.clear());

  const setup = async () => {
    const fixture = TestBed.createComponent(EmployeeManagement);
    await fixture.whenStable();
    return { fixture, cmp: fixture.componentInstance, el: fixture.nativeElement as HTMLElement };
  };

  const rows = (el: HTMLElement) => el.querySelectorAll('app-employee-table tbody tr');
  const tableText = (el: HTMLElement) => el.querySelector('app-employee-table')?.textContent;

  it('lists the starting employees', async () => {
    const { el } = await setup();
    expect(rows(el)).toHaveLength(3);
  });

  it('adds an employee', async () => {
    const { fixture, cmp, el } = await setup();
    cmp.onSave({ id: 200, name: 'New Person', department: 'IT', email: 'new@company.com' });
    await fixture.whenStable();
    expect(rows(el)).toHaveLength(4);
    expect(tableText(el)).toContain('New Person');
  });

  it('edits an employee', async () => {
    const { fixture, cmp, el } = await setup();
    cmp.onEdit({ id: 101, name: 'John Doe', department: 'IT', email: 'john.doe@company.com' });
    cmp.onSave({ id: 101, name: 'John Updated', department: 'HR', email: 'john@company.com' });
    await fixture.whenStable();
    expect(rows(el)).toHaveLength(3);
    expect(tableText(el)).toContain('John Updated');
  });

  it('deletes an employee after confirmation', async () => {
    const { fixture, cmp, el } = await setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    cmp.onDelete({
      id: 102,
      name: 'Jane Smith',
      department: 'HR',
      email: 'jane.smith@company.com',
    });
    await fixture.whenStable();
    expect(rows(el)).toHaveLength(2);
    expect(tableText(el)).not.toContain('Jane Smith');
  });

  it('keeps added and edited employees after leaving the page and coming back', async () => {
    const first = await setup();
    first.cmp.onSave({ id: 200, name: 'New Person', department: 'IT', email: 'new@company.com' });
    first.cmp.onEdit({
      id: 101,
      name: 'John Doe',
      department: 'IT',
      email: 'john.doe@company.com',
    });
    first.cmp.onSave({
      id: 101,
      name: 'John Updated',
      department: 'HR',
      email: 'john@company.com',
    });
    // Navigating away destroys the page component...
    first.fixture.destroy();

    // ...and coming back creates a brand-new one.
    const second = await setup();
    expect(rows(second.el)).toHaveLength(4);
    expect(tableText(second.el)).toContain('New Person');
    expect(tableText(second.el)).toContain('John Updated');
  });

  it('restores the sample data on reset', async () => {
    const { fixture, cmp, el } = await setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    cmp.onSave({ id: 200, name: 'New Person', department: 'IT', email: 'new@company.com' });
    cmp.onReset();
    await fixture.whenStable();
    expect(rows(el)).toHaveLength(3);
    expect(tableText(el)).not.toContain('New Person');
  });
});
