import {Component, OnInit, ViewChild} from '@angular/core';
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
        labels: {
          color: 'white', // Set legend text color to white
        },
      },
      tooltip: {
        bodyColor: 'white', // Set tooltip text color to white
      },
    },
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [], // Labels for the pie chart
    datasets: [
      {
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB'], // Colors for each segment
        borderColor: ['#FF6384', '#36A2EB'],    // Border colors (optional)
        borderWidth: 1,                         // Border width (optional)
      },
    ],
  };

  public pieChartType: ChartType = 'pie';

  constructor(private graphService: GraphService) {
  }

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
