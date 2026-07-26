export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  isMember: boolean;
  createdAt: Date;
}
