import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, retry, timer } from 'rxjs';
import { DashboardEmployee } from '../../core/models/employee.model';
import { toFriendlyError } from '../../core/services/user.service';

interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  company: { department: string; title: string };
}

interface ApiResponse {
  users: ApiUser[];
  total: number;
}

/**
 * The API has no employment-status field, so status is simulated with a documented,
 * deterministic rule: every 6th employee (by ID) is inactive.
 */
export function isActive(id: number): boolean {
  return id % 6 !== 0;
}

export function toEmployee(user: ApiUser): DashboardEmployee {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    age: user.age,
    department: user.company.department,
    title: user.company.title,
    active: isActive(user.id),
  };
}

/** Q10: loads employees from https://dummyjson.com/users and maps them to our model. */
@Injectable({ providedIn: 'root' })
export class EmployeeApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://dummyjson.com/users';

  getEmployees(): Observable<DashboardEmployee[]> {
    const params = new HttpParams()
      .set('limit', 0) // 0 = return every record
      .set('select', 'firstName,lastName,age,email,company');

    return this.http.get<ApiResponse>(this.apiUrl, { params }).pipe(
      // Retry transient failures twice, waiting a little longer each time.
      retry({ count: 2, delay: (_err, attempt) => timer(attempt * 500) }),
      map((res) => res.users.map(toEmployee)),
      catchError(toFriendlyError),
    );
  }
}
