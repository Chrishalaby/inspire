import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ColumnDefinition } from '../../models/dynamic-tab.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  template: `
    <p-table
      [value]="tableData()"
      [columns]="tableColumns()"
      [loading]="loading()"
      [paginator]="true"
      [rows]="10"
      [rowHover]="true"
      [showCurrentPageReport]="true"
      [rowsPerPageOptions]="[10, 25, 50]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      styleClass="p-datatable-striped"
    >
      <ng-template pTemplate="header">
        <tr>
          @for (col of tableColumns(); track $index) {
          <th>
            {{ col.header }}
          </th>
          }
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-rowData>
        <tr [style.cursor]="'pointer'" (click)="onRowClick(rowData)">
          @for (col of tableColumns(); track $index) {
          <td>
            <ng-container [ngSwitch]="col.field">
              <ng-container *ngSwitchCase="'actions'">
                <div class="flex gap-2">
                  <p-button
                    icon="pi pi-pencil"
                    severity="secondary"
                    size="small"
                    (click)="onEdit(rowData, $event)"
                  ></p-button>
                  <p-button
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    (click)="onDelete(rowData, $event)"
                  ></p-button>
                </div>
              </ng-container>
              <ng-container *ngSwitchDefault>
                {{ rowData[col.field] }}
              </ng-container>
            </ng-container>
          </td>
          }
        </tr>
      </ng-template>

      <ng-template pTemplate="emptymessage">
        <tr>
          <td [attr.colspan]="tableColumns().length" style="text-align:center">
            No records found
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class DataTableComponent {
  readonly tableColumns = input<ColumnDefinition[]>([]);
  readonly tableData = input<any[]>([]);
  readonly tableLoading = input<boolean>(false);

  protected readonly rowClick = output<any>();
  protected readonly editClick = output<any>();
  protected readonly deleteClick = output<any>();

  protected readonly loading = signal<boolean>(false);

  protected onRowClick(rowData: any): void {
    this.rowClick.emit(rowData);
  }

  protected onEdit(rowData: any, event: Event): void {
    event.stopPropagation();
    this.editClick.emit(rowData);
  }

  protected onDelete(rowData: any, event: Event): void {
    event.stopPropagation();
    this.deleteClick.emit(rowData);
  }
}
