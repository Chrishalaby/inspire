import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MenuItem } from '../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private http = inject(HttpClient);

  getMenuItems(): Observable<MenuItem[]> {
    console.log('Fetching menu items from assets/data/menu.json');
    return this.http.get<{ menu: MenuItem[] }>('assets/data/menu.json').pipe(
      tap((response) => console.log('Menu response:', response)),
      map((response) => response.menu),
      tap((menu) => console.log('Transformed menu items:', menu))
    );
  }
}
