import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CheckboxModule,
    CalendarModule,
  ],
  template: `
    <form [formGroup]="form" class="grid">
      @for (field of getFields(); track field.id) {
      <div class="col-12 md:col-6 mb-3">
        <div class="field">
          <label [for]="field.id">{{ field.label }}</label>

          @switch (field.type) { @case ('text') {
          <input
            pInputText
            [id]="field.id"
            [formControlName]="field.id"
            [required]="field.required ?? false"
            (click)="onFieldClick(field)"
          />
          } @case ('email') {
          <input
            pInputText
            type="email"
            [id]="field.id"
            [formControlName]="field.id"
            [required]="field.required ?? false"
            (click)="onFieldClick(field)"
          />
          } @case ('number') {
          <p-inputNumber
            [id]="field.id"
            [formControlName]="field.id"
            [required]="field.required ?? false"
            (click)="onFieldClick(field)"
          >
          </p-inputNumber>
          } @case ('date') {
          <p-calendar
            [id]="field.id"
            [formControlName]="field.id"
            [required]="field.required ?? false"
            (click)="onFieldClick(field)"
          >
          </p-calendar>
          } @case ('dropdown') {
          <p-dropdown
            [id]="field.id"
            [formControlName]="field.id"
            [options]="field.options"
            optionLabel="label"
            optionValue="value"
            [required]="field.required ?? false"
            (click)="onFieldClick(field)"
          >
          </p-dropdown>
          } @case ('checkbox') {
          <p-checkbox
            [id]="field.id"
            [formControlName]="field.id"
            [binary]="true"
            (click)="onFieldClick(field)"
          >
          </p-checkbox>
          } } @if (field.documentRef) {
          <span class="document-ref-indicator ml-2 pi pi-link"></span>
          }
        </div>
      </div>
      }
    </form>
  `,
  styles: [
    `
      .document-ref-indicator {
        color: #2196f3;
        cursor: pointer;
      }

      :host ::ng-deep input:read-only,
      :host ::ng-deep .p-dropdown.p-disabled,
      :host ::ng-deep .p-calendar.p-disabled {
        opacity: 0.8;
        background-color: #f8f9fa;
      }
    `,
  ],
})
export class DynamicFormComponent<T extends { fields?: any[] }> {
  @Output() fieldClick = new EventEmitter<any>();
  @Output() emptyFieldClick = new EventEmitter<any>();

  readonly config = input<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnChanges(): void {
    if (this.config() && this.config().fields) {
      // Clear previous form
      this.form = this.fb.group({});

      // Create form controls for each field
      this.config().fields.forEach((field: any) => {
        this.form.addControl(
          field.id,
          this.fb.control({
            value: field.value || null,
            disabled: false,
          })
        );
      });
    }
  }

  onFieldClick(field: any): void {
    if (field.documentRef) {
      this.fieldClick.emit(field);
    } else {
      // Emit the emptyFieldClick event when a field without documentRef is clicked
      this.emptyFieldClick.emit(field);
    }
  }

  // Helper method to safely access fields
  getFields(): any[] {
    return this.config()?.fields || [];
  }
}
