import { MaterialFormValue } from '../models/material.model';

export function adaptMaterialFormToFormData(value: MaterialFormValue): FormData {
  const fd = new FormData();

  fd.append('title', value.title);
  fd.append('description', value.description);
  fd.append('categoryId', String(value.categoryId));
  fd.append('materialType', value.materialType);
  fd.append('materialCondition', value.materialCondition);
  fd.append('quantity', String(value.quantity));
  fd.append('measureUnit', value.measureUnit);
  fd.append('minPrice', String(value.minPrice));
  fd.append('maxPrice', String(value.maxPrice));
  fd.append('minOrderQuantity', String(value.minOrderQuantity));
  fd.append('isNegotiable', String(value.isNegotiable));
  fd.append('isDivisible', String(value.isDivisible));
  fd.append('deliveryType', value.deliveryType);
  fd.append('preferPayMethod', value.preferPayMethod);
  fd.append('expiryDate', value.expiryDate);

  if (value.imageFiles && value.imageFiles.length > 0) {
    value.imageFiles.forEach((file: File) => fd.append('images', file));
  }

  if (value.videoFile) {
    fd.append('video', value.videoFile);
  }

  if (value.certificateFile) {
    fd.append('certificate', value.certificateFile);
  }

  return fd;
}