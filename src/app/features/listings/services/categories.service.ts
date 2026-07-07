export interface Category {
  readonly id: number;
  readonly parentId: number | null;
  readonly name: string;
  readonly children: Category[];
}