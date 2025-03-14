export interface Document {
  id: string;
  type: string;
  description: string;
  fileName: string;
  fileUrl: string;
  dataPoints?: DocumentDataPoint[];
}

export interface DocumentDataPoint {
  fieldName: string;
  value: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
