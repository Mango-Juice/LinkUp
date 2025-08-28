import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COMMON_STYLES, ANIMATION_CONFIG } from "../../constants/styles";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  hasExitButton?: boolean;
  durationMs?: number;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  hasExitButton = false,
  durationMs = 200,
}: ModalProps) => {
  const [render, setRender] = useState(isOpen);
  useEffect(() => {
    if (isOpen) setRender(true);
    else if (!isOpen) {
      const t = setTimeout(() => setRender(false), durationMs + 100);
      return () => clearTimeout(t);
    }
  }, [isOpen, durationMs]);

  return (
    <AnimatePresence>
      {isOpen && render && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: durationMs / 1000 }}
        >
          <motion.div
            className={COMMON_STYLES.MODAL_BACKDROP}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durationMs / 1000 }}
          />
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className={`${COMMON_STYLES.MODAL_CONTENT} sm:max-w-md md:max-w-lg lg:max-w-xl`}
            initial={ANIMATION_CONFIG.MODAL.INITIAL}
            animate={ANIMATION_CONFIG.MODAL.ANIMATE}
            exit={ANIMATION_CONFIG.MODAL.EXIT}
            transition={{
              duration: durationMs / 1000,
              ease: "easeOut",
              scale: { duration: durationMs / 1000 },
              opacity: { duration: durationMs / 1500 },
            }}
          >
            {hasExitButton && (
              <IoClose
                onClick={onClose}
                className="absolute text-xl transition-opacity cursor-pointer top-2 right-2 text-neutral-600 dark:text-neutral-400 hover:opacity-70"
                aria-label="닫기"
              />
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
