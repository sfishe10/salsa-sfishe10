export interface Member {
  memberId: number;
  pepBandId: string;
  firstName: string;
  lastName: string;
  sectionId: number;
  rehearsalConflict: string | null;
  role: string;
}
