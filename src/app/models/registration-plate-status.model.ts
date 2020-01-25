export interface RegistrationPlateStatus {
  timeStamp: string;
  tollStatus: 'Valid' | 'Invalid' | 'Excluded';
  registrationPlate: string;
  tollStatusLabel?: string;
}
