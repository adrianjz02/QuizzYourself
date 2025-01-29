import {Component, ViewChild} from '@angular/core';
import {ChartConfiguration, ChartType} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {GraphService} from '../services/graph-service.service';

@Component({
  selector: 'app-line-chart-evolution-scores',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './line-chart-evolution-scores.component.html',
  styleUrl: './line-chart-evolution-scores.component.css'
})
export class LineChartEvolutionScoresComponent {


  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Scores des parties',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      x: { // Axe des dates
        title: {
          display: true,
          text: 'Dates des parties',
        },
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // Set the color of the X-axis grid lines to white with 50% opacity
        }
      },
      y: { // Axe des scores
        title: {
          display: true,
          text: 'Scores',
        },
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

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor(private graphService: GraphService) {
  }

  ngOnInit(): void {
    this.loadEvolutionScores();
  }

  loadEvolutionScores(): void {
    this.graphService.getEvolutionScores().subscribe({
      next: (data: any[]) => {
        const scores = data.map((entry) => entry.score);
        const dates = data.map((entry) => entry.datePartie);

        this.lineChartData.datasets[0].data = scores;
        this.lineChartData.labels = dates;

        this.chart?.update();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des scores :', error);
      },
      complete: () => {
        console.log('Chargement terminé');
      }
    });
  }


}
