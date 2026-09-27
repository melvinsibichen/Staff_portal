import { TestBed } from '@angular/core/testing';
import { EmployeeParent } from './employee-parent';

describe('EmployeeParent / EmployeeListChild', () => {
  it('passes employees to the child and receives the selected one back', async () => {
    const fixture = TestBed.createComponent(EmployeeParent);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const buttons = el.querySelectorAll<HTMLButtonElement>('app-employee-list-child button');
    expect(buttons.length).toBe(10);

    buttons[1].click();
    await fixture.whenStable();

    expect(el.querySelector('.details')?.textContent).toContain('Jane Smith');
    expect(buttons[1].classList).toContain('selected');
  });
});
