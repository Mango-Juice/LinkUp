import { useState, useEffect } from "react";
import MentoJoinForm from "../features/signup/components/MentoJoinForm";
import MenteeJoinForm from "../features/signup/components/MenteeJoinForm";
import RoleButton from "../features/signup/components/RoleButton";
import type { Role } from "../types/UserInfo";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [role, setRole] = useState<Role>(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (role) {
      const t = setTimeout(() => setShowForm(true), 40);
      return () => clearTimeout(t);
    }
    setShowForm(false);
  }, [role]);

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center mx-4 md:mx-6 my-6 md:my-8 gap-6 lg:gap-8">
      <SelectRoleSection
        onMentoClicked={() => setRole("mentor")}
        onMenteeClicked={() => setRole("mentee")}
        role={role}
      />
      <div
        className={`transition-all duration-300 ease-out flex-shrink-0 ${
          role ? "lg:w-[20px] w-0" : "w-0"
        }`}
        aria-hidden={!role}
      />
      <div
        className={`relative w-full lg:w-auto ${
          role ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`transition-all duration-300 ease-out origin-top lg:origin-left ${
            showForm && role
              ? "opacity-100 translate-y-0 lg:translate-x-0 scale-100"
              : "opacity-0 -translate-y-4 lg:-translate-x-4 scale-95"
          }`}
        >
          {role === "mentor" && (
            <MentoJoinForm
              onCancel={() => setRole(null)}
              onSubmit={() => navigate("/")}
            />
          )}
          {role === "mentee" && (
            <MenteeJoinForm
              onCancel={() => setRole(null)}
              onSubmit={() => navigate("/")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface SelectRoleSectionProps {
  onMentoClicked: () => void;
  onMenteeClicked: () => void;
  role: Role;
}
const SelectRoleSection = ({
  onMentoClicked,
  onMenteeClicked,
  role,
}: SelectRoleSectionProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto justify-center items-center sm:justify-center">
      {role !== "mentee" && (
        <RoleButton
          icon="mentor_icon.png"
          label="멘토로 시작하기"
          description="멘토로 활동하며 지식을 나눠요."
          onClick={onMentoClicked}
          disabled={role === "mentor"}
        />
      )}
      {role !== "mentor" && (
        <RoleButton
          icon="mentee_icon.png"
          label="멘티로 시작하기"
          description="멘토에게 도움을 받아요."
          onClick={onMenteeClicked}
          disabled={role === "mentee"}
        />
      )}
    </div>
  );
};

export default SignUp;
