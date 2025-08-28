import { useState, useEffect } from "react";
import { get, type ApiResponse } from "../lib/api";
import type { MentorInfo } from "../types/MentorInfo";
import type { MenteeInfo } from "../types/MenteeInfo";

interface MentorRecommendationDto {
  id: number;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
  jobTitle: string;
  intro: string;
  tags: string;
  status: string;
}

interface StudentRecommendationDto {
  id: number;
  user: {
    id: number;
    email: string;
    nickname: string;
    age: number;
  };
  grade: string;
  region: string;
  interests: string;
}

export function useMentorRecommendations(enabled: boolean) {
  const [data, setData] = useState<MentorInfo[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res: ApiResponse<MentorRecommendationDto[]> = await get<
          MentorRecommendationDto[]
        >("/match/mentors/recommendations");

        if (!cancelled) {
          if (res.success) {
            setData(
              res.data.map((m) => ({
                id: m.user.id,
                nickname: m.user.nickname,
                name: m.user.nickname, // nickname을 name으로 매핑
                jobTitle: m.jobTitle,
                tags: m.tags,
              }))
            );
          } else {
            setError(res.error || "로드 실패");
          }
        }
      } catch {
        if (!cancelled) setError("요청 오류");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { data, loading, error };
}

export function useMenteeRecommendations(enabled: boolean) {
  const [data, setData] = useState<MenteeInfo[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res: ApiResponse<StudentRecommendationDto[]> = await get<
          StudentRecommendationDto[]
        >("/match/students/recommendations");

        if (!cancelled) {
          if (res.success) {
            setData(
              res.data.map((s) => ({
                id: s.user.id,
                nickname: s.user.nickname,
                name: s.user.nickname,
                grade: s.grade,
                region: s.region,
                interests: s.interests,
                age: s.user.age,
              }))
            );
          } else {
            setError(res.error || "로드 실패");
          }
        }
      } catch {
        if (!cancelled) setError("요청 오류");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { data, loading, error };
}
