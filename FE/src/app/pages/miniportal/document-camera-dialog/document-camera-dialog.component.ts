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
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';

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
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSliderModule
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
  zoomLevel = 1;
  readonly zoomMin = 1;
  readonly zoomMax = 3;
  hasOpticalZoom = false;
  highlightInterval: ReturnType<typeof setInterval> | null = null;
  private pinchStartDistance = 0;
  private pinchStartZoom = 1;
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
      if (!window.isSecureContext) {
        throw new Error('El acceso a la cámara requiere HTTPS. Abre la página con https://');
      }
      const mediaDevices = navigator.mediaDevices;
      if (!mediaDevices || !mediaDevices.getUserMedia) {
        throw new Error(
          'Tu navegador no soporta el acceso a la cámara. En Safari: verifica que no tengas activado el "Modo de bloqueo" (Ajustes > Privacidad).'
        );
      }

      const constraints: MediaStreamConstraints[] = [
        { video: { facingMode: 'environment' } },
        { video: true }
      ];

      let lastError: Error | null = null;
      for (const c of constraints) {
        try {
          this.stream = await mediaDevices.getUserMedia(c);
          break;
        } catch (e) {
          lastError = e instanceof Error ? e : new Error(String(e));
        }
      }

      if (!this.stream) {
        throw lastError ?? new Error('No se pudo acceder a la cámara');
      }

      this.status = 'camera';
      this.detectZoomCapability();
      this.applyMinZoom();
      this.cdr.markForCheck();

      setTimeout(() => this.startHighlightLoop(), 300);
    } catch (err) {
      this.status = 'error';
      const msg = err instanceof Error ? err.message : 'No se pudo acceder a la cámara. Verifica los permisos.';
      this.errorMessage = this.getSafariFriendlyMessage(msg);
      this.cdr.markForCheck();
    }
  }

  private detectZoomCapability(): void {
    const videoTrack = this.stream?.getVideoTracks()[0];
    if (!videoTrack?.getCapabilities) return;
    const caps = videoTrack.getCapabilities() as { zoom?: { min?: number; max?: number } };
    if (caps?.zoom?.min != null && caps?.zoom?.max != null && caps.zoom.max > caps.zoom.min) {
      this.hasOpticalZoom = true;
    }
  }

  private applyMinZoom(): void {
    if (this.hasOpticalZoom && this.stream) {
      const videoTrack = this.stream.getVideoTracks()[0];
      const caps = videoTrack?.getCapabilities?.() as { zoom?: { min?: number } } | undefined;
      const minZoom = caps?.zoom?.min ?? 1;
      this.zoomLevel = minZoom;
      videoTrack?.applyConstraints?.({ advanced: [{ zoom: minZoom } as MediaTrackConstraintSet] }).catch(() => {
        this.hasOpticalZoom = false;
      });
    }
  }

  formatZoom = (v: number): string => `${Math.round(v * 100) / 100}x`;

  onTouchStart(e: TouchEvent): void {
    if (e.touches.length === 2) {
      this.pinchStartDistance = this.getTouchDistance(e);
      this.pinchStartZoom = this.zoomLevel;
    }
  }

  onTouchMove(e: TouchEvent): void {
    if (e.touches.length === 2 && this.pinchStartDistance > 0) {
      e.preventDefault();
      const dist = this.getTouchDistance(e);
      const ratio = dist / this.pinchStartDistance;
      const newZoom = Math.max(this.zoomMin, Math.min(this.zoomMax, this.pinchStartZoom * ratio));
      this.onZoomChange(newZoom);
    }
  }

  onTouchEnd(): void {
    this.pinchStartDistance = 0;
  }

  private getTouchDistance(e: TouchEvent): number {
    if (e.touches.length < 2) return 0;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  onZoomChange(value: number): void {
    this.zoomLevel = Math.max(this.zoomMin, Math.min(this.zoomMax, value));
    if (this.hasOpticalZoom && this.stream) {
      const videoTrack = this.stream.getVideoTracks()[0];
      videoTrack?.applyConstraints?.({ advanced: [{ zoom: this.zoomLevel } as MediaTrackConstraintSet] }).catch(() => {
        this.hasOpticalZoom = false;
        this.cdr.markForCheck();
      });
    }
    this.cdr.markForCheck();
  }

  private getSafariFriendlyMessage(original: string): string {
    const isSafari = /Safari|iPhone|iPad|iPod/.test(navigator.userAgent) && !/Chrome|CriOS|FxiOS/.test(navigator.userAgent);
    if (isSafari && (original.includes('Permission') || original.includes('NotAllowed') || original.includes('NotFound'))) {
      return 'No se pudo acceder a la cámara. En Safari: Ajustes > Safari > Cámara > Permite, o desactiva el Modo de bloqueo.';
    }
    return original;
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

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      canvasSrc.width = vw;
      canvasSrc.height = vh;
      canvasRes.width = vw;
      canvasRes.height = vh;

      if (this.hasOpticalZoom || this.zoomLevel <= 1) {
        ctxSrc.drawImage(video, 0, 0);
      } else {
        const z = this.zoomLevel;
        const sx = (vw - vw / z) / 2;
        const sy = (vh - vh / z) / 2;
        const sw = vw / z;
        const sh = vh / z;
        ctxSrc.drawImage(video, sx, sy, sw, sh, 0, 0, vw, vh);
      }
      try {
        const highlighted = this.scanner!.highlightPaper(canvasSrc, { color: '#22c55e', thickness: 2 });
        ctxRes.drawImage(highlighted, 0, 0);
      } catch {
        ctxRes.drawImage(canvasSrc, 0, 0);
      }
    };

    video.srcObject = this.stream;
    video.onloadedmetadata = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Safari puede requerir interacción del usuario; el video puede funcionar igual
        });
      }
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

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    canvasSrc.width = vw;
    canvasSrc.height = vh;

    if (this.hasOpticalZoom || this.zoomLevel <= 1) {
      ctx.drawImage(video, 0, 0);
    } else {
      const z = this.zoomLevel;
      const sx = (vw - vw / z) / 2;
      const sy = (vh - vh / z) / 2;
      const sw = vw / z;
      const sh = vh / z;
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, vw, vh);
    }

    const resultWidth = 2400;
    const resultHeight = Math.round(2400 * (video.videoHeight / video.videoWidth));

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
        0.95
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
