import {Routes} from '@angular/router';
import {AccueilComponent} from './accueil/accueil.component';
import {AuthComponent} from './auth/auth.component';
import {LoginComponent} from './auth/login/login.component';
import {SignupComponent} from './auth/signup/signup.component';
import {CommunityComponent} from './community/community.component';
import {ProposeClipComponent} from './community/propose-clip/propose-clip.component';
import {GamificationComponent} from './gamification/gamification.component';
import {AchievementsComponent} from './gamification/achievements/achievements.component';
import {LeaderboardComponent} from './gamification/leaderboard/leaderboard.component';
import {QuizComponent} from './quiz/quiz.component';
import {QuizMainComponent} from './quiz/quiz-main/quiz-main.component';
import {TestFrameworkComponent} from './test-framework/test-framework.component';
import {UserComponent} from './user/user.component';
import {EditProfileComponent} from './user/edit-profile/edit-profile.component';
import {ProfileComponent} from './user/profile/profile.component';

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
    path: 'gamification',
    component: GamificationComponent,
    children: [
      {path: 'achievements', component: AchievementsComponent},
      {path: 'leaderboard', component: LeaderboardComponent},
    ]
  },
  {
    path: 'quiz',
    component: QuizComponent,
    children: [
      {path: 'quiz-main', component: QuizMainComponent},
    ]
  },
  {
    path: 'user',
    component: UserComponent,
    children: [
      {path: 'edit', component: EditProfileComponent},
      {path: 'profile', component: ProfileComponent},
    ]
  },
  {path: 'test', component: TestFrameworkComponent},
  {path: '', redirectTo: '/accueil', pathMatch: 'full'}, // Redirection vers /accueil pour URL vide
  {path: '**', component: AccueilComponent} // Redirection des URL inconnues
];
