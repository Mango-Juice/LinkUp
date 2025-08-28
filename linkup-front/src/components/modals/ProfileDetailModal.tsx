import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar, { genConfig, type AvatarFullConfig } from "react-nice-avatar";
import { IoClose, IoCafe } from "react-icons/io5";
import Modal from "./Modal";
import PrimaryButton from "../ui/PrimaryButton";
import type { MentorInfo } from "../../types/MentorInfo";
import type { MenteeInfo } from "../../types/MenteeInfo";
import { toast } from "react-toastify";
import { post } from "../../lib/api";

interface ProfileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MentorInfo | MenteeInfo | null;
  profileType: "mentor" | "mentee";
}

function isMentor(profile: MentorInfo | MenteeInfo): profile is MentorInfo {
  return "jobTitle" in profile && "tags" in profile;
}

const ProfileDetailModal = ({
  isOpen,
  onClose,
  profile,
  profileType,
}: ProfileDetailModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [message, setMessage] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);

  if (!profile) return null;

  const avatarConfig: AvatarFullConfig = genConfig(profile.name);
  const isMentorProfile = isMentor(profile);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const time = `${selectedDate} ${selectedTime}`;

      const profileId = isMentorProfile
        ? (profile as MentorInfo).id
        : (profile as MenteeInfo).id;

      const requestBody = {
        ...(profileType === "mentor" && { mentorUserId: profileId }),
        ...(profileType === "mentee" && { studentUserId: profileId }),
        note: message,
        time,
      };

      const res = await post("/bookings/propose", requestBody);

      if (res.success) {
        toast.success("커피챗 요청이 완료되었습니다!");
        handleClose();
      } else {
        toast.error(res.error || "커피챗 요청에 실패했습니다.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "커피챗 요청에 실패했습니다."
      );
    }
  };

  const handleClose = () => {
    setShowBookingForm(false);
    setSelectedDate("");
    setSelectedTime("");
    setMessage("");
    onClose();
  };

  const timeSlots = ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <motion.div
        className="w-[480px] max-w-[90vw]"
        layout
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {profileType === "mentor" ? "멘토 프로필" : "멘티 프로필"}
          </h2>
          <motion.button
            onClick={handleClose}
            className="p-2 transition-all duration-300 bg-transparent border-0 rounded-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IoClose className="w-5 h-5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200" />
          </motion.button>
        </motion.div>

        <motion.div
          className="flex flex-col items-center mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Avatar
            className="w-32 h-32 mb-4 rounded-full shadow-lg ring-4 ring-primary-100 dark:ring-primary-900/30"
            {...avatarConfig}
          />
          <h3 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {profile.name}
          </h3>

          {isMentorProfile ? (
            <>
              <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
                {profile.jobTitle}
              </p>
              <motion.div
                className="flex flex-wrap justify-center gap-2 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.2,
                  delay: 0.15,
                  staggerChildren: 0.03,
                }}
              >
                {profile.tags
                  .split(/[\s,]+/)
                  .filter(Boolean)
                  .map((tag, index) => (
                    <motion.span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.15,
                        delay: 0.15 + index * 0.03,
                      }}
                    >
                      {tag}
                    </motion.span>
                  ))}
              </motion.div>
            </>
          ) : (
            <>
              <p className="mb-1 text-sm text-neutral-600 dark:text-neutral-400">
                {profile.age}세 • {profile.grade} • {profile.region}
              </p>
              <motion.div
                className="flex flex-wrap justify-center gap-2 mt-3 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.2,
                  delay: 0.15,
                  staggerChildren: 0.03,
                }}
              >
                {profile.interests
                  .split(/[\s,]+/)
                  .filter(Boolean)
                  .map((interest, index) => (
                    <motion.span
                      key={interest}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.15,
                        delay: 0.15 + index * 0.03,
                      }}
                    >
                      {interest}
                    </motion.span>
                  ))}
              </motion.div>
            </>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {!showBookingForm ? (
            <motion.div
              key="buttons"
              className="flex gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PrimaryButton
                onClick={() => setShowBookingForm(true)}
                primary
                className="flex-1"
              >
                <IoCafe className="inline-block mr-2" />
                커피챗 제안하기
              </PrimaryButton>
              <PrimaryButton onClick={handleClose} className="flex-1">
                뒤로가기
              </PrimaryButton>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleBookingSubmit}
              className="space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <motion.div
                className="pt-4 border-t border-neutral-200 dark:border-neutral-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.05 }}
              >
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.08 }}
                >
                  <label className="block mb-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    날짜 선택
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    onInput={(e) =>
                      setSelectedDate((e.target as HTMLInputElement).value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 text-sm transition-all duration-300 bg-white border rounded-lg border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                    required
                  />
                </motion.div>

                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <label className="block mb-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    시간 선택
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <motion.button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                          selectedTime === time
                            ? "bg-primary-500 dark:bg-primary-600 text-white shadow-md"
                            : "bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.2,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.15 }}
                >
                  <label className="block mb-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    나누고 싶은 이야기 (선택)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="어떤 이야기를 나누고 싶으신가요?"
                    className="w-full px-3 py-2 text-sm transition-all duration-300 bg-white border rounded-lg resize-none border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                    rows={3}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.18 }}
              >
                <PrimaryButton
                  type="submit"
                  primary
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1"
                >
                  제안하기
                </PrimaryButton>
                <PrimaryButton
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1"
                >
                  뒤로가기
                </PrimaryButton>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </Modal>
  );
};

export default ProfileDetailModal;
