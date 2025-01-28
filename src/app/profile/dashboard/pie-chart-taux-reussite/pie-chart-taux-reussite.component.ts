import {Component, ViewChild, OnInit} from '@angular/core';
import {BaseChartDirective} from 'ng2-charts';
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
import {GraphService} from '../services/graph-service.service';

@Component({
  selector: 'app-pie-chart-taux-reussite',
  templateUrl: './pie-chart-taux-reussite.component.html',
  imports: [
    BaseChartDirective
  ],
  styleUrls: ['./pie-chart-taux-reussite.component.css']
})
export class PieChartTauxReussiteComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB'], // Couleurs pour chaque segment
        borderColor: ['#FF6384', '#36A2EB'],    // Couleur des bordures (facultatif)
        borderWidth: 1,                         // Largeur des bordures (facultatif)
      },
    ],
  };
  public pieChartType: ChartType = 'pie';

  constructor(private graphService: GraphService) {}

  ngOnInit(): void {
    this.graphService.getTauxReussite().subscribe((data) => {
      if (data) {
        this.pieChartData.labels = ['Bonnes Réponses', 'Mauvaises Réponses'];
        this.pieChartData.datasets[0].data = [
          data.bonnesReponses,
          data.totalReponses - data.bonnesReponses,
        ];
        this.chart?.update();
      }
    });
  }
}
