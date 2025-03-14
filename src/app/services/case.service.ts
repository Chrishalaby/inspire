import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Case } from '../models/case.model';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  private http = inject(HttpClient);

  getCases(categoryId: string): Observable<{ columns: any[]; data: Case[] }> {
    // In a real app, we would use the categoryId to filter cases
    return this.http.get<{ columns: any[]; data: Case[] }>(
      'assets/mock-data/cases.json'
    );
  }

  getCaseDetail(caseId: string): Observable<any> {
    // In a real app, we would use the caseId to get specific case details
    return this.http.get<any>('assets/mock-data/case-detail.json');
  }
}
