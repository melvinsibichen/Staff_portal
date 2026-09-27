import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DashboardEmployee } from '../../core/models/employee.model';
import { DashboardStore, filterEmployees } from './dashboard.store';
import { isActive } from './employee-api.service';

const departments = ['Engineering', 'Sales', 'Legal'];

/** 24 fake API users spread over three departments. */
const apiUsers = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  firstName: `First${i + 1}`,
  lastName: 'Tester',
  age: 30,
  email: `user${i + 1}@x.com`,
  company: { department: departments[i % 3], title: 'Engineer' },
}));

describe('filterEmployees', () => {
  const list: DashboardEmployee[] = [
    {
      id: 1,
      name: 'Emily Johnson',
      email: 'emily@x.com',
      department: 'Engineering',
      title: '',
      age: 29,
      active: true,
    },
    {
      id: 2,
      name: 'Michael Williams',
      email: 'mike@x.com',
      department: 'Support',
      title: '',
      age: 35,
      active: false,
    },
  ];

  it('matches name or email, case-insensitively', () => {
    expect(filterEmployees(list, 'EMILY', '', 'all')).toHaveLength(1);
    expect(filterEmployees(list, 'mike@', '', 'all')).toHaveLength(1);
  });

  it('filters by department and status', () => {
    expect(filterEmployees(list, '', 'Support', 'all').map((e) => e.id)).toEqual([2]);
    expect(filterEmployees(list, '', '', 'active').map((e) => e.id)).toEqual([1]);
    expect(filterEmployees(list, '', '', 'inactive').map((e) => e.id)).toEqual([2]);
  });
});

describe('DashboardStore', () => {
  let store: DashboardStore;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(DashboardStore);
    http = TestBed.inject(HttpTestingController);
    http
      .expectOne((r) => r.url === 'https://dummyjson.com/users')
      .flush({ users: apiUsers, total: 24 });
  });

  it('computes the KPIs', () => {
    expect(store.kpis()).toEqual({
      total: 24,
      active: apiUsers.filter((u) => isActive(u.id)).length,
      departments: 3,
    });
  });

  it('paginates the filtered list', () => {
    expect(store.totalPages()).toBe(3);
    expect(store.paged()).toHaveLength(10);

    store.goToPage(3);
    expect(store.paged().map((e) => e.id)).toEqual([21, 22, 23, 24]);

    store.goToPage(99);
    expect(store.currentPage()).toBe(3);
  });

  it('goes back to page 1 when a filter changes', () => {
    store.goToPage(2);
    store.setDepartment('Sales');
    expect(store.currentPage()).toBe(1);
    expect(store.kpis().total).toBe(8);
    expect(store.kpis().departments).toBe(1);
  });

  it('counts employees per department for the chart', () => {
    expect(store.byDepartment()).toEqual([
      { department: 'Engineering', count: 8 },
      { department: 'Sales', count: 8 },
      { department: 'Legal', count: 8 },
    ]);
  });
});
