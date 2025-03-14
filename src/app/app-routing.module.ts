import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'cases',
    pathMatch: 'full',
  },
  {
    path: 'cases',
    loadComponent: () =>
      import('./components/cases-list/cases-list.component').then(
        (m) => m.CasesListComponent
      ),
  },
  {
    path: 'cases/:id',
    loadComponent: () =>
      import('./components/case-detail/case-detail.component').then(
        (m) => m.CaseDetailComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'cases',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
