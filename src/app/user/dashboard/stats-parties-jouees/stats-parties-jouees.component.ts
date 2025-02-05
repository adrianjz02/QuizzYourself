import {Component, ViewChild} from '@angular/core';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartData} from 'chart.js';
import {GraphService} from '../services/graph-service.service';

@Component({
  selector: 'app-stats-parties-jouees',
  imports: [
    BaseChartDirective,

  ],
  templateUrl: './stats-parties-jouees.component.html',
  styleUrl: './stats-parties-jouees.component.css'
})
export class StatsPartiesJoueesComponent {
  protected maxParties: number = 0;
  protected averageParties: number = 0;
  protected userParties: number = 0;

  constructor(private graphService: GraphService) {
    this.graphService.getMaxParties().subscribe(data => {
      this.maxParties = data.maxParties;

    });

    this.graphService.getAverageParties().subscribe(data => {
      this.averageParties = data.averageParties;

      // Mettre à jour les données du graphique avec averageParties
      this.updateChartData();
    });

    this.graphService.getPartiesJouees().subscribe(data => {
      this.userParties = data.totalParties;

      // Mettre à jour les données du graphique avec userParties
      this.updateChartData();
    });
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    scales: {
      x: {
        ticks: {
          color: 'white', // Set x-axis label text color to white
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.3)', // Set the color of the X-axis grid lines to white with 50% opacity
        }
      },
      y: {
        min: 0,
        ticks: {
          color: 'white', // Set y-axis label text color to white
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
          color: 'white', // Set legend text color to white
        },
      },
      tooltip: {
        bodyColor: 'white', // Set tooltip text color to white
      },
    },
    responsive: true,
  };

  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: ['Nombre de parties jouées'],
    datasets: [
      {
        data: [0],
        label: 'Parties Jouées',
        backgroundColor: 'rgba(75,192,192,0.6)',

      },
      {
        data: [0],
        label: 'Moyenne Parties Global',
        backgroundColor: 'rgba(255,99,132,0.6)',
      },
    ],
  };

  // Méthode pour mettre à jour les données du graphique
  private updateChartData(): void {
    this.barChartData.datasets[0].data[0] = this.userParties; // Met à jour dataset 1 avec userParties
    this.barChartData.datasets[1].data[0] = this.averageParties; // Met à jour dataset 2 avec averageParties

    // Rafraîchir le graphique si nécessaire
    if (this.chart) {
      this.chart.update();
    }

  }
}
