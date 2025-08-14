import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Breadcrumb } from './breadcrumb.model';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  breadcrumbs: Breadcrumb[] = [];

  constructor() {
    // Recalcular en cada navegación "finalizada"
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.build(this.route.root);
        // marcar el último
        if (this.breadcrumbs.length) {
          this.breadcrumbs = this.breadcrumbs.map((b, i, arr) => ({ ...b, isLast: i === arr.length - 1 }));
        }
      });
  }

  private build(route: ActivatedRoute, url: string = '', acc: Breadcrumb[] = []): Breadcrumb[] {
    const routeConfig = route.routeConfig;
    const snapshot = route.snapshot;

    // Si no hay configuración o es ruta vacía, continuar con hijos
    if (!routeConfig) {
      if (route.firstChild) return this.build(route.firstChild, url, acc);
      return acc;
    }

    // Construir el siguiente fragmento de URL con parámetros
    const path = routeConfig.path || '';
    const parts = path.split('/').filter(Boolean).map(segment => {
      if (segment.startsWith(':')) {
        const paramName = segment.slice(1);
        return snapshot.paramMap.get(paramName) ?? segment;
      }
      return segment;
    });

    const nextUrl = parts.length ? `${url}/${parts.join('/')}` : url;

    // Determinar el label:
    // 1) Preferir data resuelta dinámicamente (resolve: { breadcrumb: ...})
    // 2) Si no, usar data.breadcrumb estático
    // 3) Si no, inferir del path (opcional)
    let label: string | null =
      (snapshot.data && typeof snapshot.data['breadcrumb'] === 'string' && snapshot.data['breadcrumb']) ||
      (routeConfig.data && typeof routeConfig.data['breadcrumb'] === 'string' && routeConfig.data['breadcrumb']) ||
      null;

    // Si no hay label y hay partes literales, usar la última parte como fallback “bonito”
    if (!label && parts.length) {
      const last = parts[parts.length - 1];
      label = this.humanize(last);
    }

    if (label) {
      acc.push({ label, url: nextUrl || '/' });
    }

    // Continuar con el hijo activo
    if (route.firstChild) return this.build(route.firstChild, nextUrl, acc);
    return acc;
  }

  private humanize(value: string): string {
    // Quitar posibles ids, guiones-bajos, etc.
    const clean = value.replace(/[-_]+/g, ' ');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
    // (Puedes mejorar con Intl.Segmenter o un mapa)
  }

  trackByUrl = (_: number, bc: Breadcrumb) => bc.url;
}
