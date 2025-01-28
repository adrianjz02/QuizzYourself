import {Component} from '@angular/core';
import {StatsPartiesJoueesComponent} from './dashboard/stats-parties-jouees/stats-parties-jouees.component';
import {
  LineChartEvolutionScoresComponent
} from './dashboard/line-chart-evolution-scores/line-chart-evolution-scores.component';
import {PieChartTauxReussiteComponent} from './dashboard/pie-chart-taux-reussite/pie-chart-taux-reussite.component';
import {BarChartTempsReponseComponent} from './dashboard/bar-chart-temps-reponse/bar-chart-temps-reponse.component';
import {AuthService} from '../auth/services/auth.service';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [
    StatsPartiesJoueesComponent,
    LineChartEvolutionScoresComponent,
    PieChartTauxReussiteComponent,
    BarChartTempsReponseComponent,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  public userMail: string | null;

  constructor(private authService: AuthService) {
    this.userMail = this.authService.getUserEmail(); // Récupération de l'email
  }

}
