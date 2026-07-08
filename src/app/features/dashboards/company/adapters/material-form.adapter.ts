import { MaterialFormValue } from '../models/material.model';

export function adaptMaterialFormToFormData(value: MaterialFormValue): FormData {
  const fd = new FormData();
  fd.append('title', value.title);
  fd.append('description', value.description);
  fd.append('price', String(value.price));
  fd.append('quantity', String(value.quantity));
  fd.append('categoryId', String(value.categoryId));
  fd.append('materialCondition', value.materialCondition);

  if (value.mediaFiles && value.mediaFiles.length > 0) {
    value.mediaFiles.forEach((file: File) => fd.append('mediaFiles', file));
  }

  return fd;
}