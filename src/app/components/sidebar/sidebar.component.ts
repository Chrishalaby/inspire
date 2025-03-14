import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { SidebarItem } from '../../models/sidebar.model';
import { AppState, LoadCases, LoadSidebarItems } from '../../store/app.state';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, PanelMenuModule, SidebarModule, RouterModule],
  template: `
    <p-sidebar
      [visible]="true"
      [showCloseIcon]="false"
      [baseZIndex]="1000"
      [style]="{ width: '250px' }"
      [modal]="false"
    >
      <div class="sidebar-header">
        <h2>Inspire App</h2>
      </div>
      <p-panelMenu
        [model]="menuItems()"
        [style]="{ width: '100%' }"
      ></p-panelMenu>
    </p-sidebar>
  `,
  styles: [
    `
      .sidebar-header {
        padding: 1rem;
        border-bottom: 1px solid #dee2e6;
        margin-bottom: 1rem;
      }
      :host ::ng-deep .p-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
      }
    `,
  ],
})
export class SidebarComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  protected readonly sideBarItems = this.store.selectSignal(
    AppState.getSidebarItems
  );
  // protected readonly menuItems = signal<MenuItem[]>([]);
  protected readonly menuItems = computed(() =>
    this.mapToMenuItems(this.sideBarItems())
  );

  ngOnInit(): void {
    this.store.dispatch(new LoadSidebarItems());
  }

  private mapToMenuItems(items: SidebarItem[]): MenuItem[] {
    console.log('items', items);
    return items.map((item) => {
      const menuItem: MenuItem = {
        label: item.name,
        icon: item.icon,
        items: item.children ? this.mapToMenuItems(item.children) : undefined,
      };

      // If it's a leaf node (cases), add a command
      if (item.id === 'cases') {
        menuItem.command = () => {
          this.store.dispatch(new LoadCases('accurisk'));
          this.router.navigate(['/cases']);
        };
      }

      return menuItem;
    });
  }
}
