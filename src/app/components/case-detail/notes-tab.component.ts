import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-notes-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DialogModule,
    TextareaModule,
  ],
  template: `
    <div class="mb-3">
      <p-button
        icon="pi pi-plus"
        label="Add Note"
        (click)="showAddNoteDialog()"
      ></p-button>
    </div>

    <div class="notes-container">
      <p-card *ngFor="let note of notes()" styleClass="mb-3">
        <ng-template pTemplate="header">
          <div class="flex justify-content-between align-items-center">
            <span>Last updated: {{ note.lastUpdated }}</span>
            <div>
              <p-button
                icon="pi pi-pencil"
                severity="secondary"
                size="small"
                (click)="showEditNoteDialog(note)"
              ></p-button>
              <p-button
                icon="pi pi-trash"
                severity="danger"
                size="small"
                (click)="deleteNoteClicked.emit(note)"
              ></p-button>
            </div>
          </div>
        </ng-template>
        <p>{{ note.content }}</p>
        <ng-template pTemplate="footer">
          <small
            >Created by {{ note.createdBy }} on {{ note.createdDate }}</small
          >
        </ng-template>
      </p-card>
    </div>

    <!-- Note Dialog -->
    <p-dialog
      [(visible)]="noteDialogVisible"
      [header]="isEditingNote() ? 'Edit Note' : 'Add Note'"
      [style]="{ width: '450px' }"
      [modal]="true"
    >
      <div class="field">
        <label for="note-content">Note Content</label>
        <textarea
          id="note-content"
          rows="5"
          cols="30"
          pTextarea
          [(ngModel)]="noteContent"
          [autoResize]="true"
        >
        </textarea>
      </div>
      <ng-template pTemplate="footer">
        <p-button
          icon="pi pi-times"
          label="Cancel"
          (click)="cancelNoteDialog()"
          styleClass="p-button-text"
        >
        </p-button>
        <p-button
          icon="pi pi-check"
          label="Save"
          (click)="saveNote()"
          [disabled]="!noteContent"
        >
        </p-button>
      </ng-template>
    </p-dialog>
  `,
  styles: [
    `
      .notes-container {
        max-height: 80vh;
        overflow-y: auto;
      }
    `,
  ],
})
export class NotesTabComponent {
  @Input() set notesList(value: Note[]) {
    this.notes.set(value);
  }

  @Output() addNoteClicked = new EventEmitter<Note>();
  @Output() updateNoteClicked = new EventEmitter<Note>();
  @Output() deleteNoteClicked = new EventEmitter<Note>();

  notes = signal<Note[]>([]);
  noteDialogVisible = signal(false);
  isEditingNote = signal(false);
  noteContent = '';
  editingNoteId = '';

  showAddNoteDialog(): void {
    this.isEditingNote.set(false);
    this.noteContent = '';
    this.editingNoteId = '';
    this.noteDialogVisible.set(true);
  }

  showEditNoteDialog(note: Note): void {
    this.isEditingNote.set(true);
    this.noteContent = note.content;
    this.editingNoteId = note.id;
    this.noteDialogVisible.set(true);
  }

  cancelNoteDialog(): void {
    this.noteDialogVisible.set(false);
  }

  saveNote(): void {
    if (this.isEditingNote()) {
      const updatedNote: Note = {
        id: this.editingNoteId,
        content: this.noteContent,
        createdBy: 'Current User', // In a real app, this would come from authentication
        createdDate:
          this.notes().find((n) => n.id === this.editingNoteId)?.createdDate ||
          new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      this.updateNoteClicked.emit(updatedNote);
    } else {
      const newNote: Note = {
        id: `note${Date.now()}`,
        content: this.noteContent,
        createdBy: 'Current User', // In a real app, this would come from authentication
        createdDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      this.addNoteClicked.emit(newNote);
    }

    this.noteDialogVisible.set(false);
  }
}
