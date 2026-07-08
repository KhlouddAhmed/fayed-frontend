import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Material, MaterialFormValue } from '../../models/material.model';
import { CategoriesService, Category } from '../../services/categories.service';

const EMPTY_FORM_VALUE: MaterialFormValue = {
  title: '',
  categoryId: 0,
  materialCondition: 'New',
  description: '',
  quantity: 0,
  price: 0,
  mediaFiles: []
};

function toFormValue(material: Material): MaterialFormValue {
  return {
    title: material.name,
    categoryId: material.categoryId ?? 0,
    materialCondition: material.condition ?? 'New',
    description: material.description,
    quantity: material.availableQuantity,
    price: material.pricePerUnit,
    mediaFiles: [] // الملفات لا يتم جلبها في التعديل عادة
  };
}

@Component({
  selector: 'app-add-material-modal',
  imports: [FormsModule],
  templateUrl: './add-material-modal.html',
  styleUrl: './add-material-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMaterialModal implements OnInit {
  private readonly categoriesService = inject(CategoriesService);

  readonly editingMaterial = input<Material | null>(null);
  readonly isSubmitting = input<boolean>(false);

  readonly cancel = output<void>();
  readonly submitForm = output<MaterialFormValue>();

  protected readonly formValue = signal<MaterialFormValue>(EMPTY_FORM_VALUE);
  protected readonly categories = signal<Category[]>([]);
  protected readonly isEditMode = computed(() => this.editingMaterial() !== null);

  protected readonly isFormValid = computed(() => {
    const value = this.formValue();
    return (
      value.title.trim().length > 0 &&
      value.categoryId > 0 &&
      value.quantity > 0 &&
      value.price > 0
    );
  });

  constructor() {
    effect(() => {
      const editing = this.editingMaterial();
      this.formValue.set(editing ? toFormValue(editing) : EMPTY_FORM_VALUE);
    });
  }

  ngOnInit(): void {
    this.categoriesService.getAll().subscribe({
      next: cats => this.categories.set(cats as Category[]),
    });
  }

  protected updateField<K extends keyof MaterialFormValue>(field: K, rawValue: string): void {
    const numericFields: readonly (keyof MaterialFormValue)[] = ['quantity', 'price', 'categoryId'];
    const parsedValue = numericFields.includes(field) ? Number(rawValue) : rawValue;
    this.formValue.update(current => ({ ...current, [field]: parsedValue }));
  }

  protected onSubmit(): void {
    if (!this.isFormValid()) return;
    this.submitForm.emit(this.formValue());
  }

  protected onImagesSelected(files: FileList | null): void {
    if (!files) return;
    this.formValue.update(current => ({ ...current, mediaFiles: Array.from(files) }));
  }
}