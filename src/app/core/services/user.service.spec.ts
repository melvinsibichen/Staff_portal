import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from '../models/user.model';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('GETs users from JSONPlaceholder', () => {
    const users = [{ id: 1, name: 'Leanne Graham' }] as User[];
    let result: User[] | undefined;
    service.getUsers().subscribe((u) => (result = u));

    const req = http.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(users);
    expect(result).toEqual(users);
  });

  it('turns HTTP errors into a friendly message', () => {
    let message = '';
    service.getUsers().subscribe({ error: (e: Error) => (message = e.message) });

    http
      .expectOne('https://jsonplaceholder.typicode.com/users')
      .flush('boom', { status: 500, statusText: 'Server Error' });
    expect(message).toContain('(500)');
  });

  it('searches by name with an escaped name_like parameter', () => {
    service.searchUsers('a.b').subscribe();
    const req = http.expectOne((r) => r.url === 'https://jsonplaceholder.typicode.com/users');
    expect(req.request.params.get('name_like')).toBe('a\\.b');
    req.flush([]);
  });
});
