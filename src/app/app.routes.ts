import {Routes} from '@angular/router';
import {AccueilComponent} from './accueil/accueil.component';
import {AuthComponent} from './auth/auth.component';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {QuizComponent} from './quiz/quiz.component';
import {QuizGameComponent} from './quiz/quiz-game/quiz-game.component';
import {ProfileComponent} from './user/profile/profile.component';
import {DashboardComponent} from './user/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {path: 'login', component: LoginComponent},
      {path: 'signup', component: SignupComponent}
    ]
  },
  {
    path: 'leaderboard',
    component: LeaderboardComponent,
    children: []
  },
  {
    path: 'quiz',
    component: QuizComponent,
    children: [
      {path: 'quiz-main', component: QuizGameComponent},
      {path: 'quiz-main/:category', component: QuizGameComponent}, // New route with category parameter
    ]
  },
  {path: 'profile', component: ProfileComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: '', redirectTo: '/accueil', pathMatch: 'full'}, // Redirection vers /accueil pour URL vide
  {path: '**', component: AccueilComponent} // Redirection des URL inconnues
];
