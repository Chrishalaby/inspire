import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { SidebarItem } from '../../models/sidebar.model';
import { AppState, LoadCases, LoadSidebarItems } from '../../store/app.state';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    PanelMenuModule,
    SidebarModule,
    RouterModule,
    ButtonModule,
    DrawerModule,
  ],
  template: `
    <!-- <p-sidebar
      [visible]="true"
      [showCloseIcon]="true"
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
    </p-sidebar> -->
    <p-button (click)="openDrawer()" icon="pi pi-bars" />
    <p-drawer #drawerRef [visible]="visible()">
      <ng-template #headless>
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between px-6 pt-4 shrink-0">
            <span>
              <p-button
                type="button"
                (click)="closeCallback($event)"
                icon="pi pi-times"
                rounded="true"
                outlined="true"
                styleClass="h-8 w-8"
              ></p-button>
            </span>
          </div>
          <div class="sidebar-header">
            <h2>Inspire App</h2>
          </div>
          <p-panelMenu
            [model]="menuItems()"
            [style]="{ width: '100%' }"
          ></p-panelMenu>
        </div>
      </ng-template>
    </p-drawer>
  `,
  styles: [
    `
      .sidebar-header {
        padding: 1rem;
        border-bottom: 1px solid #dee2e6;
        margin-bottom: 1rem;
      }
      // :host ::ng-deep .p-sidebar {
      //   position: fixed;
      //   top: 0;
      //   left: 0;
      //   height: 100%;
      // }
    `,
  ],
})
export class SidebarComponent implements OnInit {
  protected readonly drawerRef = viewChild<Drawer>('drawerRef');

  readonly #store = inject(Store);
  readonly #router = inject(Router);

  protected readonly sideBarItems = this.#store.selectSignal(
    AppState.getSidebarItems
  );
  protected readonly menuItems = computed(() =>
    this.mapToMenuItems(this.sideBarItems())
  );
  protected readonly visible = signal<boolean>(false);

  ngOnInit(): void {
    this.#store.dispatch(new LoadSidebarItems());
  }

  private mapToMenuItems(items: SidebarItem[]): MenuItem[] {
    return items.map((item) => {
      const menuItem: MenuItem = {
        label: item.name,
        icon: item.icon,
        items: item.children ? this.mapToMenuItems(item.children) : undefined,
      };

      // If it's a leaf node (cases), add a command
      if (item.id === 'cases') {
        menuItem.command = () => {
          this.#store.dispatch(new LoadCases('accurisk'));
          this.#router.navigate(['/cases']);
        };
      }

      return menuItem;
    });
  }

  closeCallback(e: any): void {
    this.visible.set(false);
  }
  openDrawer(): void {
    this.visible.set(true);
  }
}
