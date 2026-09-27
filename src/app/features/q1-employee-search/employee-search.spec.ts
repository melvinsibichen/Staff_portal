import { TestBed } from '@angular/core/testing';
import { EMPLOYEES } from '../../core/data/employees';
import { EmployeeSearch, filterByName } from './employee-search';

describe('filterByName', () => {
  it('filters case-insensitively and ignores surrounding spaces', () => {
    expect(filterByName(EMPLOYEES, '  JOHN ').map((e) => e.name)).toEqual([
      'John Doe',
      'Emily Johnson',
    ]);
  });

  it('returns everyone for an empty term', () => {
    expect(filterByName(EMPLOYEES, '')).toHaveLength(EMPLOYEES.length);
  });
});

describe('EmployeeSearch', () => {
  const typeInto = async (term: string) => {
    const fixture = TestBed.createComponent(EmployeeSearch);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const input = el.querySelector('input') as HTMLInputElement;
    input.value = term;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    return el;
  };

  it('filters the rendered list as the user types', async () => {
    const el = await typeInto('jane');
    const names = [...el.querySelectorAll('.name')].map((n) => n.textContent?.trim());
    expect(names).toEqual(['Jane Smith']);
  });

  it('shows a message when nothing matches', async () => {
    const el = await typeInto('zzz');
    expect(el.querySelector('.empty')?.textContent).toContain('No employees found');
  });
});
