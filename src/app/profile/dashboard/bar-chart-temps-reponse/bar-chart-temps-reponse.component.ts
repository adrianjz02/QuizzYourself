import {Component, ViewChild} from '@angular/core';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartData} from 'chart.js';
import {GraphService} from '../services/graph-service.service';

@Component({
  selector: 'app-bar-chart-temps-reponse',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './bar-chart-temps-reponse.component.html',
  styleUrl: './bar-chart-temps-reponse.component.css'
})
export class BarChartTempsReponseComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // Set the color of the X-axis grid lines to white with 50% opacity
        }
      },
      y: {
        min: 0,
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // Set the color of the X-axis grid lines to white with 50% opacity
        }
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'white',
        },
      },
    },
  };
  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: ['Temps de réponse moyen (ms)'],
    datasets: [
      {data: [0], label: 'Temps Moyen Joueur', backgroundColor: 'rgba(75,192,192,0.6)'},
      {data: [0], label: 'Temps Moyen Global', backgroundColor: 'rgba(255,99,132,0.6)'}
    ],
  };

  constructor(private graphService: GraphService) {
  }

  ngOnInit(): void {
    this.graphService.getTempsReponse().subscribe((data) => {
      if (data) {
        this.barChartData.labels = ['Temps de réponse moyen (ms)'];
        this.barChartData.datasets[0].data = [
          data.tempsMoyenMs,
        ];
        this.chart?.update();
      }
    });

    this.graphService.getAverageTempsReponse().subscribe((data) => {
      if (data) {
        this.barChartData.datasets[1].data = [
          data.moyenne,
        ];
        this.chart?.update();
      }
    });
  }

}
