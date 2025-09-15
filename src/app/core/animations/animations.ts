import { trigger, transition, style, animate } from '@angular/animations';

export const fadeInDown = trigger('fadeInDown', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-20px)' }),
    animate(
      '{{duration}} {{delay}} ease-out',
      style({ opacity: 1, transform: 'translateY(0)' })
    )
  ], { params: { duration: '300ms', delay: '0ms' } })
]);
