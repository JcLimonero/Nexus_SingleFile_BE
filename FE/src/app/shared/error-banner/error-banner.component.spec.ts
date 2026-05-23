import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorBannerComponent } from './error-banner.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ErrorBannerComponent', () => {
  let component: ErrorBannerComponent;
  let fixture: ComponentFixture<ErrorBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorBannerComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorBannerComponent);
    component = fixture.componentInstance;
    // SVG icons no registrados en el harness de test — desactivar
    component.icon = '';
  });

  it('no renderiza nada sin message', () => {
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector('.error-banner');
    expect(banner).toBeNull();
  });

  it('renderiza message y aplica role=alert para a11y', () => {
    fixture.componentRef.setInput('message', 'Algo falló');
    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('.error-banner');
    expect(banner).toBeTruthy();
    expect(banner.getAttribute('role')).toBe('alert');
    expect(banner.getAttribute('aria-live')).toBe('assertive');
    expect(banner.textContent).toContain('Algo falló');
  });

  it('emite retry al hacer click en el botón', () => {
    fixture.componentRef.setInput('message', 'oops');
    fixture.componentRef.setInput('showRetry', true);
    fixture.detectChanges();

    spyOn(component.retry, 'emit');
    const btn = fixture.nativeElement.querySelector('.error-banner__action');
    btn.click();

    expect(component.retry.emit).toHaveBeenCalled();
  });

  it('no muestra el botón retry si showRetry=false', () => {
    fixture.componentRef.setInput('message', 'oops');
    fixture.componentRef.setInput('showRetry', false);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('.error-banner__action');
    expect(btn).toBeNull();
  });

  it('aplica variant warn cuando severity=warn', () => {
    fixture.componentRef.setInput('message', 'cuidado');
    fixture.componentRef.setInput('severity', 'warn');
    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('.error-banner');
    expect(banner.classList.contains('error-banner--warn')).toBe(true);
  });
});
