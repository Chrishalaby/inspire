import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  afterNextRender,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Document } from '../../models/document.model';

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="document-container">
      <div *ngIf="loading()" class="flex justify-content-center">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <span class="ml-2">Loading document...</span>
      </div>

      <iframe
        #docViewer
        [src]="safeDocUrl()"
        [style.display]="loading() ? 'none' : 'block'"
        style="width: 100%; height: 100%; border: none;"
        (load)="onIframeLoaded()"
      >
      </iframe>

      <div
        *ngIf="activeHighlight()"
        class="highlight-overlay"
        [style.top.px]="activeHighlight()?.y"
        [style.left.px]="activeHighlight()?.x"
        [style.width.px]="activeHighlight()?.width"
        [style.height.px]="activeHighlight()?.height"
      ></div>
    </div>
  `,
  styles: [
    `
      .document-container {
        position: relative;
        width: 100%;
        height: 600px;
        border: 1px solid #dee2e6;
      }

      .highlight-overlay {
        position: absolute;
        background-color: rgba(255, 255, 0, 0.4);
        border: 2px solid yellow;
        pointer-events: none;
      }
    `,
  ],
})
export class DocumentViewerComponent implements OnInit, OnDestroy {
  protected readonly docViewer = viewChild<HTMLIFrameElement>('docViewer');

  readonly document = input<Document>();

  safeDocUrl = signal<SafeResourceUrl | null>(null);
  loading = signal<boolean>(true);
  activeHighlight = signal<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  private highlightListener: any;

  constructor(private sanitizer: DomSanitizer) {
    afterNextRender(() => {
      // Setup highlight listener
      this.setupHighlightListener();

      // Process document URL safely
      if (this.document()) {
        this.safeDocUrl.set(
          this.sanitizer.bypassSecurityTrustResourceUrl(
            this.document()?.fileUrl || ''
          )
        );
      }
    });
  }

  ngOnInit(): void {
    this.setupHighlightListener();
  }

  ngOnDestroy(): void {
    if (this.highlightListener) {
      window.removeEventListener(
        'highlight-document-point',
        this.highlightListener
      );
    }
  }

  setupHighlightListener(): void {
    this.highlightListener = (event: any) => {
      if (!this.document || this.document()?.id !== event.detail.documentId)
        return;

      const { x, y } = event.detail;

      // Find the data point that matches these coordinates
      const dataPoint = this.document()?.dataPoints?.find(
        (dp) => dp.x === x && dp.y === y
      );

      if (dataPoint) {
        this.activeHighlight.set({
          x: dataPoint.x,
          y: dataPoint.y,
          width: dataPoint.width,
          height: dataPoint.height,
        });

        // Clear highlight after 3 seconds
        setTimeout(() => {
          this.activeHighlight.set(null);
        }, 3000);
      }
    };

    window.addEventListener('highlight-document-point', this.highlightListener);
  }

  onIframeLoaded(): void {
    this.loading.set(false);
  }
}
