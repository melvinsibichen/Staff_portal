import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RegisteredUser } from './registration.service';

const AVATAR_COLOURS = ['#3b5bdb', '#0c8599', '#2b8a3e', '#e67700', '#c2255c', '#7048e8'];

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
