import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    // Iconos SVG no están registrados en el harness de test; usar string vacío
    // hace que *ngIf="icon" no renderice <mat-icon> y evita el error de lookup.
    component.icon = '';
  });

  it('renderiza con title/description default', () => {
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector('.empty-state');
    expect(root.getAttribute('role')).toBe('status');
    expect(root.getAttribute('aria-live')).toBe('polite');
    expect(root.querySelector('.empty-state__title').textContent).toContain('Sin datos');
  });

  it('renderiza CTA solo cuando ctaText está presente', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.empty-state__cta')).toBeNull();

    // setInput notifica OnPush correctamente; asignación directa no.
    fixture.componentRef.setInput('ctaText', 'Agregar');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.empty-state__cta');
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Agregar');
  });

  it('emite ctaClick cuando el CTA se clickea', () => {
    fixture.componentRef.setInput('ctaText', 'Acción');
    fixture.detectChanges();

    spyOn(component.ctaClick, 'emit');
    fixture.nativeElement.querySelector('.empty-state__cta').click();
    expect(component.ctaClick.emit).toHaveBeenCalled();
  });

  it('muestra el title custom y description provistos por input', () => {
    fixture.componentRef.setInput('title', 'Vacío');
    fixture.componentRef.setInput('description', 'Aún no hay nada que mostrar');
    fixture.detectChanges();

    const root = fixture.nativeElement;
    expect(root.querySelector('.empty-state__title').textContent).toContain('Vacío');
    expect(root.querySelector('.empty-state__description').textContent).toContain('Aún no hay nada');
  });
});
