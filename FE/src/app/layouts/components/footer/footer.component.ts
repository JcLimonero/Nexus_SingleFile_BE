import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BrandingService } from '../../../core/services/branding.service';
import { AsyncPipe, NgIf } from '@angular/common';
@Component({
  selector: 'vex-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, AsyncPipe, NgIf]
})
export class FooterComponent implements OnInit, OnDestroy {
  branding$ = this.brandingService.getBranding$();

  constructor(private readonly brandingService: BrandingService) {}

  ngOnInit() {}

  ngOnDestroy(): void {}
}
