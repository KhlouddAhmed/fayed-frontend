import { MaterialFormValue } from '../models/material.model';

export function buildMaterialFormData(value: MaterialFormValue): FormData {
  const fd = new FormData();

  fd.append('Title', value.name);
  fd.append('Description', value.description);
  fd.append('MaterialType', value.materialType);
  fd.append('MaterialCondition', value.condition);
  fd.append('Quantity', String(value.availableQuantity));
  fd.append('MeasureUnit', value.unit);
  fd.append('MinPrice', String(value.pricePerUnit));
  fd.append('MaxPrice', String(value.maxPricePerUnit));
  fd.append('MinOrderQuantity', String(value.minOrderQuantity));
  fd.append('CategoryId', String(value.categoryId));
  fd.append('IsNegotiable', 'true');
  fd.append('IsDivisible', 'true');
  fd.append('DeliveryType', 'SellerDelivery');
  fd.append('PreferPayMethod', 'BankTransfer');
  fd.append('ExpiryDate', new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString());

  if (value.imageFiles?.length) {
    value.imageFiles.forEach(file => fd.append('Images', file));
  }
  if (value.videoFile) fd.append('VideoFile', value.videoFile);
  if (value.labCertificateFile) fd.append('LabCertificateFile', value.labCertificateFile);

  return fd;
}