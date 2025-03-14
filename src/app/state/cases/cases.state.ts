import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import {
  Case,
  Column,
  Document,
  DynamicTab,
  Note,
} from '../../models/case.model';
import { CasesService } from '../../services/cases.service';

export class LoadCases {
  static readonly type = '[Cases] Load Cases';
}

export class LoadCaseDetails {
  static readonly type = '[Cases] Load Case Details';
  constructor(public id: string) {}
}

export class AddNote {
  static readonly type = '[Cases] Add Note';
  constructor(public payload: { caseId: string; note: Omit<Note, 'id'> }) {}
}

export class DeleteNote {
  static readonly type = '[Cases] Delete Note';
  constructor(public payload: { caseId: string; noteId: string }) {}
}

// State model
export interface CasesStateModel {
  cases: Case[];
  columns: Column[];
  selectedCase: {
    id: string;
    documents: {
      columns: Column[];
      items: Document[];
    };
    notes: Note[];
    dynamicTabs: DynamicTab[];
  } | null;
  loading: boolean;
  error: string | null;
}

@State<CasesStateModel>({
  name: 'cases',
  defaults: {
    cases: [],
    columns: [],
    selectedCase: null,
    loading: false,
    error: null,
  },
})
@Injectable()
export class CasesState {
  constructor(private casesService: CasesService) {}

  @Selector()
  static getCases(state: CasesStateModel) {
    return state.cases;
  }

  @Selector()
  static getColumns(state: CasesStateModel) {
    return state.columns;
  }

  @Selector()
  static getSelectedCase(state: CasesStateModel) {
    return state.selectedCase;
  }

  @Selector()
  static isLoading(state: CasesStateModel) {
    return state.loading;
  }

  @Action(LoadCases)
  loadCases(ctx: StateContext<CasesStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      loading: true,
      error: null,
    });

    return this.casesService.getCases().pipe(
      tap({
        next: (response) => {
          ctx.setState({
            ...ctx.getState(),
            cases: response.cases,
            columns: response.columns,
            loading: false,
          });
        },
        error: (error) => {
          ctx.setState({
            ...ctx.getState(),
            error: error.message,
            loading: false,
          });
        },
      })
    );
  }

  @Action(LoadCaseDetails)
  loadCaseDetails(ctx: StateContext<CasesStateModel>, action: LoadCaseDetails) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      loading: true,
      error: null,
    });

    return this.casesService.getCaseDetails(action.id).pipe(
      tap({
        next: (caseDetails) => {
          ctx.setState({
            ...ctx.getState(),
            selectedCase: caseDetails,
            loading: false,
          });
        },
        error: (error) => {
          ctx.setState({
            ...ctx.getState(),
            error: error.message,
            loading: false,
          });
        },
      })
    );
  }

  @Action(AddNote)
  addNote(ctx: StateContext<CasesStateModel>, action: AddNote) {
    return this.casesService
      .addNote(action.payload.caseId, action.payload.note)
      .pipe(
        tap((note) => {
          const state = ctx.getState();
          if (state.selectedCase) {
            ctx.setState({
              ...state,
              selectedCase: {
                ...state.selectedCase,
                notes: [...state.selectedCase.notes, note],
              },
            });
          }
        })
      );
  }

  @Action(DeleteNote)
  deleteNote(ctx: StateContext<CasesStateModel>, action: DeleteNote) {
    return this.casesService
      .deleteNote(action.payload.caseId, action.payload.noteId)
      .pipe(
        tap(() => {
          const state = ctx.getState();
          if (state.selectedCase) {
            ctx.setState({
              ...state,
              selectedCase: {
                ...state.selectedCase,
                notes: state.selectedCase.notes.filter(
                  (note) => note.id !== action.payload.noteId
                ),
              },
            });
          }
        })
      );
  }
}
