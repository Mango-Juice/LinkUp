import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar, { genConfig, type AvatarFullConfig } from "react-nice-avatar";
import { IoCafe, IoTime, IoCalendar, IoCheckmark, IoClose } from "react-icons/io5";
import useAuthStore from "../store/useAuthStore";
import { get, post, type ApiResponse } from "../lib/api";
import { toast } from "react-toastify";
import { LoadingText, ErrorText } from "../components/common/LoadingError";

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
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  student: BookingUser;
  mentor: BookingUser;
  proposerId: number;
  message: string;
  preferredTimeText: string;
  createdAt: string;
}

const Reservation = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!user) {
      navigate("/", { state: { openLogin: true } });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        if (filterStatus !== "all") {
          params.append("status", filterStatus);
        }
        
        const res: ApiResponse<Booking[]> = await get<Booking[]>(
          `/bookings/me${params.toString() ? `?${params.toString()}` : ""}`
        );

        if (res.success) {
          setBookings(res.data);
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
  }, [user, filterStatus]);

  const handleApproveBooking = async (bookingId: number) => {
    try {
      const res = await post(`/bookings/${bookingId}/approve`, {});
      if (res.success) {
        toast.success("예약을 수락했습니다!");
        // 목록 새로고침
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, status: "ACCEPTED" as const } : b
        ));
      } else {
        toast.error(res.error || "수락에 실패했습니다.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "수락에 실패했습니다.");
    }
  };

  const handleRejectBooking = async (bookingId: number) => {
    try {
      const res = await post(`/bookings/${bookingId}/reject`, {});
      if (res.success) {
        toast.success("예약을 거절했습니다.");
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, status: "REJECTED" as const } : b
        ));
      } else {
        toast.error(res.error || "거절에 실패했습니다.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "거절에 실패했습니다.");
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    try {
      const res = await post(`/bookings/${bookingId}/cancel`, {});
      if (res.success) {
        toast.success("예약을 취소했습니다.");
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, status: "CANCELLED" as const } : b
        ));
      } else {
        toast.error(res.error || "취소에 실패했습니다.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "취소에 실패했습니다.");
    }
  };

  if (!user) {
    return null;
  }


  const getCurrentUserId = () => {
    try {
      const payload = JSON.parse(window.atob(user.token.split('.')[1]));
      return payload.id || 0;
    } catch {
      return 0;
    }
  };

  const currentUserId = getCurrentUserId();
  const isProposer = (booking: Booking) => booking.proposerId === currentUserId;

  return (
    <div className="m-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          내 예약
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          커피챗 예약 현황을 확인하세요
        </p>
        
        <FilterTabs
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
      </div>

      <div className="space-y-4">
        {loading && <LoadingText />}
        {!loading && error && <ErrorText message={error} />}
        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-12">
            <IoCafe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">예약이 없습니다</p>
            <p className="text-gray-400 text-sm mt-2">
              멘토나 멘티에게 커피챗을 제안해보세요!
            </p>
          </div>
        )}
        {!loading && !error && bookings.map((booking) => (
          <BookingCard 
            key={booking.id} 
            booking={booking} 
            isProposer={isProposer(booking)}
            currentUserId={currentUserId}
            onApprove={handleApproveBooking}
            onReject={handleRejectBooking}
            onCancel={handleCancelBooking}
          />
        ))}
      </div>
    </div>
  );
};

const FilterTabs = ({ 
  filterStatus, 
  setFilterStatus 
}: { 
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}) => {
  const tabs = [
    { key: "all", label: "전체" },
    { key: "PENDING", label: "대기중" },
    { key: "ACCEPTED", label: "수락됨" },
    { key: "REJECTED", label: "거절됨" },
    { key: "CANCELLED", label: "취소됨" },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setFilterStatus(tab.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filterStatus === tab.key
              ? "bg-primary-500 text-white shadow-md"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const BookingCard = ({ 
  booking, 
  isProposer,
  currentUserId,
  onApprove,
  onReject,
  onCancel
}: { 
  booking: Booking;
  isProposer: boolean;
  currentUserId: number;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onCancel: (id: number) => void;
}) => {
  const otherUser = isProposer ? booking.mentor : booking.student;
  const isMentorBooking = booking.mentor.id === currentUserId;
  const avatarConfig: AvatarFullConfig = genConfig(otherUser.nickname);
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-start gap-4">
        <Avatar className="w-12 h-12 rounded-full" {...avatarConfig} />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
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
          
          <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
            <div className="flex items-center gap-1">
              <IoCalendar className="w-4 h-4" />
              <span>{booking.preferredTimeText}</span>
            </div>
            <div className="flex items-center gap-1">
              <IoTime className="w-4 h-4" />
              <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          {booking.message && (
            <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-3 mt-3">
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                "{booking.message}"
              </p>
            </div>
          )}

          {/* Action buttons */}
          {booking.status === "PENDING" && (
            <div className="mt-4 flex gap-2">
              {!isProposer ? (
                // 상대방이 제안한 경우 - 수락/거절 버튼
                <>
                  <button
                    onClick={() => onApprove(booking.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <IoCheckmark className="w-4 h-4" />
                    수락
                  </button>
                  <button
                    onClick={() => onReject(booking.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <IoClose className="w-4 h-4" />
                    거절
                  </button>
                </>
              ) : (
                // 내가 제안한 경우 - 취소 버튼
                <button
                  onClick={() => onCancel(booking.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <IoClose className="w-4 h-4" />
                  취소
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusBadge = (status: Booking["status"]) => {
  const statusConfig = {
    PENDING: { text: "대기중", className: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400" },
    ACCEPTED: { text: "수락됨", className: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" },
    REJECTED: { text: "거절됨", className: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400" },
    CANCELLED: { text: "취소됨", className: "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400" },
  };
  
  const config = statusConfig[status];
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.text}
    </span>
  );
};

export default Reservation;
