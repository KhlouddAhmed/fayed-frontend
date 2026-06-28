import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { Material, MaterialFormValue, MaterialStatus } from '../../models/material.model';

const EMPTY_FORM_VALUE: MaterialFormValue = {
  name: '',
  category: '',
  status: 'active',
  description: '',
  availableQuantity: 0,
  minOrderQuantity: 0,
  unit: 'طن',
  pricePerUnit: 0,
};

function toFormValue(material: Material): MaterialFormValue {
  return {
    name: material.name,
    category: material.category,
    status: material.status,
    description: material.description,
    availableQuantity: material.availableQuantity,
    minOrderQuantity: material.minOrderQuantity,
    unit: material.unit,
    pricePerUnit: material.pricePerUnit,
  };
}

@Component({
  selector: 'app-add-material-modal',
  templateUrl: './add-material-modal.html',
  styleUrl: './add-material-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMaterialModal {
  readonly editingMaterial = input<Material | null>(null);
  readonly isSubmitting = input<boolean>(false);

  readonly cancel = output<void>();
  readonly submitForm = output<MaterialFormValue>();

  protected readonly formValue = signal<MaterialFormValue>(EMPTY_FORM_VALUE);

  protected readonly isEditMode = computed(() => this.editingMaterial() !== null);

  protected readonly isFormValid = computed(() => {
    const value = this.formValue();
    return (
      value.name.trim().length > 0 &&
      value.category.trim().length > 0 &&
      value.availableQuantity > 0 &&
      value.minOrderQuantity > 0 &&
      value.pricePerUnit > 0
    );
  });

  constructor() {
    effect(() => {
      const editing = this.editingMaterial();
      this.formValue.set(editing ? toFormValue(editing) : EMPTY_FORM_VALUE);
    });
  }

  protected updateField<K extends keyof MaterialFormValue>(
    field: K,
    rawValue: string,
  ): void {
    const numericFields: readonly (keyof MaterialFormValue)[] = [
      'availableQuantity',
      'minOrderQuantity',
      'pricePerUnit',
    ];

    const parsedValue = numericFields.includes(field) ? Number(rawValue) : rawValue;

    this.formValue.update((current) => ({
      ...current,
      [field]: parsedValue,
    }));
  }

  protected updateStatus(status: MaterialStatus): void {
    this.formValue.update((current) => ({ ...current, status }));
  }

  protected onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.submitForm.emit(this.formValue());
  }
}
