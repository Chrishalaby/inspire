import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { CardModule } from 'primeng/card';
import { AppState } from '../../store/app.state';
import { DataTableComponent } from '../data-table/data-table.component';

@Component({
  selector: 'app-cases-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent, CardModule],
  template: `
    <div class="container">
      <p-card header="Cases" styleClass="mb-4">
        <app-data-table
          [tableColumns]="columns()"
          [tableData]="cases()"
          [tableLoading]="loading()"
          (rowClick)="onCaseSelected($event)"
        >
        </app-data-table>
      </p-card>
    </div>
  `,
  styles: [
    `
      .container {
        margin-left: 260px;
        padding: 20px;
        width: calc(100% - 260px);
      }
    `,
  ],
})
export class CasesListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  columns = toSignal(this.store.select(AppState.getCaseColumns), {
    initialValue: [],
  });
  cases = toSignal(this.store.select(AppState.getCaseData), {
    initialValue: [],
  });
  loading = toSignal(this.store.select(AppState.getCasesLoading), {
    initialValue: false,
  });

  ngOnInit(): void {
    // Cases should be loaded via sidebar navigation
    // If accessed directly, we could add a check here to load cases if data is empty
  }

  onCaseSelected(caseData: any): void {
    this.router.navigate(['/case', caseData.id]);
  }
}
