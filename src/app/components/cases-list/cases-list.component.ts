import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
})
export class CasesListComponent {
  readonly #store = inject(Store);
  readonly #router = inject(Router);

  protected readonly columns = this.#store.selectSignal(
    AppState.getCaseColumns
  );
  protected readonly cases = this.#store.selectSignal(AppState.getCaseData);
  protected readonly loading = this.#store.selectSignal(
    AppState.getCasesLoading
  );

  onCaseSelected(caseData: any): void {
    this.#router.navigate(['/case', caseData.id]);
  }
}
