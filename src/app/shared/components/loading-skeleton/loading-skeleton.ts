import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SkeletonVariant = 'cards' | 'table' | 'feed' | 'text';

@Component({
  selector: 'app-loading-skeleton',
  templateUrl: './loading-skeleton.html',
  styleUrl: './loading-skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSkeleton {
  readonly variant = input<SkeletonVariant>('text');
  readonly rows = input<number>(3);

  protected readonly rowsArray = computed<readonly number[]>(() =>
    Array.from({ length: this.rows() }, (_, index) => index),
  );
}
