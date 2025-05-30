import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'notes',
    loadComponent: () => import('./pages/notes/notes.page').then(m => m.NotesPage)
  },
  {
    path: 'storage',
    loadComponent: () => import('./pages/storage/storage.page').then(m => m.StoragePage)
  },
  {
    path: 'tags',
    loadComponent: () => import('./pages/tags/tags.page').then(m => m.TagsPage)
  }
]; 