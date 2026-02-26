import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface DocumentCameraDialogData {
  documentName: string;
}

export interface DocumentCameraDialogResult {
  file: File;
}

declare global {
  interface Window {
    cv?: unknown;
    jscanify?: new () => {
      highlightPaper: (image: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement, options?: { color?: string; thickness?: number }) => HTMLCanvasElement;
      extractPaper: (image: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement, resultWidth: number, resultHeight: number, cornerPoints?: unknown) => HTMLCanvasElement | null;
    };
  }
}

@Component({
  selector: 'app-document-camera-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './document-camera-dialog.component.html',
  styleUrl: './document-camera-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentCameraDialogComponent implements OnInit, OnDestroy {
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasSource') canvasSource!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasResult') canvasResult!: ElementRef<HTMLCanvasElement>;

  status: 'loading' | 'camera' | 'error' | 'capturing' = 'loading';
  errorMessage = '';
  stream: MediaStream | null = null;
  highlightInterval: ReturnType<typeof setInterval> | null = null;
  scanner: InstanceType<NonNullable<typeof window.jscanify>> | null = null;

  private readonly OPENCV_URL = 'https://docs.opencv.org/4.7.0/opencv.js';
  private readonly JSCANIFY_URL = 'https://cdn.jsdelivr.net/gh/ColonelParrot/jscanify@master/src/jscanify.min.js';

  constructor(
    public dialogRef: MatDialogRef<DocumentCameraDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentCameraDialogData,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadScriptsAndStartCamera();
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  private loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${url}`));
      document.head.appendChild(script);
    });
  }

  private waitForOpenCV(): Promise<void> {
    return new Promise((resolve) => {
      const cv = (window as { cv?: { Mat?: unknown } }).cv;
      if (cv?.Mat) {
        resolve();
        return;
      }
      const check = () => {
        const c = (window as { cv?: { Mat?: unknown } }).cv;
        if (c?.Mat) {
          resolve();
          return;
        }
        setTimeout(check, 50);
      };
      check();
    });
  }

  private async loadScriptsAndStartCamera(): Promise<void> {
    try {
      await this.loadScript(this.OPENCV_URL);
      await this.waitForOpenCV();
      await this.loadScript(this.JSCANIFY_URL);

      if (!window.jscanify) {
        throw new Error('jscanify no se cargó correctamente');
      }

      this.scanner = new window.jscanify();
      await this.startCamera();
    } catch (err) {
      this.status = 'error';
      this.errorMessage = err instanceof Error ? err.message : 'Error al cargar el escáner de documentos';
      this.cdr.markForCheck();
    }
  }

  private async startCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      this.status = 'camera';
      this.cdr.markForCheck();

      setTimeout(() => this.startHighlightLoop(), 300);
    } catch (err) {
      this.status = 'error';
      this.errorMessage = err instanceof Error ? err.message : 'No se pudo acceder a la cámara. Verifica los permisos.';
      this.cdr.markForCheck();
    }
  }

  private startHighlightLoop(): void {
    const video = this.videoEl?.nativeElement;
    const canvasSrc = this.canvasSource?.nativeElement;
    const canvasRes = this.canvasResult?.nativeElement;

    if (!video || !canvasSrc || !canvasRes || !this.scanner || !this.stream) return;

    const ctxSrc = canvasSrc.getContext('2d');
    const ctxRes = canvasRes.getContext('2d');
    if (!ctxSrc || !ctxRes) return;

    const draw = () => {
      if (video.readyState !== video.HAVE_ENOUGH_DATA || this.status !== 'camera') return;

      canvasSrc.width = video.videoWidth;
      canvasSrc.height = video.videoHeight;
      canvasRes.width = video.videoWidth;
      canvasRes.height = video.videoHeight;

      ctxSrc.drawImage(video, 0, 0);
      try {
        const highlighted = this.scanner!.highlightPaper(canvasSrc, { color: '#0ea5e9', thickness: 4 });
        ctxRes.drawImage(highlighted, 0, 0);
      } catch {
        ctxRes.drawImage(canvasSrc, 0, 0);
      }
    };

    video.srcObject = this.stream;
    video.onloadedmetadata = () => {
      video.play();
      this.highlightInterval = setInterval(draw, 80);
    };
  }

  private stopCamera(): void {
    if (this.highlightInterval) {
      clearInterval(this.highlightInterval);
      this.highlightInterval = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
  }

  onCapture(): void {
    const video = this.videoEl?.nativeElement;
    const canvasSrc = this.canvasSource?.nativeElement;

    if (!video || !canvasSrc || !this.scanner) return;

    this.status = 'capturing';
    this.cdr.markForCheck();

    const ctx = canvasSrc.getContext('2d');
    if (!ctx) {
      this.status = 'camera';
      this.cdr.markForCheck();
      return;
    }

    canvasSrc.width = video.videoWidth;
    canvasSrc.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const resultWidth = 1200;
    const resultHeight = Math.round(1200 * (video.videoHeight / video.videoWidth));

    try {
      const resultCanvas = this.scanner.extractPaper(canvasSrc, resultWidth, resultHeight);

      if (!resultCanvas) {
        this.status = 'camera';
        this.cdr.markForCheck();
        return;
      }

      resultCanvas.toBlob(
        (blob) => {
          if (!blob) {
            this.status = 'camera';
            this.cdr.markForCheck();
            return;
          }
          const file = new File([blob], `documento-${Date.now()}.jpg`, { type: 'image/jpeg' });
          this.dialogRef.close({ file } as DocumentCameraDialogResult);
        },
        'image/jpeg',
        0.92
      );
    } catch {
      this.status = 'camera';
      this.cdr.markForCheck();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
