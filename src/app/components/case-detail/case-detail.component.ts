import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SplitterModule } from 'primeng/splitter';
import { TabViewModule } from 'primeng/tabview';
import { TabType } from '../../models/dynamic-tab.model';
import { Note } from '../../models/note.model';
import { DocumentService } from '../../services/document.service';
import {
  AddNote,
  AppState,
  DeleteNote,
  LoadCaseDetail,
  SelectDocument,
  UpdateDocument,
  UpdateFormField,
  UpdateNote,
} from '../../store/app.state';
import { DataTableComponent } from '../data-table/data-table.component';
import { DocumentViewerComponent } from '../document-viewer/document-viewer.component';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';
import { NotesTabComponent } from './notes-tab.component';

@Component({
  selector: 'app-case-detail',
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    DocumentViewerComponent,
    DynamicFormComponent,
    DynamicTableComponent,
    NotesTabComponent,
    ButtonModule,
    CardModule,
    TabViewModule,
    SplitterModule,
  ],
  template: `
    <div class="container">
      <div class="flex justify-content-between align-items-center mb-3">
        <h2>Case: {{ selectedCase()?.referenceId }}</h2>
        <p-button
          icon="pi pi-arrow-left"
          label="Back"
          (click)="goBack()"
        ></p-button>
      </div>

      <div class="case-container">
        <p-splitter [style]="{ height: '100%' }">
          <ng-template pTemplate="panel">
            <div class="p-2">
              <p-tabView>
                <!-- Documents Tab -->
                <p-tabPanel header="Documents">
                  @if(!selectedDocument()){
                  <app-data-table
                    [tableColumns]="documentColumns()"
                    [tableData]="documents()"
                    [tableLoading]="loading()"
                    (rowClick)="viewDocument($event)"
                  >
                  </app-data-table>
                  } @else {
                  <div class="mb-3">
                    <p-button
                      icon="pi pi-arrow-left"
                      label="Back to Documents"
                      (click)="closeDocument()"
                    ></p-button>
                  </div>
                  <app-document-viewer
                    [document]="selectedDocument()"
                    [highlightMode]="highlightSelectionMode()"
                    (areaSelected)="onDocumentAreaSelected($event)"
                  ></app-document-viewer>
                  }
                </p-tabPanel>

                <!-- Notes Tab -->
                <p-tabPanel header="Notes">
                  <app-notes-tab
                    [notesList]="notes()"
                    (addNoteClicked)="addNote($event)"
                    (updateNoteClicked)="updateNote($event)"
                    (deleteNoteClicked)="deleteNote($event)"
                  >
                  </app-notes-tab>
                </p-tabPanel>
              </p-tabView>
            </div>
          </ng-template>

          <ng-template pTemplate="panel">
            <div class="p-2">
              <p-tabView>
                @for (tab of rightTabs(); track $index) {
                <p-tabPanel [header]="tab.title">
                  <ng-container [ngSwitch]="tab.type">
                    <app-dynamic-form
                      *ngSwitchCase="TabType.FORM"
                      [config]="tab.config"
                      (fieldClick)="onFormFieldClick($event)"
                      (emptyFieldClick)="onEmptyFieldClick($event)"
                    >
                    </app-dynamic-form>
                    <app-dynamic-table
                      *ngSwitchCase="TabType.TABLE"
                      [config]="tab.config"
                    >
                    </app-dynamic-table>
                  </ng-container>
                </p-tabPanel>
                }
              </p-tabView>
            </div>
          </ng-template>
        </p-splitter>
      </div>
    </div>
  `,
})
export class CaseDetailComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private documentService = inject(DocumentService);

  protected readonly TabType = TabType;

  protected readonly selectedCase = this.store.selectSignal(
    AppState.getSelectedCase
  );

  protected readonly documentColumns = this.store.selectSignal(
    AppState.getDocumentColumns
  );
  protected readonly documents = this.store.selectSignal(AppState.getDocuments);
  protected readonly selectedDocument = this.store.selectSignal(
    AppState.getSelectedDocument
  );
  protected readonly notes = this.store.selectSignal(AppState.getNotes);
  protected readonly rightTabs = this.store.selectSignal(AppState.getRightTabs);
  protected readonly loading = this.store.selectSignal(
    AppState.getCaseDetailLoading
  );

  // Add new property to track if we're in highlight selection mode
  highlightSelectionMode = signal<boolean>(false);

  // Store the field waiting for a highlight
  private pendingField: {
    id: string;
    value?: string;
    tabId?: string;
    fieldId?: string;
  } | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const caseId = params.get('id');
      if (caseId) {
        this.store.dispatch(new LoadCaseDetail(caseId));
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/cases']);
  }

  viewDocument(document: any): void {
    this.store.dispatch(new SelectDocument(document.id));
  }

  closeDocument(): void {
    this.store.dispatch(new SelectDocument(''));
  }

  onFormFieldClick(fieldConfig: any): void {
    if (fieldConfig.documentRef) {
      // First select the document
      this.store.dispatch(
        new SelectDocument(fieldConfig.documentRef.documentId)
      );

      // Then highlight the data point
      this.documentService.highlightDataPoint(
        fieldConfig.documentRef.documentId,
        fieldConfig.documentRef.x,
        fieldConfig.documentRef.y
      );
    }
  }

  // New method to handle empty field clicks
  onEmptyFieldClick(fieldConfig: any): void {
    // If no document is selected, prompt the user to select one first
    if (!this.selectedDocument()) {
      alert('Please select a document first to add a highlight.');
      return;
    }

    // Store the field reference and enable highlight selection mode
    this.pendingField = {
      id: fieldConfig.id,
      value: fieldConfig.value,
      tabId: fieldConfig.tabId,
      fieldId: fieldConfig.fieldId,
    };
    this.highlightSelectionMode.set(true);
  }

  // New method to handle document area selection
  onDocumentAreaSelected(area: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): void {
    if (!this.pendingField || !this.selectedDocument()) return;

    const documentId = this.selectedDocument()?.id;

    // Return early if documentId is undefined
    if (!documentId) return;

    // Create a new data point
    const newDataPoint = {
      fieldName: this.pendingField.id,
      value: this.pendingField.value || '',
      x: area.x,
      y: area.y,
      width: area.width,
      height: area.height,
    };

    // Update the document with the new data point
    const updatedDocument = {
      ...this.selectedDocument(),
      dataPoints: [
        ...(this.selectedDocument()?.dataPoints || []),
        newDataPoint,
      ],
    };

    // Create document reference object with non-nullable documentId
    const documentRef = {
      documentId, // This is now guaranteed to be a string
      x: area.x,
      y: area.y,
    };

    // Update the document in the store
    this.store.dispatch(new UpdateDocument(updatedDocument));

    // Update the form field with document reference
    this.store.dispatch(
      new UpdateFormField({
        fieldId: this.pendingField.id,
        tabId: this.pendingField.tabId,
        documentRef: documentRef,
      })
    );

    // Exit highlight selection mode
    this.highlightSelectionMode.set(false);
    this.pendingField = null;
  }

  addNote(note: Note): void {
    const caseId = this.selectedCase()?.id;
    if (caseId) {
      this.store.dispatch(new AddNote({ caseId, note }));
    }
  }

  updateNote(note: Note): void {
    const caseId = this.selectedCase()?.id;
    if (caseId) {
      this.store.dispatch(new UpdateNote({ caseId, note }));
    }
  }

  deleteNote(note: Note): void {
    const caseId = this.selectedCase()?.id;
    if (caseId) {
      this.store.dispatch(new DeleteNote({ caseId, noteId: note.id }));
    }
  }
}
