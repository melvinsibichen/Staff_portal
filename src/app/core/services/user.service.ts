import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../models/user.model';

/**
 * Q2: fetches users from JSONPlaceholder with HttpClient.
 * Also backs the Q7 type-ahead search, which uses the same API.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/users';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(catchError(toFriendlyError));
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
  const message =
    error.status === 0
      ? 'Could not reach the server. Check your internet connection and try again.'
      : `The server returned an error (${error.status}). Please try again later.`;
  return throwError(() => new Error(message));
}
