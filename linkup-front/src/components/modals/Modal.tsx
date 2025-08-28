import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durationMs / 1000 }}
          />
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-8 rounded-xl shadow-md relative z-10"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              duration: durationMs / 1000, 
              ease: "easeOut",
              scale: { duration: durationMs / 1000 },
              opacity: { duration: durationMs / 1500 }
            }}
          >
            {hasExitButton && (
              <IoClose
                onClick={onClose}
                className="cursor-pointer absolute top-2 right-2 text-xl hover:opacity-70 transition-opacity"
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
