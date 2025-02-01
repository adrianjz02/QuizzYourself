import {Routes} from '@angular/router';
import {AccueilComponent} from './accueil/accueil.component';
import {AuthComponent} from './auth/auth.component';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {CommunityComponent} from './community/community.component';
import {ProposeClipComponent} from './community/propose-clip/propose-clip.component';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {QuizComponent} from './quiz/quiz.component';
import {QuizGameComponent} from './quiz/quiz-game/quiz-game.component';
import {TestFrameworkComponent} from './test-framework/test-framework.component';
import {ProfileComponent} from './profile/profile.component';
import {EditProfileComponent} from './profile/edit-profile/edit-profile.component';
import {DashboardComponent} from './profile/dashboard/dashboard.component';

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
    path: 'community',
    component: CommunityComponent,
    children: [
      {path: 'propose-clip', component: ProposeClipComponent},
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
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      {path: 'edit', component: EditProfileComponent},
      {path: 'dashboard', component: DashboardComponent}
    ]
  },
  {path: 'test', component: TestFrameworkComponent},
  {path: '', redirectTo: '/accueil', pathMatch: 'full'}, // Redirection vers /accueil pour URL vide
  {path: '**', component: AccueilComponent} // Redirection des URL inconnues
];
