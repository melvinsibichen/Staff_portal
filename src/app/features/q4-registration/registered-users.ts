import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RegisteredUser } from './registration.service';

const AVATAR_COLOURS = ['#24594a', '#7a4b2a', '#3d5a80', '#6b4e71', '#5c6b2e', '#8a3b3b'];

/** Q4: shows registered users as profile cards (not a table). */
@Component({
  selector: 'app-registered-users',
  imports: [DatePipe],
  templateUrl: './registered-users.html',
  styleUrl: './registered-users.scss',
})
export class RegisteredUsers {
  readonly users = input.required<readonly RegisteredUser[]>();
  /** ID of the user who just registered, so their card can be highlighted. */
  readonly highlightId = input<string | null>(null);

  readonly remove = output<RegisteredUser>();
  readonly clearAll = output<void>();

  protected initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  }

  /** Same name always gets the same colour. */
  protected avatarColour(name: string): string {
    let hash = 0;
    for (const char of name) {
      hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    }
    return AVATAR_COLOURS[hash % AVATAR_COLOURS.length];
  }
}
