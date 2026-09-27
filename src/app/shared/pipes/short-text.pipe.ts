import { Pipe, PipeTransform } from '@angular/core';

/**
 * Q5: shortens text to a maximum number of characters and adds "...".
 *
 * {{ 'Angular is a powerful front-end framework.' | shortText:12 }}  ->  "Angular is a..."
 */
@Pipe({ name: 'shortText' })
export class ShortTextPipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 20): string {
    if (!value) {
      return '';
    }
    if (limit < 0 || value.length <= limit) {
      return value;
    }
    return value.slice(0, limit).trimEnd() + '...';
  }
}
