import { useState, useEffect } from "react";
import MentoJoinForm from "../components/signup/MentoJoinForm";
import MenteeJoinForm from "../components/signup/MenteeJoinForm";
import RoleButton from "../components/signup/RoleButton";
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
    <div className="flex flex-row items-start justify-center my-7">
      <SelectRoleSection
        onMentoClicked={() => setRole("mentor")}
        onMenteeClicked={() => setRole("mentee")}
        role={role}
      />
      <div
        className={`transition-[width] duration-300 ease-out flex-shrink-0 ${
          role ? "w-[20px]" : "w-0"
        }`}
        aria-hidden={!role}
      />
      <div
        className={`relative ${
          role ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`transition-all duration-300 ease-out origin-left ${
            showForm && role
              ? "opacity-100 translate-x-0 scale-100"
              : "opacity-0 -translate-x-4 scale-95"
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
    <div className="flex gap-6">
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
