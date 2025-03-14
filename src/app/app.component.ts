import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, SidebarComponent, ToastModule],
  template: `
    <p-toast></p-toast>

    <!-- <app-sidebar></app-sidebar> -->
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  readonly #notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.#notificationService.showSuccess('Welcome to the Inspire App!');
  }
}
