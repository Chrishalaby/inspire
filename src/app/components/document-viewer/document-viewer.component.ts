import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  afterNextRender,
  input,
  output,
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
    <div class="document-container" #containerEl>
      @if(loading()){
      <div class="flex justify-content-center">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <span class="ml-2">Loading document...</span>
      </div>
      }

      <iframe
        #docViewer
        [src]="safeDocUrl()"
        [style.display]="loading() ? 'none' : 'block'"
        style="width: 100%; height: 100%; border: none;"
        (load)="onIframeLoaded()"
      >
      </iframe>

      @if(highlightMode()){
      <div
        class="selection-overlay"
        (mousedown)="startSelection($event)"
        #selectionOverlay
      ></div>
      } @if(selectionBox()){
      <div
        class="selection-box"
        [style.top.px]="selectionBox()?.top"
        [style.left.px]="selectionBox()?.left"
        [style.width.px]="selectionBox()?.width"
        [style.height.px]="selectionBox()?.height"
      ></div>
      } @if(activeHighlight()){
      <div
        class="highlight-overlay"
        [style.top.px]="activeHighlight()?.y"
        [style.left.px]="activeHighlight()?.x"
        [style.width.px]="activeHighlight()?.width"
        [style.height.px]="activeHighlight()?.height"
      ></div>
      } @if(highlightMode()){
      <div class="highlight-instructions">
        <p>Draw a box to highlight an area</p>
      </div>
      }
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

      .selection-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        cursor: crosshair;
      }

      .selection-box {
        position: absolute;
        border: 2px dashed #007ad9;
        background-color: rgba(0, 122, 217, 0.2);
        z-index: 11;
        pointer-events: none;
      }

      .highlight-instructions {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        z-index: 12;
      }
    `,
  ],
})
export class DocumentViewerComponent implements OnInit, OnDestroy {
  docViewer = viewChild.required<ElementRef<HTMLIFrameElement>>('docViewer');
  containerEl = viewChild.required<ElementRef<HTMLDivElement>>('containerEl');
  selectionOverlay =
    viewChild.required<ElementRef<HTMLDivElement>>('selectionOverlay');

  readonly document = input<Document>();
  readonly highlightMode = input<boolean>(false);

  readonly areaSelected = output<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>();

  safeDocUrl = signal<SafeResourceUrl | null>(null);
  loading = signal<boolean>(true);
  activeHighlight = signal<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  selectionBox = signal<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  private highlightListener: any;
  private isSelecting = false;
  private selectionStart = { x: 0, y: 0 };
  private mouseMoveHandler: (event: MouseEvent) => void;
  private mouseUpHandler: (event: MouseEvent) => void;
  private mouseLeaveHandler: (event: MouseEvent) => void;

  constructor(private sanitizer: DomSanitizer) {
    // Pre-bind event handlers to maintain correct 'this' context
    this.mouseMoveHandler = this.updateSelection.bind(this);
    this.mouseUpHandler = this.endSelection.bind(this);
    this.mouseLeaveHandler = this.endSelection.bind(this);

    afterNextRender(() => {
      // Process document URL safely
      if (this.document()) {
        this.safeDocUrl.set(
          this.sanitizer.bypassSecurityTrustResourceUrl(
            this.document()?.fileUrl || ''
          )
        );
      }

      // Setup highlight listener
      this.setupHighlightListener();

      // Setup selection events after elements are rendered
      this.setupSelectionEvents();
    });
  }

  ngOnInit(): void {
    // Setup will be handled in afterNextRender
  }

  ngOnDestroy(): void {
    if (this.highlightListener) {
      window.removeEventListener(
        'highlight-document-point',
        this.highlightListener
      );
    }

    this.removeSelectionEvents();
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

  setupSelectionEvents(): void {
    const overlayEl = this.selectionOverlay();
    if (overlayEl && overlayEl.nativeElement) {
      overlayEl.nativeElement.addEventListener(
        'mousemove',
        this.mouseMoveHandler
      );
      overlayEl.nativeElement.addEventListener('mouseup', this.mouseUpHandler);
      overlayEl.nativeElement.addEventListener(
        'mouseleave',
        this.mouseLeaveHandler
      );
    }
  }

  removeSelectionEvents(): void {
    const overlayEl = this.selectionOverlay();
    if (overlayEl && overlayEl.nativeElement) {
      overlayEl.nativeElement.removeEventListener(
        'mousemove',
        this.mouseMoveHandler
      );
      overlayEl.nativeElement.removeEventListener(
        'mouseup',
        this.mouseUpHandler
      );
      overlayEl.nativeElement.removeEventListener(
        'mouseleave',
        this.mouseLeaveHandler
      );
    }
  }

  startSelection(event: MouseEvent): void {
    this.isSelecting = true;

    const containerElement = this.containerEl();
    if (!containerElement || !containerElement.nativeElement) return;

    const container = containerElement.nativeElement.getBoundingClientRect();
    this.selectionStart = {
      x: event.clientX - container.left,
      y: event.clientY - container.top,
    };

    this.selectionBox.set({
      top: this.selectionStart.y,
      left: this.selectionStart.x,
      width: 0,
      height: 0,
    });
  }

  updateSelection(event: MouseEvent): void {
    if (!this.isSelecting) return;

    const containerElement = this.containerEl();
    if (!containerElement || !containerElement.nativeElement) return;

    const container = containerElement.nativeElement.getBoundingClientRect();
    const currentX = event.clientX - container.left;
    const currentY = event.clientY - container.top;

    const width = currentX - this.selectionStart.x;
    const height = currentY - this.selectionStart.y;

    // Handle selection in any direction (negative width/height)
    const left = width < 0 ? currentX : this.selectionStart.x;
    const top = height < 0 ? currentY : this.selectionStart.y;

    this.selectionBox.set({
      top,
      left,
      width: Math.abs(width),
      height: Math.abs(height),
    });
  }

  endSelection(event: MouseEvent): void {
    if (!this.isSelecting) return;
    this.isSelecting = false;

    const selection = this.selectionBox();
    if (selection && selection.width > 10 && selection.height > 10) {
      // Emit the selected area
      this.areaSelected.emit({
        x: selection.left,
        y: selection.top,
        width: selection.width,
        height: selection.height,
      });
    }

    // Clear selection box after a short delay
    setTimeout(() => {
      this.selectionBox.set(null);
    }, 200);
  }
}
