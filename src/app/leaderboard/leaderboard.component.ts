import {Component, OnInit} from '@angular/core';
import {LeaderboardService} from './services/leaderboard.service';
import {NgForOf} from '@angular/common';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  imports: [
    NgForOf
  ],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  leaderboard: { email: string; totalScore: number }[] = [];
  leaderboardWithPseudonyms: { pseudonyme: string; totalScore: number }[] = [];

  constructor(private leaderboardService: LeaderboardService) {
  }

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    this.leaderboardService.getTotalScores().subscribe({
      next: (response) => {
        // Trier les scores par ordre décroissant
        this.leaderboard = response.totalScore.sort((a: { totalScore: number; }, b: {
          totalScore: number;
        }) => b.totalScore - a.totalScore);

        // Récupérer les pseudonymes en parallèle
        const requests = this.leaderboard.map(player =>
          this.leaderboardService.getUserByEmail(player.email)
        );

        // Attendre toutes les requêtes avant d'afficher le leaderboard
        forkJoin(requests).subscribe(userResponses => {
          this.leaderboardWithPseudonyms = this.leaderboard.map((player, index) => ({
            pseudonyme: userResponses[index].pseudonyme, // Récupérer le pseudo de la réponse
            totalScore: player.totalScore
          }));
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement du leaderboard:', error);
      },
      complete: () => {
        console.log('Chargement du leaderboard terminé ✅');
      }
    });
  }
}
