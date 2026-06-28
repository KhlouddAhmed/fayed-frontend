import { Pipe, PipeTransform } from '@angular/core';

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

@Pipe({
  name: 'relativeTime',
  pure: false,
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: Date): string {
    const diffMs = Date.now() - value.getTime();

    if (diffMs < MINUTE_MS) {
      return 'منذ لحظات';
    }

    if (diffMs < HOUR_MS) {
      const minutes = Math.floor(diffMs / MINUTE_MS);
      return `منذ ${minutes} دقيقة`;
    }

    if (diffMs < DAY_MS) {
      const hours = Math.floor(diffMs / HOUR_MS);
      return `منذ ${hours} ساعة`;
    }

    const days = Math.floor(diffMs / DAY_MS);
    return `منذ ${days} يوم`;
  }
}
