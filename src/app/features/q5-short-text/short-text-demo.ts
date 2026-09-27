import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShortTextPipe } from '../../shared/pipes/short-text.pipe';

/** Q5: demo page for the shortText pipe. */
@Component({
  selector: 'app-short-text-demo',
  imports: [ShortTextPipe, FormsModule],
  template: `
    <header class="page-header">
      <span class="eyebrow">Question 5</span>
      <h1>shortText Pipe</h1>
      <p>A custom pipe that cuts text to a maximum number of characters and adds "...".</p>
    </header>

    <div class="stack">
      <section class="card stack">
        <h2>Task example</h2>
        <pre><code>{{ exampleCode }}</code></pre>
        <div class="result">
          <span class="muted">Output</span>
          <strong data-testid="example-output">{{ example | shortText: 12 }}</strong>
        </div>
      </section>

      <section class="card stack">
        <h2>Try it</h2>
        <div class="field">
          <label for="demo-text">Text</label>
          <textarea id="demo-text" class="input" rows="3" [(ngModel)]="text"></textarea>
        </div>
        <div class="field">
          <label for="demo-limit">Maximum characters: {{ limit() }}</label>
          <input
            id="demo-limit"
            type="range"
            min="0"
            [max]="text().length || 1"
            [(ngModel)]="limit"
          />
        </div>
        <div class="result">
          <span class="muted"
            ><code>text | shortText:{{ limit() }}</code></span
          >
          <strong>{{ text() | shortText: limit() }}</strong>
        </div>
      </section>
    </div>
  `,
  styles: `
    .card {
      max-width: 640px;
    }
    h2 {
      font-size: 16px;
    }
    pre {
      margin: 0;
      padding: 12px;
      border-radius: 8px;
      background: var(--hover);
      overflow-x: auto;
      font-size: 13px;
    }
    pre code {
      background: none;
      padding: 0;
    }
    .result {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 12px;
      border-radius: 8px;
      background: var(--accent-soft);
    }
    input[type='range'] {
      width: 100%;
    }
    textarea {
      resize: vertical;
    }
  `,
})
export class ShortTextDemo {
  protected readonly example = 'Angular is a powerful front-end framework.';
  protected readonly exampleCode = `{{ 'Angular is a powerful front-end framework.' | shortText:12 }}`;

  protected readonly text = signal(this.example);
  protected readonly limit = signal(12);
}
