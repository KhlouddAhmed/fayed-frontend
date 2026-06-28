import { Injectable } from '@angular/core';
import { MaterialDto, MaterialFormValue } from '../models/material.model';
import { MaterialsRepository } from './materials-repository.token';

const MOCK_NETWORK_DELAY_MS = 500;

function createMockMaterials(): MaterialDto[] {
  return [
    {
      Id: 'mat-1',
      Name: 'كوبوليمر PP',
      Category: 'بلاستيك',
      Status: 'Active',
      Description: 'كوبوليمر PP معاد تدويره، نظيف وشفاف، مناسب لعمليات إعادة التصنيع.',
      AvailableQuantity: 18,
      MinOrderQuantity: 5,
      Unit: 'طن',
      PricePerUnit: 12500,
      ImageUrls: [],
      VideoUrl: null,
      LabCertificateUrl: null,
      LabCertificateFileName: null,
      LabCertificateFileSizeKb: null,
      PublishedAt: '2026-06-01T10:00:00Z',
      UpdatedAt: '2026-06-04T10:00:00Z',
    },
    {
      Id: 'mat-2',
      Name: 'خام HDPE',
      Category: 'بلاستيك',
      Status: 'Active',
      Description: 'خام HDPE فائض إنتاج، عالي الكثافة.',
      AvailableQuantity: 23,
      MinOrderQuantity: 5,
      Unit: 'طن',
      PricePerUnit: 13200,
      ImageUrls: [],
      VideoUrl: null,
      LabCertificateUrl: null,
      LabCertificateFileName: null,
      LabCertificateFileSizeKb: null,
      PublishedAt: '2026-05-20T10:00:00Z',
      UpdatedAt: '2026-06-02T10:00:00Z',
    },
    {
      Id: 'mat-3',
      Name: 'معاد تدويره PVC',
      Category: 'بلاستيك',
      Status: 'underReview',
      Description: 'معاد تدويره PVC نظيف وشفاف، مناسب لعمليات إعادة التصنيع، مخزن داخل المصنع وجاهز للتسليم.',
      AvailableQuantity: 15,
      MinOrderQuantity: 5,
      Unit: 'طن',
      PricePerUnit: 8400,
      ImageUrls: [],
      VideoUrl: null,
      LabCertificateUrl: null,
      LabCertificateFileName: null,
      LabCertificateFileSizeKb: null,
      PublishedAt: '2026-06-02T10:00:00Z',
      UpdatedAt: '2026-06-05T10:00:00Z',
    },
    {
      Id: 'mat-4',
      Name: 'صناعي PVC',
      Category: 'بلاستيك',
      Status: 'Active',
      Description: 'معاد تدويره PVC نظيف وشفاف، مناسب لعمليات إعادة التصنيع، مخزن داخل المصنع وجاهز للتسليم.',
      AvailableQuantity: 20,
      MinOrderQuantity: 5,
      Unit: 'طن',
      PricePerUnit: 10500,
      ImageUrls: [],
      VideoUrl: null,
      LabCertificateUrl: 'COA_PET_2024.pdf',
      LabCertificateFileName: 'COA_PET_2024.pdf',
      LabCertificateFileSizeKb: 245,
      PublishedAt: '2026-06-02T10:00:00Z',
      UpdatedAt: '2026-06-05T10:00:00Z',
    },
    {
      Id: 'mat-5',
      Name: 'PP Raffia',
      Category: 'بلاستيك',
      Status: 'underReview',
      Description: 'PP Raffia فائض إنتاج صالح لإعادة الاستخدام الصناعي.',
      AvailableQuantity: 32,
      MinOrderQuantity: 5,
      Unit: 'طن',
      PricePerUnit: 7500,
      ImageUrls: [],
      VideoUrl: null,
      LabCertificateUrl: null,
      LabCertificateFileName: null,
      LabCertificateFileSizeKb: null,
      PublishedAt: '2026-06-03T10:00:00Z',
      UpdatedAt: '2026-06-06T10:00:00Z',
    },
  ];
}

@Injectable()
export class MockMaterialsRepository implements MaterialsRepository {
  private materials = createMockMaterials();

  getAll(): Promise<readonly MaterialDto[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.materials]), MOCK_NETWORK_DELAY_MS);
    });
  }

  create(value: MaterialFormValue): Promise<MaterialDto> {
    const now = new Date().toISOString();
    const created: MaterialDto = {
      Id: `mat-${Date.now()}`,
      Name: value.name,
      Category: value.category,
      Status: value.status === 'active' ? 'Active' : 'underReview',
      Description: value.description,
      AvailableQuantity: value.availableQuantity,
      MinOrderQuantity: value.minOrderQuantity,
      Unit: value.unit,
      PricePerUnit: value.pricePerUnit,
      ImageUrls: [],
      VideoUrl: null,
      LabCertificateUrl: null,
      LabCertificateFileName: null,
      LabCertificateFileSizeKb: null,
      PublishedAt: now,
      UpdatedAt: now,
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        this.materials = [created, ...this.materials];
        resolve(created);
      }, MOCK_NETWORK_DELAY_MS);
    });
  }

  update(id: string, value: MaterialFormValue): Promise<MaterialDto> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.materials.findIndex((material) => material.Id === id);

        if (index === -1) {
          reject(new Error(`Material with id ${id} not found`));
          return;
        }

        const existing = this.materials[index];
        const updated: MaterialDto = {
          ...existing,
          Name: value.name,
          Category: value.category,
          Status: value.status === 'active' ? 'Active' : 'underReview',
          Description: value.description,
          AvailableQuantity: value.availableQuantity,
          MinOrderQuantity: value.minOrderQuantity,
          Unit: value.unit,
          PricePerUnit: value.pricePerUnit,
          UpdatedAt: new Date().toISOString(),
        };

        this.materials = [
          ...this.materials.slice(0, index),
          updated,
          ...this.materials.slice(index + 1),
        ];

        resolve(updated);
      }, MOCK_NETWORK_DELAY_MS);
    });
  }

  delete(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.materials = this.materials.filter((material) => material.Id !== id);
        resolve();
      }, MOCK_NETWORK_DELAY_MS);
    });
  }
}
