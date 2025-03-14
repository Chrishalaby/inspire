import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Case, Column, Note } from '../models/case.model';

@Injectable({
  providedIn: 'root',
})
export class CasesService {
  private http = inject(HttpClient);

  getCases(): Observable<{ cases: Case[]; columns: Column[] }> {
    return this.http.get<{ cases: Case[]; columns: Column[] }>(
      'assets/data/cases.json'
    );
  }

  getCaseDetails(id: string): Observable<any> {
    return this.http.get<any>('assets/data/case-details.json');
  }

  addNote(caseId: string, note: Omit<Note, 'id'>): Observable<Note> {
    // In a real app, this would make an HTTP POST request
    const newNote: Note = {
      id: `note-${Date.now()}`,
      ...note,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    return of(newNote);
  }

  deleteNote(caseId: string, noteId: string): Observable<void> {
    // In a real app, this would make an HTTP DELETE request
    return of(void 0);
  }

  openDocument(documentId: string): Observable<string> {
    // In a real app, this would fetch the document URL
    return of(`assets/sample.pdf`);
  }
}
