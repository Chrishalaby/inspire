import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  highlightDataPoint(documentId: string, x: number, y: number): void {
    // This would typically interact with a PDF viewer component
    console.log(`Highlighting point at (${x}, ${y}) in document ${documentId}`);

    // In a real implementation, this might emit an event or call a method
    // on a PDF viewer component to scroll to and highlight the specified area
    const event = new CustomEvent('highlight-document-point', {
      detail: { documentId, x, y },
    });
    window.dispatchEvent(event);
  }
}
