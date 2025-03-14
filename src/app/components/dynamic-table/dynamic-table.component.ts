import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  template: `
    <p-table
      [value]="config()?.data || []"
      [columns]="config()?.columns || []"
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
        <tr>
          <td *ngFor="let col of columns">
            {{ rowData[col.field] }}
          </td>
        </tr>
      </ng-template>

      <ng-template pTemplate="emptymessage">
        <tr>
          <td
            [attr.colspan]="config()?.columns?.length || 0"
            style="text-align:center"
          >
            No records found
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class DynamicTableComponent {
  readonly config = input<any>(); //TableConfig
}
