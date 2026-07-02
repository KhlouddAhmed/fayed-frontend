import { Component, computed, input } from '@angular/core';

export type RegistrationStepNumber = 1 | 2 | 3;
export type StepVisualState = 'completed' | 'active' | 'upcoming';

interface StepDefinition {
  readonly step: RegistrationStepNumber;
  readonly label: string;
}

@Component({
  selector: 'app-registration-stepper',
  imports: [],
  templateUrl: './registration-stepper.html',
  styleUrl: './registration-stepper.css',
})
export class RegistrationStepper {

  // INPUTS
  currentStep = input.required<RegistrationStepNumber>();

  // STEPS DEFINITION
  readonly steps: readonly StepDefinition[] = [
    { step: 1, label: 'رفع مستندات الشركه' },
    { step: 2, label: 'تأكيد هوية المالك' },
    { step: 3, label: 'بيانات الحساب' },
  ] as const;

  // COMPUTED STATES
  stepStates = computed<readonly StepVisualState[]>(() =>
    this.steps.map(({ step }) => this.resolveStepState(step))
  );

  // METHODS
  private resolveStepState(step: RegistrationStepNumber): StepVisualState {
    if (step < this.currentStep()) return 'completed';
    if (step === this.currentStep()) return 'active';
    return 'upcoming';
  }
}