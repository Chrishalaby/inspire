import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { SidebarItem } from '../models/sidebar.model';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private http = inject(HttpClient);

  getSidebarItems(): Observable<SidebarItem[]> {
    console.log('Fetching sidebar items from assets/mock-data/sidebar.json');
    return this.http
      .get<{ items: SidebarItem[] }>('assets/mock-data/sidebar.json')
      .pipe(
        tap((response) => console.log('Sidebar items response:', response)),
        map((response) => response.items),
        tap((items) => console.log('Transformed sidebar items:', items))
      );
  }
}
