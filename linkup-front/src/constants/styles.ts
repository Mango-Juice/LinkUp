export const COMMON_STYLES = {
  // 전환 애니메이션
  TRANSITION_COLORS: "transition-colors duration-300",
  TRANSITION_ALL: "transition-all duration-300",
  
  // 카드 기본 스타일
  CARD_BASE: "rounded-2xl bg-white/70 dark:bg-neutral-800/70 backdrop-blur border border-neutral-200 dark:border-neutral-700 shadow-md",
  CARD_HOVER: "hover:shadow-xl hover:-translate-y-1",
  CARD_INTERACTIVE: "cursor-pointer transition-all duration-300",
  
  // 폼 관련
  FORM_CONTAINER: "bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6 mb-6 shadow-lg w-full border border-neutral-200 dark:border-neutral-700 transition-colors duration-300",
  FORM_DIVIDER: "mt-1 border-neutral-300 dark:border-neutral-600",
  
  // 버튼 상호작용
  BUTTON_SCALE_DOWN: "active:scale-[0.99]",
  BUTTON_SCALE_UP: "hover:scale-105",
  BUTTON_DISABLED: "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
  
  // 텍스트 색상
  TEXT_PRIMARY: "text-neutral-900 dark:text-neutral-100",
  TEXT_SECONDARY: "text-neutral-600 dark:text-neutral-400",
  TEXT_MUTED: "text-neutral-500 dark:text-neutral-500",
  
  // 태그/뱃지 스타일
  TAG_BASE: "px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-medium",
  
  // 그라데이션 오버레이
  GRADIENT_OVERLAY: "bg-gradient-to-br from-primary-500/10 via-transparent to-primary-500/5",
  
  // 모달 관련
  MODAL_BACKDROP: "fixed inset-0 bg-black/50",
  MODAL_CONTENT: "relative z-10 flex justify-center w-full max-w-full p-6 mx-4 transition-colors duration-300 bg-white border shadow-xl dark:bg-neutral-900 md:p-8 rounded-xl border-neutral-200 dark:border-neutral-700",
  
  // 아바타/이미지
  AVATAR_RING: "rounded-full shadow-md ring-4 ring-white dark:ring-neutral-700",
} as const;

// 애니메이션 설정
export const ANIMATION_CONFIG = {
  // 기본 전환
  DURATION_FAST: 200,
  DURATION_NORMAL: 300,
  DURATION_SLOW: 500,
  
  // 모달 애니메이션
  MODAL: {
    DURATION: 200,
    INITIAL: { opacity: 0, scale: 0.9, y: 20 },
    ANIMATE: { opacity: 1, scale: 1, y: 0 },
    EXIT: { opacity: 0, scale: 0.9, y: 20 },
  },
  
  // 카드 호버
  CARD_HOVER: {
    SCALE: 1.05,
    TRANSLATE_Y: "-0.25rem",
  },
  
  // 버튼 클릭
  BUTTON_PRESS: {
    SCALE: 0.99,
  },
} as const;

// 반응형 브레이크포인트 관련 클래스들
export const RESPONSIVE_STYLES = {
  // 폼 필드
  FORM_FIELD_CONTAINER: "flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3",
  FORM_FIELD_LABEL: "w-full sm:w-20 shrink-0 text-sm font-medium",
  FORM_FIELD_INPUT: "w-full sm:flex-1 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500",
  
  // 카드 크기
  CARD_SIZE: "w-[240px] h-[180px] p-4 md:p-5",
  MENTEE_CARD_SIZE: "w-[240px] h-[200px] p-4 md:p-5",
  
  // 텍스트 크기
  TEXT_RESPONSIVE_BASE: "text-base md:text-lg",
  TEXT_RESPONSIVE_SMALL: "text-xs md:text-sm",
  TEXT_RESPONSIVE_TINY: "text-[11px]",
} as const;