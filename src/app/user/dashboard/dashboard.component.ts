import {Component} from '@angular/core';
import {BarChartTempsReponseComponent} from "./bar-chart-temps-reponse/bar-chart-temps-reponse.component";
import {LineChartEvolutionScoresComponent} from "./line-chart-evolution-scores/line-chart-evolution-scores.component";
import {PieChartTauxReussiteComponent} from "./pie-chart-taux-reussite/pie-chart-taux-reussite.component";
import {StatsPartiesJoueesComponent} from "./stats-parties-jouees/stats-parties-jouees.component";
import {AuthService} from '../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    BarChartTempsReponseComponent,
    LineChartEvolutionScoresComponent,
    PieChartTauxReussiteComponent,
    StatsPartiesJoueesComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  public userMail: string | null;

  constructor(private authService: AuthService) {
    this.userMail = this.authService.getUserEmail(); // Récupération de l'email
  }
}
