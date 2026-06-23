// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, of, delay } from 'rxjs';
// import { map } from 'rxjs/operators';

// import { RegisterRequest, RegisterResponse, RegisterResponseDto } from '../models/registration.models';
// import { adaptRegisterRequest, adaptRegisterResponse } from '../adapters/registration.adapter';

// @Injectable({ providedIn: 'root' })
// export class RegistrationService {
//   private http = inject(HttpClient);

//   register(data: RegisterRequest): Observable<RegisterResponse> {
//     const payload = adaptRegisterRequest(data);
    
//     // Switch this to the real call once your .NET API endpoint is ready:
//     // return this.http.post<RegisterResponseDto>(`https://localhost:xxxx/api/auth/register`, payload)
//     //   .pipe(map(adaptRegisterResponse));

//     // Mock response for testing the UI
//     const mockResponse: RegisterResponseDto = {
//       Success: true,
//       Message: 'تم التسجيل بنجاح',
//       CompanyId: 'new-company-002'
//     };

//     return of(mockResponse).pipe(
//       delay(800),
//       map(adaptRegisterResponse)
//     );
//   }
// }