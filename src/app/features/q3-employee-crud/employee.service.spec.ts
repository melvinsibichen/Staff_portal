import { TestBed } from '@angular/core/testing';
import { EmployeeService } from './employee.service';

describe('EmployeeService', () => {
  beforeEach(() => localStorage.clear());

  it('saves changes to localStorage so a refresh keeps them', () => {
    const service = TestBed.inject(EmployeeService);
    service.add({ id: 200, name: 'New Person', department: 'IT', email: 'new@company.com' });
    TestBed.tick(); // flush the effect that writes to storage

    const stored = JSON.parse(localStorage.getItem('staff-portal.employees') ?? '[]');
    expect(stored).toHaveLength(4);

    // A fresh app (new injector) reads the saved list back.
    TestBed.resetTestingModule();
    expect(TestBed.inject(EmployeeService).employees()).toHaveLength(4);
  });

  it('falls back to the sample data when storage is corrupt', () => {
    localStorage.setItem('staff-portal.employees', 'not json');
    expect(TestBed.inject(EmployeeService).employees()).toHaveLength(3);
  });

  it('works out the next free ID', () => {
    const service = TestBed.inject(EmployeeService);
    expect(service.nextId()).toBe(104);
    service.delete(103);
    expect(service.nextId()).toBe(103);
  });
});
