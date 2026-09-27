import { ShortTextPipe } from './short-text.pipe';

describe('ShortTextPipe', () => {
  const pipe = new ShortTextPipe();

  it('matches the example from the task', () => {
    expect(pipe.transform('Angular is a powerful front-end framework.', 12)).toBe(
      'Angular is a...',
    );
  });

  it('returns the text unchanged when it fits the limit', () => {
    expect(pipe.transform('Short', 10)).toBe('Short');
    expect(pipe.transform('Exactly10!', 10)).toBe('Exactly10!');
  });

  it('trims trailing spaces before adding the ellipsis', () => {
    expect(pipe.transform('Hello world', 6)).toBe('Hello...');
  });

  it('handles null, undefined and empty input', () => {
    expect(pipe.transform(null, 5)).toBe('');
    expect(pipe.transform(undefined, 5)).toBe('');
    expect(pipe.transform('', 5)).toBe('');
  });

  it('uses a default limit of 20', () => {
    expect(pipe.transform('abcdefghijklmnopqrstuvwxyz')).toBe('abcdefghijklmnopqrst...');
  });
});
