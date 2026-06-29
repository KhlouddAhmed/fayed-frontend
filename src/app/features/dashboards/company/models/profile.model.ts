export interface CompanyDocument {
  readonly id: string;
  readonly name: string;
  readonly fileName: string;
  readonly status: 'approved' | 'pending' | 'rejected';
  readonly url: string;
}

export interface CompanyProfile {
  readonly id: string;
  readonly name: string;
  readonly initial: string;
  readonly code: string;
  readonly activityType: string;
  readonly foundedYear: number;
  readonly location: string;
  readonly registryNumber: string;
  readonly description: string;
  readonly isVerified: boolean;
  readonly email: string;
  readonly phone: string;
  readonly contactPerson: string;
  readonly website: string;
  readonly documents: readonly CompanyDocument[];
}
