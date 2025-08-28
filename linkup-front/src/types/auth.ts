export interface SignupResponse {
  id: number;
  accessToken: string;
  age: number;
  message: string;
  nickname: string;
  email: string;
  role: "STUDENT" | "MENTOR";
}

export interface LoginResponse {
  id: number;
  accessToken: string;
  nickname: string;
  role: "STUDENT" | "MENTOR";
}

export interface FormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export interface MenteeSignupPayload {
  email: string;
  password: string;
  nickname: string;
  age: number;
  role: "STUDENT";
  student: {
    grade: string;
    region: string;
    interests: string;
  };
}

export interface MentorSignupPayload {
  email: string;
  password: string;
  nickname: string;
  age: number;
  role: "MENTOR";
  mentor: {
    jobTitle: string;
    major: string;
    intro: string;
    tags: string;
    orgName: string;
    verificationUrl: string;
  };
}