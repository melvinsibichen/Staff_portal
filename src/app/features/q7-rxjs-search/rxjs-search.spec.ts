import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RxjsSearch } from './rxjs-search';

describe('RxjsSearch', () => {
  const isSearch =
    (term: string) => (req: { url: string; params: { get(k: string): string | null } }) =>
      req.url === 'https://jsonplaceholder.typicode.com/users' &&
      req.params.get('name_like') === term;

  let http: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.useRealTimers();
  });

  const setup = () => TestBed.createComponent(RxjsSearch).componentInstance;

  it('debounces typing into a single request', () => {
    const cmp = setup();
    cmp.searchControl.setValue('l');
    cmp.searchControl.setValue('le');
    cmp.searchControl.setValue('lea');

    vi.advanceTimersByTime(399);
    http.expectNone(() => true);

    vi.advanceTimersByTime(1);
    http.expectOne(isSearch('lea')).flush([]);
  });

  it('skips the request when the term has not changed (distinctUntilChanged)', () => {
    const cmp = setup();
    cmp.searchControl.setValue('ann');
    vi.advanceTimersByTime(400);
    http.expectOne(isSearch('ann')).flush([]);

    cmp.searchControl.setValue('anne');
    cmp.searchControl.setValue('ann ');
    vi.advanceTimersByTime(400);
    http.expectNone(() => true);
  });

  it('cancels the previous request when a new term arrives (switchMap)', () => {
    const cmp = setup();
    cmp.searchControl.setValue('le');
    vi.advanceTimersByTime(400);
    const first = http.expectOne(isSearch('le'));

    cmp.searchControl.setValue('leanne');
    vi.advanceTimersByTime(400);
    const second = http.expectOne(isSearch('leanne'));

    expect(first.cancelled).toBe(true);
    second.flush([]);
  });
});
