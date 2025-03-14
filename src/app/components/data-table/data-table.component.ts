import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ColumnDefinition } from '../../models/dynamic-tab.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  template: `
    <p-table
      [value]="data()"
      [columns]="columns()"
      [loading]="loading()"
      [paginator]="true"
      [rows]="10"
      [rowHover]="true"
      [showCurrentPageReport]="true"
      [rowsPerPageOptions]="[10, 25, 50]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      styleClass="p-datatable-striped"
    >
      <ng-template pTemplate="header" let-columns>
        <tr>
          <th *ngFor="let col of columns">
            {{ col.header }}
          </th>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-rowData let-columns="columns">
        <tr [style.cursor]="'pointer'" (click)="onRowClick(rowData)">
          <td *ngFor="let col of columns">
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
        </tr>
      </ng-template>

      <ng-template pTemplate="emptymessage">
        <tr>
          <td [attr.colspan]="columns().length" style="text-align:center">
            No records found
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class DataTableComponent {
  @Input() set tableColumns(value: ColumnDefinition[]) {
    this.columns.set(value);
  }

  @Input() set tableData(value: any[]) {
    this.data.set(value);
  }

  @Input() set tableLoading(value: boolean) {
    this.loading.set(value);
  }

  @Output() rowClick = new EventEmitter<any>();
  @Output() editClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();

  columns = signal<ColumnDefinition[]>([]);
  data = signal<any[]>([]);
  loading = signal<boolean>(false);

  onRowClick(rowData: any): void {
    this.rowClick.emit(rowData);
  }

  onEdit(rowData: any, event: Event): void {
    event.stopPropagation();
    this.editClick.emit(rowData);
  }

  onDelete(rowData: any, event: Event): void {
    event.stopPropagation();
    this.deleteClick.emit(rowData);
  }
}
