import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { httpErrorMessage } from '../../core/http/http.interceptors';
import { UserService } from '../../core/services/user.service';

/**
 * Q2: shows users from UserService in a table, with a loading state and a friendly
 * error message (plus Retry) when the request fails.
 */
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  private readonly userService = inject(UserService);

  protected readonly users = this.userService.usersResource();
  protected readonly skeletonRows = [1, 2, 3, 4, 5, 6];

  protected readonly error = computed(() => {
    const err = this.users.error();
    if (!err) {
      return null;
    }
    return err instanceof HttpErrorResponse ? httpErrorMessage(err) : 'Could not load users.';
  });

  protected loadUsers(): void {
    this.users.reload();
  }
}
