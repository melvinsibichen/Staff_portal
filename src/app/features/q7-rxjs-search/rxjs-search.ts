import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Observable,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

export interface SearchState {
  status: 'idle' | 'loading' | 'success' | 'error';
  results: User[];
  error?: string;
}

const IDLE: SearchState = { status: 'idle', results: [] };

/**
 * Q7: type-ahead search against the JSONPlaceholder users API.
 *
 *  debounceTime(400)       waits until the user pauses typing
 *  distinctUntilChanged()  skips a request when the term has not changed
 *  switchMap()             cancels the previous in-flight request
 *
 * catchError sits inside switchMap so one failed request does not end the stream.
 */
@Component({
  selector: 'app-rxjs-search',
  imports: [ReactiveFormsModule],
  templateUrl: './rxjs-search.html',
  styleUrl: './rxjs-search.scss',
})
export class RxjsSearch {
  private readonly userService = inject(UserService);

  readonly searchControl = new FormControl('', { nonNullable: true });

  /** How many keystrokes vs. how many API requests: shows the optimisation working. */
  protected readonly keystrokes = signal(0);
  protected readonly requests = signal(0);

  private readonly state$: Observable<SearchState> = this.searchControl.valueChanges.pipe(
    tap(() => this.keystrokes.update((n) => n + 1)),
    map((term) => term.trim()),
    debounceTime(400),
    distinctUntilChanged(),
    switchMap((term) => (term ? this.search(term) : of(IDLE))),
  );

  protected readonly state = toSignal(this.state$, { initialValue: IDLE });

  private search(term: string): Observable<SearchState> {
    this.requests.update((n) => n + 1);
    return this.userService.searchUsers(term).pipe(
      map((results): SearchState => ({ status: 'success', results })),
      catchError((err: Error) =>
        of<SearchState>({ status: 'error', results: [], error: err.message }),
      ),
      startWith<SearchState>({ status: 'loading', results: [] }),
    );
  }
}
