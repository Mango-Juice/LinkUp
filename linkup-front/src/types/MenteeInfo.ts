export interface MenteeInfo {
  id: number;
  nickname: string;
  grade: string;
  region: string;
  interests: string; // comma separated
  age: number;
  name: string; // derived from nickname for compatibility
}
