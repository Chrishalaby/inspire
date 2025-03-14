import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { MenuItem } from '../../models/menu.model';
import { NavigationService } from '../../services/navigation.service';

export class LoadMenu {
  static readonly type = '[Navigation] Load Menu';
}

export class SelectMenuItem {
  static readonly type = '[Navigation] Select Menu Item';
  constructor(public payload: MenuItem) {}
}

export interface NavigationStateModel {
  menuItems: MenuItem[];
  selectedMenuItem: MenuItem | null;
  loading: boolean;
  error: string | null;
}

@State<NavigationStateModel>({
  name: 'navigation',
  defaults: {
    menuItems: [],
    selectedMenuItem: null,
    loading: false,
    error: null,
  },
})
@Injectable()
export class NavigationState {
  constructor(private navigationService: NavigationService) {}

  @Selector()
  static getMenuItems(state: NavigationStateModel) {
    return state.menuItems;
  }

  @Selector()
  static getSelectedMenuItem(state: NavigationStateModel) {
    return state.selectedMenuItem;
  }

  @Selector()
  static isLoading(state: NavigationStateModel) {
    return state.loading;
  }

  @Action(LoadMenu)
  loadMenu(ctx: StateContext<NavigationStateModel>) {
    console.log('[Navigation State] LoadMenu action started');
    const state = ctx.getState();
    ctx.setState({
      ...state,
      loading: true,
      error: null,
    });

    // Properly using the service to fetch data and update state
    return this.navigationService.getMenuItems().pipe(
      tap({
        next: (menuItems) => {
          console.log(
            '[Navigation State] Menu items loaded successfully',
            menuItems
          );
          ctx.setState({
            ...ctx.getState(),
            menuItems,
            loading: false,
          });
        },
        error: (error) => {
          console.error('[Navigation State] Error loading menu items', error);
          ctx.setState({
            ...ctx.getState(),
            error: error.message,
            loading: false,
          });
        },
      })
    );
  }

  @Action(SelectMenuItem)
  selectMenuItem(
    ctx: StateContext<NavigationStateModel>,
    action: SelectMenuItem
  ) {
    console.log(
      '[Navigation State] SelectMenuItem action started',
      action.payload
    );
    const state = ctx.getState();
    ctx.setState({
      ...state,
      selectedMenuItem: action.payload,
    });
    console.log('[Navigation State] Menu item selected', action.payload);
  }
}
