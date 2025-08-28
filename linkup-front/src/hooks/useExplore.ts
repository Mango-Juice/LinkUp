import { useState, useEffect } from "react";
import { get } from "../lib/api";
import type { MentorInfo } from "../types/MentorInfo";
import type { MenteeInfo } from "../types/MenteeInfo";

export function useMentorsExplore(enabled: boolean) {
  const [data, setData] = useState<MentorInfo[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchMentors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await get<MentorInfo[]>("/mentors");
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.error || "멘토 목록을 불러오는데 실패했습니다");
        }
      } catch (err) {
        console.error("Mentors fetch error:", err);
        setError("네트워크 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [enabled]);

  return { data, loading, error };
}

interface APIStudentResponse {
  id: number;
  nickname: string;
  age: number;
  grade: string;
  region: string;
  interests: string;
}

export function useStudentsExplore(enabled: boolean) {
  const [data, setData] = useState<MenteeInfo[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await get<APIStudentResponse[]>("/students");
        if (response.success) {
          const transformedData: MenteeInfo[] = response.data.map(student => ({
            ...student,
            name: student.nickname // nickname을 name으로 매핑
          }));
          setData(transformedData);
        } else {
          setError(response.error || "학생 목록을 불러오는데 실패했습니다");
        }
      } catch (err) {
        console.error("Students fetch error:", err);
        setError("네트워크 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [enabled]);

  return { data, loading, error };
}