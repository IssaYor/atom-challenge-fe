import { Routes } from "@angular/router";
import { GuestGuard } from "./core/guards/guest.guard";
import { AuthGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
    {
      path: 'login',
      canActivate: [GuestGuard],
      loadComponent: () =>
        import('./features/auth/pages/login-page/login-page.component')
          .then(m => m.LoginPageComponent)
    },
    {
      path: 'tasks',
      canActivate: [AuthGuard],
      loadComponent: () =>
        import('./features/tasks/pages/task-list-page/task-list-page.component')
          .then(m => m.TaskListPageComponent)
    },
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: '**', redirectTo: 'login' }
  ];
  