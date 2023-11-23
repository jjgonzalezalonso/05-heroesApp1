import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './shared/error-page/error-page.component';
import { AuthGuard} from './auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'heroes', loadChildren: () => import('./heroes/heroes.module').then(m => m.HeroesModule),
    canActivate: [AuthGuard],
    canMatch: [AuthGuard],
  },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '404', component: ErrorPageComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
