import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar, { genConfig, type AvatarFullConfig } from "react-nice-avatar";
import { IoCafe, IoTime, IoCheckmark, IoClose } from "react-icons/io5";
import useAuthStore from "../stores/useAuthStore";
import { get, post, type ApiResponse } from "../lib/api";
import { toast } from "react-toastify";
import { LoadingText, ErrorText } from "../components/common/LoadingError";
import type { UserInfo } from "../types/UserInfo";

interface BookingUser {
  id: number;
  nickname: string;
  jobTitle?: string;
  age?: number;
  grade?: string;
  region?: string;
}

interface Booking {
  id: number;
  time: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  student: BookingUser;
  mentor: BookingUser;
  proposer: BookingUser;
  note: string;
  rejectReason: string | null;
  createdAt: string;
  updatedAt: string;
}

const Reservation = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");

  useEffect(() => {
    if (!user) {
      toast.warn("로그인이 필요한 기능입니다.");
      navigate("/", { state: { openLogin: true } });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        const res: ApiResponse<Booking[]> = await get<Booking[]>(
          "/bookings/me"
        );

        if (res.success) {
          setAllBookings(res.data);
        } else {
          setError(res.error || "예약 목록을 불러오는데 실패했습니다.");
        }
      } catch {
        setError("예약 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleApproveBooking = async (bookingId: number) => {
    try {
      const res = await post(`/bookings/${bookingId}/decision`, {
        approve: true,
      });
      if (res.success) {
        toast.success("예약을 수락했습니다!");
        setAllBookings(
          allBookings.map((b) =>
            b.id === bookingId ? { ...b, status: "APPROVED" as const } : b
          )
        );
      } else {
        toast.error(res.error || "수락에 실패했습니다.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "수락에 실패했습니다."
      );
    }
  };

  const handleRejectBooking = async (bookingId: number) => {
    const reason = window.prompt("거절 사유를 입력해주세요 (선택사항):");
    if (reason === null) return; // 사용자가 취소한 경우

    try {
      const res = await post(`/bookings/${bookingId}/decision`, {
        approve: false,
        reason: reason || "거절했습니다.",
      });
      if (res.success) {
        toast.success("예약을 거절했습니다.");
        setAllBookings(
          allBookings.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  status: "REJECTED" as const,
                  rejectReason: reason || "거절했습니다.",
                }
              : b
          )
        );
      } else {
        toast.error(res.error || "거절에 실패했습니다.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "거절에 실패했습니다."
      );
    }
  };

  if (!user) {
    return null;
  }

  const currentUserId = user.id;
  const isProposer = (booking: Booking) => booking.proposer.id === user.id;

  const filteredBookings = allBookings.filter((booking) => {
    if (filterStatus !== "all" && booking.status !== filterStatus) {
      return false;
    }

    if (filterRole !== "all") {
      if (filterRole === "proposer" && !isProposer(booking)) {
        return false;
      }
      if (filterRole === "participant" && isProposer(booking)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="mx-4 my-4 md:mx-6 md:my-6">
      <div className="mb-6 md:mb-8">
        <h1 className="mb-2 text-2xl font-bold md:text-3xl text-neutral-900 dark:text-neutral-100">
          내 예약
        </h1>
        <p className="mb-4 text-neutral-600 dark:text-neutral-400 md:mb-6">
          커피챗 예약 현황을 확인하세요
        </p>

        <FilterTabs
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
        />
      </div>

      <div className="space-y-4">
        {loading && <LoadingText />}
        {!loading && error && <ErrorText message={error} />}
        {!loading && !error && allBookings.length === 0 && (
          <div className="py-12 text-center">
            <IoCafe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-500">예약이 없습니다</p>
            <p className="mt-2 text-sm text-gray-400">
              멘토나 멘티에게 커피챗을 제안해보세요!
            </p>
          </div>
        )}
        {!loading &&
          !error &&
          filteredBookings.length === 0 &&
          allBookings.length > 0 && (
            <div className="py-12 text-center">
              <IoCafe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg text-gray-500">
                해당 조건의 예약이 없습니다
              </p>
              <p className="mt-2 text-sm text-gray-400">
                다른 필터 조건을 선택해보세요
              </p>
            </div>
          )}
        {!loading &&
          !error &&
          filteredBookings.map((booking) => (
            <BookingCard
              user={user}
              key={booking.id}
              booking={booking}
              isProposer={isProposer(booking)}
              currentUserId={currentUserId}
              onApprove={handleApproveBooking}
              onReject={handleRejectBooking}
            />
          ))}
      </div>
    </div>
  );
};

const FilterTabs = ({
  filterStatus,
  setFilterStatus,
  filterRole,
  setFilterRole,
}: {
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterRole: string;
  setFilterRole: (role: string) => void;
}) => {
  const statusTabs = [
    { key: "all", label: "전체" },
    { key: "PENDING", label: "대기중" },
    { key: "APPROVED", label: "수락됨" },
    { key: "REJECTED", label: "거절됨" },
    { key: "CANCELLED", label: "취소됨" },
  ];

  const roleTabs = [
    { key: "all", label: "전체" },
    { key: "proposer", label: "내가 제안" },
    { key: "participant", label: "상대방 제안" },
  ];

  return (
    <div className="flex flex-row justify-center gap-20">
      <div>
        <span className="mr-4 text-sm font-medium underline text-neutral-700 dark:text-neutral-300">
          상태
        </span>
        <div className="inline-flex flex-wrap gap-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === tab.key
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mr-4 text-sm font-medium underline text-neutral-700 dark:text-neutral-300">
          제안자
        </span>
        <div className="inline-flex flex-wrap gap-2">
          {roleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterRole(tab.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filterRole === tab.key
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const BookingCard = ({
  user,
  booking,
  isProposer,
  currentUserId,
  onApprove,
  onReject,
}: {
  user: UserInfo;
  booking: Booking;
  isProposer: boolean;
  currentUserId: number;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}) => {
  const otherUser = user.role === "mentor" ? booking.student : booking.mentor;
  const isMentorBooking = booking.mentor.id === currentUserId;
  const avatarConfig: AvatarFullConfig = genConfig(otherUser.nickname);

  return (
    <div className="p-6 bg-white border shadow-sm dark:bg-neutral-800 rounded-xl border-neutral-200 dark:border-neutral-700">
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12 rounded-full" {...avatarConfig} />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                {otherUser.nickname}
              </h3>
              {otherUser.jobTitle && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {otherUser.jobTitle}
                </p>
              )}
              {!isMentorBooking && otherUser.age && otherUser.grade && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {otherUser.age}세 • {otherUser.grade}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {getStatusBadge(booking.status)}
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {isProposer ? "내가 제안" : "상대방 제안"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-3 text-sm text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-1">
              <IoTime className="w-4 h-4" />
              <span>{booking.time}</span>
            </div>
          </div>

          <div className="flex flex-row gap-5">
            {booking.note && (
              <div className="flex-grow p-3 rounded-lg bg-neutral-100 dark:bg-neutral-700">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  메모: "{booking.note}"
                </p>
              </div>
            )}

            {booking.rejectReason && booking.status === "REJECTED" && (
              <div className="flex-grow p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                <p className="text-sm text-red-700 dark:text-red-300">
                  거절 사유: "{booking.rejectReason}"
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {booking.status === "PENDING" && !isProposer && (
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => onApprove(booking.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-green-400 border-0 rounded-lg hover:bg-green-500"
              >
                <IoCheckmark className="w-4 h-4" />
                수락
              </button>
              <button
                onClick={() => onReject(booking.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-red-400 border-0 rounded-lg hover:bg-red-500"
              >
                <IoClose className="w-4 h-4" />
                거절
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusBadge = (status: Booking["status"]) => {
  const statusConfig = {
    PENDING: {
      text: "대기중",
      className:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
    },
    APPROVED: {
      text: "수락됨",
      className:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
    },
    REJECTED: {
      text: "거절됨",
      className: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
    },
    CANCELLED: {
      text: "취소됨",
      className:
        "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400",
    },
  };

  const config = statusConfig[status];
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.text}
    </span>
  );
};

export default Reservation;
