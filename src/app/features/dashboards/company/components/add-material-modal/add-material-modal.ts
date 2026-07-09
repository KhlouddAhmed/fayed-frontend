import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Material,
  MaterialCondition,
  MaterialFormValue,
  DeliveryType,
  PaymentMethod,
} from '../../models/material.model';
import { CategoriesService, Category } from '../../services/categories.service';

const EMPTY_FORM_VALUE: MaterialFormValue = {
  title: '',
  description: '',
  categoryId: 0,
  materialType: '',
  materialCondition: 'New',
  quantity: 0,
  measureUnit: 'طن',
  minPrice: 0,
  maxPrice: 0,
  minOrderQuantity: 1,
  isNegotiable: true,
  isDivisible: false,
  deliveryType: 'Both',
  preferPayMethod: 'Escrow',
  expiryDate: '',
  imageFiles: [],
  videoFile: null,
  certificateFile: null,
};

function toFormValue(material: Material): MaterialFormValue {
  return {
    title: material.name,
    categoryId: material.categoryId ?? 0,
    materialType: material.materialType ?? '',
    materialCondition: material.condition ?? 'New',
    description: material.description,
    quantity: material.availableQuantity,
    measureUnit: material.measureUnit ?? 'طن',
    minPrice: material.minPrice ?? 0,
    maxPrice: material.maxPrice ?? 0,
    minOrderQuantity: material.minOrderQuantity ?? 1,
    isNegotiable: material.isNegotiable ?? true,
    isDivisible: material.isDivisible ?? false,
    deliveryType: material.deliveryType ?? 'Both',
    preferPayMethod: material.preferPayMethod ?? 'Escrow',
    expiryDate: material.expiryDate
      ? new Date(material.expiryDate).toISOString().split('T')[0]
      : '',
    imageFiles: [],
    videoFile: null,
    certificateFile: null,
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
    const v = this.formValue();
    return (
      v.title.trim().length > 0 &&
      v.categoryId > 0 &&
      v.materialType.trim().length > 0 &&
      v.quantity > 0 &&
      v.minPrice > 0 &&
      v.minOrderQuantity > 0 &&
      v.expiryDate.length > 0
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

  protected updateField<K extends keyof MaterialFormValue>(
    field: K,
    rawValue: string | boolean
  ): void {
    const numericFields: readonly (keyof MaterialFormValue)[] = [
      'quantity', 'minPrice', 'maxPrice', 'minOrderQuantity', 'categoryId',
    ];
    const booleanFields: readonly (keyof MaterialFormValue)[] = [
      'isNegotiable', 'isDivisible',
    ];

    let parsedValue: string | number | boolean = rawValue;

    if (numericFields.includes(field)) {
      parsedValue = Number(rawValue);
    } else if (booleanFields.includes(field)) {
      parsedValue = rawValue === 'true' || rawValue === true;
    }

    this.formValue.update(current => ({
      ...current,
      [field]: parsedValue,
    }));
  }

  protected onSubmit(): void {
    if (!this.isFormValid()) return;
    this.submitForm.emit(this.formValue());
  }

  protected onImagesSelected(files: FileList | null): void {
    if (!files) return;
    this.formValue.update(current => ({
      ...current,
      imageFiles: Array.from(files),
    }));
  }

  protected onVideoSelected(files: FileList | null): void {
    if (!files || files.length === 0) return;
    this.formValue.update(current => ({
      ...current,
      videoFile: files[0],
    }));
  }

  protected onCertificateSelected(files: FileList | null): void {
    if (!files || files.length === 0) return;
    this.formValue.update(current => ({
      ...current,
      certificateFile: files[0],
    }));
  }
}