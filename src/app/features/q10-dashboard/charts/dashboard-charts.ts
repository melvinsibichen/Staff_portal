import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { DepartmentCount } from '../dashboard.store';

/**
 * Q10 charts (Chart.js via ng2-charts). The parent renders this inside @defer, so
 * Chart.js is split into its own chunk and only downloaded when the charts scroll into view.
 */
@Component({
  selector: 'app-dashboard-charts',
  imports: [BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="charts">
      <section class="card">
        <h2>Employees per department</h2>
        <div class="chart bar">
          <canvas baseChart type="bar" [data]="barData()" [options]="barOptions"></canvas>
        </div>
      </section>
      <section class="card">
        <h2>Active vs inactive</h2>
        <div class="chart doughnut">
          <canvas
            baseChart
            type="doughnut"
            [data]="doughnutData()"
            [options]="doughnutOptions"
          ></canvas>
        </div>
      </section>
    </div>
  `,
  styles: `
    .charts {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 16px;
    }
    h2 {
      font-size: 15px;
      margin-bottom: 12px;
    }
    .chart {
      position: relative;
      height: 280px;
    }
    @media (max-width: 960px) {
      .charts {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class DashboardCharts {
  readonly byDepartment = input.required<DepartmentCount[]>();
  readonly active = input.required<number>();
  readonly inactive = input.required<number>();

  protected readonly barData = computed<ChartConfiguration<'bar'>['data']>(() => ({
    labels: this.byDepartment().map((d) => d.department),
    datasets: [
      {
        label: 'Employees',
        data: this.byDepartment().map((d) => d.count),
        backgroundColor: '#3b5bdb',
        borderRadius: 4,
        maxBarThickness: 36,
      },
    ],
  }));

  protected readonly doughnutData = computed<ChartConfiguration<'doughnut'>['data']>(() => ({
    labels: ['Active', 'Inactive'],
    datasets: [
      {
        data: [this.active(), this.inactive()],
        backgroundColor: ['#2b8a3e', '#adb5bd'],
        borderWidth: 0,
      },
    ],
  }));

  protected readonly barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { autoSkip: false, maxRotation: 60, minRotation: 0 }, grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  protected readonly doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: { legend: { position: 'bottom' } },
  };
}
