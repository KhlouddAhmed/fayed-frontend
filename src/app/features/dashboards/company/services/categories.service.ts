// export interface Category {
//   readonly id: number;
//   readonly parentId: number | null;
//   readonly name: string;
//   readonly children: Category[];
// }

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponseWithData } from '../../../../core/models/api-response.model';

export interface Category {
  readonly id: number;
  readonly parentId: number | null;
  readonly name: string;
  readonly children: Category[];
}

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Category[]> {
    return this.http
      .get<ApiResponseWithData<Category[]>>(`${environment.apiUrl}/categories`)
      .pipe(map(res => res.data ?? []));
  }

  getTree(): Observable<Category[]> {
    return this.http
      .get<ApiResponseWithData<Category[]>>(`${environment.apiUrl}/categories/tree`)
      .pipe(map(res => res.data ?? []));
  }
}