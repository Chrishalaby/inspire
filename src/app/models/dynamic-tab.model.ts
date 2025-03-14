export enum TabType {
  FORM = 'form',
  TABLE = 'table',
}

export interface DynamicTab {
  id: string;
  title: string;
  type: TabType;
  config: FormConfig | TableConfig;
}

export interface FormConfig {
  fields: FormField[];
}

export interface FormField {
  id: string;
  label: string;
  type: string;
  value?: any;
  required?: boolean;
  options?: { label: string; value: any }[];
  documentRef?: {
    documentId: string;
    x: number;
    y: number;
  };
}

export interface TableConfig {
  columns: ColumnDefinition[];
  data: any[];
}

export interface ColumnDefinition {
  field: string;
  header: string;
  sortable?: boolean;
  filter?: boolean;
}
