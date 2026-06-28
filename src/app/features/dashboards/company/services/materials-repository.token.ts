import { InjectionToken } from '@angular/core';
import { MaterialDto, MaterialFormValue } from '../models/material.model';

export interface MaterialsRepository {
  getAll(): Promise<readonly MaterialDto[]>;
  create(value: MaterialFormValue): Promise<MaterialDto>;
  update(id: string, value: MaterialFormValue): Promise<MaterialDto>;
  delete(id: string): Promise<void>;
}

export const MATERIALS_REPOSITORY = new InjectionToken<MaterialsRepository>(
  'MATERIALS_REPOSITORY',
);
