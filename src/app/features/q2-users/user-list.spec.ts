import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserList } from './user-list';

describe('UserList', () => {
  const url = 'https://jsonplaceholder.typicode.com/users';
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('shows a loading indicator, then the users table', async () => {
    const fixture = TestBed.createComponent(UserList);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Loading users');

    http.expectOne(url).flush([
      {
        id: 1,
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'a@b.c',
        phone: '1',
        website: '',
        address: { street: '', suite: '', city: 'Gwenborough', zipcode: '' },
        company: { name: 'Romaguera-Crona' },
      },
    ]);
    await fixture.whenStable();

    expect(el.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(el.textContent).toContain('Leanne Graham');
  });

  it('shows an error with a Retry button when the request fails', async () => {
    const fixture = TestBed.createComponent(UserList);
    fixture.detectChanges();
    http.expectOne(url).error(new ProgressEvent('error'), { status: 0 });
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    const alert = el.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Could not reach the server');

    (alert?.querySelector('button') as HTMLButtonElement).click();
    http.expectOne(url).flush([]);
  });
});
