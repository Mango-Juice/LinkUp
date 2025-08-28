export interface MentorInfo {
  id: number;
  nickname: string;
  jobTitle: string;
  tags: string;
  name: string; // derived from nickname for compatibility
}
