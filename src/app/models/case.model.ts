export interface Case {
  id: string;
  referenceId: string;
  dueDate: string;
  lives: number;
  sla: string;
  receivedDate: string;
  broker: string;
}

export interface Column {
  field: string;
  header: string;
}

export interface Document {
  id: string;
  docType: string;
  description: string;
  fileName: string;
  fileUrl: string;
  coordinates?: {
    x: number;
    y: number;
  }[];
}

export interface Note {
  id: string;
  content: string;
  lastUpdated: string;
}

export interface DynamicTab {
  id: string;
  label: string;
  type: 'form' | 'table';
  data: any;
  columns?: Column[];
  formFields?: any[];
}
