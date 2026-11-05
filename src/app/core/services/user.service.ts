import { HttpClient, HttpErrorResponse, HttpParams, httpResource } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { httpErrorMessage } from '../http/http.interceptors';
import { User } from '../models/user.model';

/**
 * Q2: fetches users from JSONPlaceholder with HttpClient.
 * Also backs the Q7 type-ahead search, which uses the same API.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/users';

  usersResource() {
    return httpResource<User[]>(() => this.apiUrl, { defaultValue: [] });
  }

  /** Server-side, case-insensitive partial match on the user's name. */
  searchUsers(term: string): Observable<User[]> {
    const params = new HttpParams().set('name_like', escapeRegExp(term));
    return this.http.get<User[]>(this.apiUrl, { params }).pipe(catchError(toFriendlyError));
  }
}

/** json-server treats `_like` values as regular expressions, so escape user input. */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Turns an HttpErrorResponse into an Error with a message a user can read. */
export function toFriendlyError(error: HttpErrorResponse): Observable<never> {
  return throwError(() => new Error(httpErrorMessage(error)));
}
