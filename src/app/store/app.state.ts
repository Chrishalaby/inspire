import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Case } from '../models/case.model';
import { Document } from '../models/document.model';
import {
  ColumnDefinition,
  DynamicTab,
  FormConfig,
  TabType,
} from '../models/dynamic-tab.model';
import { Note } from '../models/note.model';
import { SidebarItem } from '../models/sidebar.model';
import { CaseService } from '../services/case.service';
import { DocumentService } from '../services/document.service';
import { SidebarService } from '../services/sidebar.service';

export class LoadSidebarItems {
  static readonly type = '[Sidebar] Load Items';
}

export class UpdateFormField {
  static readonly type = '[Form] Update Field';
  constructor(
    public payload: {
      fieldId: string;
      tabId?: string;
      documentRef: {
        documentId: string;
        x: number;
        y: number;
      };
    }
  ) {}
}

export class LoadCases {
  static readonly type = '[Cases] Load Cases';
  constructor(public payload: string) {}
}

export class LoadCaseDetail {
  static readonly type = '[Cases] Load Case Detail';
  constructor(public payload: string) {}
}

export class SelectDocument {
  static readonly type = '[Document] Select Document';
  constructor(public payload: string) {}
}

export class AddNote {
  static readonly type = '[Note] Add Note';
  constructor(public payload: { caseId: string; note: Note }) {}
}

export class UpdateNote {
  static readonly type = '[Note] Update Note';
  constructor(public payload: { caseId: string; note: Note }) {}
}

export class DeleteNote {
  static readonly type = '[Note] Delete Note';
  constructor(public payload: { caseId: string; noteId: string }) {}
}

export class UpdateDocument {
  static readonly type = '[App] Update Document';
  constructor(public document: any) {}
}

export interface AppStateModel {
  sidebar: {
    items: SidebarItem[];
    loading: boolean;
  };
  cases: {
    columns: ColumnDefinition[];
    data: Case[];
    loading: boolean;
  };
  caseDetail: {
    selectedCase: any;
    documents: {
      columns: ColumnDefinition[];
      data: Document[];
    };
    notes: Note[];
    selectedDocumentId: string | null;
    rightTabs: DynamicTab[];
    loading: boolean;
  };
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    sidebar: {
      items: [],
      loading: false,
    },
    cases: {
      columns: [],
      data: [],
      loading: false,
    },
    caseDetail: {
      selectedCase: null,
      documents: {
        columns: [],
        data: [],
      },
      notes: [],
      selectedDocumentId: null,
      rightTabs: [],
      loading: false,
    },
  },
})
@Injectable()
export class AppState {
  constructor(
    private sidebarService: SidebarService,
    private caseService: CaseService,
    private documentService: DocumentService
  ) {}

  @Selector()
  static getSidebarItems(state: AppStateModel) {
    return state.sidebar.items;
  }

  @Selector()
  static getSidebarLoading(state: AppStateModel) {
    return state.sidebar.loading;
  }

  @Selector()
  static getCaseColumns(state: AppStateModel) {
    return state.cases.columns;
  }

  @Selector()
  static getCaseData(state: AppStateModel) {
    return state.cases.data;
  }

  @Selector()
  static getCasesLoading(state: AppStateModel) {
    return state.cases.loading;
  }

  @Selector()
  static getSelectedCase(state: AppStateModel) {
    return state.caseDetail.selectedCase;
  }

  @Selector()
  static getDocumentColumns(state: AppStateModel) {
    return state.caseDetail.documents.columns;
  }

  @Selector()
  static getDocuments(state: AppStateModel) {
    return state.caseDetail.documents.data;
  }

  @Selector()
  static getSelectedDocument(state: AppStateModel) {
    return state.caseDetail.documents.data.find(
      (doc) => doc.id === state.caseDetail.selectedDocumentId
    );
  }

  @Selector()
  static getNotes(state: AppStateModel) {
    return state.caseDetail.notes;
  }

  @Selector()
  static getRightTabs(state: AppStateModel) {
    return state.caseDetail.rightTabs;
  }

  @Selector()
  static getCaseDetailLoading(state: AppStateModel) {
    return state.caseDetail.loading;
  }

  @Action(LoadSidebarItems)
  loadSidebarItems(ctx: StateContext<AppStateModel>) {
    console.log('[Action] LoadSidebarItems - Started');
    const state = ctx.getState();
    ctx.setState({
      ...state,
      sidebar: {
        ...state.sidebar,
        loading: true,
      },
    });

    return this.sidebarService.getSidebarItems().pipe(
      tap((items) => {
        console.log('[Action] LoadSidebarItems - Completed', { items });
        ctx.setState({
          ...ctx.getState(),
          sidebar: {
            items,
            loading: false,
          },
        });
      })
    );
  }

  @Action(LoadCases)
  loadCases(ctx: StateContext<AppStateModel>, action: LoadCases) {
    console.log('[Action] LoadCases - Started', { payload: action.payload });
    const state = ctx.getState();
    ctx.setState({
      ...state,
      cases: {
        ...state.cases,
        loading: true,
      },
    });

    return this.caseService.getCases(action.payload).pipe(
      tap((result) => {
        console.log('[Action] LoadCases - Completed', { result });
        ctx.setState({
          ...ctx.getState(),
          cases: {
            columns: result.columns,
            data: result.data,
            loading: false,
          },
        });
      })
    );
  }

  @Action(LoadCaseDetail)
  loadCaseDetail(ctx: StateContext<AppStateModel>, action: LoadCaseDetail) {
    console.log('[Action] LoadCaseDetail - Started', {
      caseId: action.payload,
    });
    const state = ctx.getState();
    ctx.setState({
      ...state,
      caseDetail: {
        ...state.caseDetail,
        loading: true,
      },
    });

    return this.caseService.getCaseDetail(action.payload).pipe(
      tap((result) => {
        console.log('[Action] LoadCaseDetail - Completed', { result });
        ctx.setState({
          ...ctx.getState(),
          caseDetail: {
            selectedCase: result,
            documents: result.documents,
            notes: result.notes,
            selectedDocumentId: null,
            rightTabs: result.rightTabs,
            loading: false,
          },
        });
      })
    );
  }

  @Action(SelectDocument)
  selectDocument(ctx: StateContext<AppStateModel>, action: SelectDocument) {
    console.log('[Action] SelectDocument', { documentId: action.payload });
    const state = ctx.getState();
    ctx.setState({
      ...state,
      caseDetail: {
        ...state.caseDetail,
        selectedDocumentId: action.payload,
      },
    });
    console.log('[Action] SelectDocument - Completed');
  }

  @Action(AddNote)
  addNote(ctx: StateContext<AppStateModel>, action: AddNote) {
    console.log('[Action] AddNote - Started', {
      caseId: action.payload.caseId,
      note: action.payload.note,
    });
    const state = ctx.getState();
    ctx.setState({
      ...state,
      caseDetail: {
        ...state.caseDetail,
        notes: [...state.caseDetail.notes, action.payload.note],
      },
    });
    console.log('[Action] AddNote - Completed');
  }

  @Action(UpdateNote)
  updateNote(ctx: StateContext<AppStateModel>, action: UpdateNote) {
    console.log('[Action] UpdateNote - Started', {
      caseId: action.payload.caseId,
      note: action.payload.note,
    });
    const state = ctx.getState();
    const updatedNotes = state.caseDetail.notes.map((note) =>
      note.id === action.payload.note.id ? action.payload.note : note
    );

    ctx.setState({
      ...state,
      caseDetail: {
        ...state.caseDetail,
        notes: updatedNotes,
      },
    });
    console.log('[Action] UpdateNote - Completed');
  }

  @Action(DeleteNote)
  deleteNote(ctx: StateContext<AppStateModel>, action: DeleteNote) {
    console.log('[Action] DeleteNote - Started', {
      caseId: action.payload.caseId,
      noteId: action.payload.noteId,
    });
    const state = ctx.getState();
    ctx.setState({
      ...state,
      caseDetail: {
        ...state.caseDetail,
        notes: state.caseDetail.notes.filter(
          (note) => note.id !== action.payload.noteId
        ),
      },
    });
    console.log('[Action] DeleteNote - Completed');
  }

  @Action(UpdateDocument)
  updateDocument(ctx: StateContext<AppStateModel>, action: UpdateDocument) {
    const state = ctx.getState();
    const updatedDocuments = state.caseDetail.documents.data.map((doc) =>
      doc.id === action.document.id ? action.document : doc
    );

    ctx.patchState({
      caseDetail: {
        ...state.caseDetail,
        documents: {
          ...state.caseDetail.documents,
          data: updatedDocuments,
        },
      },
    });
  }

  @Action(UpdateFormField)
  updateFormField(ctx: StateContext<AppStateModel>, action: UpdateFormField) {
    const state = ctx.getState();
    const updatedTabs = state.caseDetail.rightTabs.map((tab) => {
      if (
        tab.type === TabType.FORM &&
        (action.payload.tabId === undefined || tab.id === action.payload.tabId)
      ) {
        // Cast to proper types for type safety
        const formTab = tab as DynamicTab;
        const formConfig = formTab.config as FormConfig;

        // Create a new config with updated fields
        const updatedConfig: FormConfig = {
          ...formConfig,
          fields: formConfig.fields.map((field) => {
            if (field.id === action.payload.fieldId) {
              // Create a new field object with the documentRef
              return {
                ...field,
                documentRef: action.payload.documentRef,
              };
            }
            return field;
          }),
        };

        return {
          ...tab,
          config: updatedConfig,
        };
      }
      return tab;
    });

    ctx.patchState({
      caseDetail: {
        ...state.caseDetail,
        rightTabs: updatedTabs,
      },
    });

    console.log('[Action] UpdateFormField - Completed', {
      fieldId: action.payload.fieldId,
      documentRef: action.payload.documentRef,
    });
  }
}
