import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy } from '@angular/core';

@Directive({ selector: '[appFlipContainer]' })
export class FlipContainerDirective implements AfterViewInit, OnDestroy {
  private prev = new Map<string, DOMRect>();
  private mo?: MutationObserver;

  constructor(private host: ElementRef<HTMLElement>, private zone: NgZone) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // Captura inicial
      this.capture();

      // Observa cambios en hijos directos (añadir/quitar/reordenar)
      this.mo = new MutationObserver(() => this.play());
      this.mo.observe(this.host.nativeElement, { childList: true });
    });
  }

  ngOnDestroy() {
    this.mo?.disconnect();
  }

  private children(): HTMLElement[] {
    return Array.from(this.host.nativeElement.children) as HTMLElement[];
  }

  private capture() {
    for (const el of this.children()) {
      const key = el.dataset['key'];
      if (!key) continue;
      this.prev.set(key, el.getBoundingClientRect());
    }
  }

  private play() {
    // Posiciones "después"
    const current = new Map<string, DOMRect>();
    for (const el of this.children()) {
      const key = el.dataset['key'];
      if (!key) continue;
      current.set(key, el.getBoundingClientRect());
    }

    const toAnimate: HTMLElement[] = [];

    for (const el of this.children()) {
      const key = el.dataset['key'];
      if (!key) continue;

      const before = this.prev.get(key);
      const after = current.get(key);
      if (!before || !after) continue;

      const dx = before.left - after.left;
      const dy = before.top - after.top;

      if (dx !== 0 || dy !== 0) {
        // INVERT: aplica el delta como transform inmediato (sin transición)
        el.style.transition = 'transform 0s';
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        toAnimate.push(el);
      }
    }

    // PLAY: siguiente frame → animar hacia identidad
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        for (const el of toAnimate) {
          el.style.transition = 'transform 300ms ease';
          el.style.transform = '';
        }

        // Limpieza + nueva captura tras la animación
        setTimeout(() => {
          for (const el of this.children()) {
            el.style.transition = '';
            el.style.transform = '';
          }
          this.capture();
        }, 350);
      });
    });
  }
}
