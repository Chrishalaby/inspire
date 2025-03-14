import { Routes } from '@angular/router';
import { CaseDetailComponent } from './components/case-detail/case-detail.component';
import { CasesListComponent } from './components/cases-list/cases-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'cases',
    pathMatch: 'full',
  },
  {
    path: 'cases',
    component: CasesListComponent,
  },
  {
    path: 'case/:id',
    component: CaseDetailComponent,
  },
  {
    path: '**',
    redirectTo: 'cases',
  },
];
