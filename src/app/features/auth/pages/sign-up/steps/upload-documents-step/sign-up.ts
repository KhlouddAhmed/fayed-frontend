// import { Component, inject } from '@angular/core';
// import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// import { RegisterLayout } from '../register-layout/register-layout/register-layout';


// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [RegisterLayout, ReactiveFormsModule],
//   templateUrl: './sign-up.html'
// })
// export class RegisterComponent {
//   private fb = inject(FormBuilder);
//   readonly authStore = inject(AuthStore);

//   // تعريف الحقول والتحققات الخاصة بالخطوة الأولى فقط
//   registerForm = this.fb.nonNullable.group({
//     email: ['', [Validators.required, Validators.email]],
//     phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
//     password: ['', [Validators.required, Validators.minLength(8)]],
//     confirmPassword: ['', [Validators.required]]
//   }, { validators: this.passwordMatchValidator });

//   private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
//     const password = control.get('password')?.value;
//     const confirmPassword = control.get('confirmPassword')?.value;
//     return password === confirmPassword ? null : { passwordMismatch: true };
//   }

//   onSubmit() {
//     if (this.registerForm.valid) {
//       const formValues = this.registerForm.getRawValue();
      
//       // حفظ بيانات الخطوة الأولى في الستور والانتقال التلقائي للخطوة الثانية
//       this.authStore.setStepOneData({
//         email: formValues.email,
//         phoneNumber: '+20' + formValues.phoneNumber, 
//         passwordHash: formValues.password 
//       });
      
//       console.log('Step 1 Data Saved:', this.authStore.stepOneData());
//     } else {
//       this.registerForm.markAllAsTouched();
//     }
//   }
// }