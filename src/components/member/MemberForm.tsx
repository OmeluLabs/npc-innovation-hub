// src/components/member/MemberForm.tsx

import React, { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Award,
  Code,
  Trash2,
  Lock,
  Check,
  AlertCircle,
  Camera,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import { useMember } from "../../hooks/useMember";
import type { SkillDetail } from "../../types/member.types";
import PasswordInput from "../PasswordInput";

// ── Helpers ───────────────────────────────────────────────────────────────────

const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    accent?: string;
  }
> = ({ label, accent = "blue", type, ...props }) => {
  const fieldClassName = `w-full px-4 py-3 border border-line rounded-lg
                  focus:ring-2 focus:ring-${accent}-500 focus:border-transparent
                  transition-colors text-sm ${props.className ?? ""}`;
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-primary">{label}</label>
      {/* Password fields get the show/hide eye toggle automatically -
          every other type renders exactly as before. */}
      {type === "password" ? (
        <PasswordInput {...props} className={fieldClassName} />
      ) : (
        <input {...props} type={type} className={fieldClassName} />
      )}
    </div>
  );
};

const Textarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    accent?: string;
  }
> = ({ label, accent = "blue", ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-primary">{label}</label>
    <textarea
      {...props}
      className={`w-full px-4 py-3 border border-line rounded-lg resize-none
                  focus:ring-2 focus:ring-${accent}-500 focus:border-transparent
                  transition-colors text-sm ${props.className ?? ""}`}
    />
  </div>
);

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
}> = ({ icon, title, subtitle, color }) => (
  <div className={`border-b border-line pb-4 mb-6`}>
    <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
      <span className={color}>{icon}</span>
      {title}
    </h2>
    <p className="text-ink-muted text-sm mt-0.5">{subtitle}</p>
  </div>
);

const Toast: React.FC<{ msg: string | null; type: "success" | "error" }> = ({
  msg,
  type,
}) => {
  if (!msg) return null;
  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium mb-6
                      ${
                        type === "success"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
    >
      {type === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
      {msg}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const MemberForm: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id ?? "";

  const {
    profile,
    fetchProfile,
    updateProfile,
    updatePassword,
    saving: pSaving,
    error: pError,
    successMsg: pSuccess,
    clearMessages: pClear,
  } = useProfile();

  const {
    member,
    memberExists,
    fetchMember,
    saveMemberBasic,
    manageContacts,
    manageEducation,
    manageSkills,
    saving: mSaving,
    error: mError,
    successMsg: mSuccess,
    clearMessages: mClear,
  } = useMember();

  // ── Local form state ───────────────────────────────────────────────────────

  // Basic member info
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Profile (user)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");

  // Education
  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");
  const [eduDesc, setEduDesc] = useState("");
  const [eduImage, setEduImage] = useState<File | null>(null);
  const eduFileRef = useRef<HTMLInputElement>(null);

  // Contacts
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [portfolio, setPortfolio] = useState("");

  // Skills
  const [skills, setSkills] = useState<SkillDetail[]>([]);
  const [newSkill, setNewSkill] = useState<SkillDetail>({
    name: "",
    technologies: [],
    percent: 0,
  });
  const [techInput, setTechInput] = useState("");

  // Password
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdError, setPwdError] = useState<string | null>(null);

  // ── Fetch on mount ─────────────────────────────────────────────────────────

  useEffect(() => {
    fetchProfile();
    if (userId) fetchMember(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Pre-fill from API data
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
      setPhone(profile.phone ?? "");
      setGender(profile.gender ?? "");
    }
  }, [profile]);

  useEffect(() => {
    if (member) {
      setName(member.name ?? "");
      setRole(member.role ?? "");
      setBio(member.bio ?? "");
      setPreview(member.imageUrl ?? "");
      // Education
      if (member.education) {
        setDegree(member.education.degree ?? "");
        setInstitution(member.education.institution ?? "");
        setEduDesc(member.education.description ?? "");
      }
      // Contacts
      if (member.contacts) {
        setLinkedin(member.contacts.linkedin ?? "");
        setGithub(member.contacts.github ?? "");
        setTwitter(member.contacts.twitter ?? "");
        setInstagram(member.contacts.instagram ?? "");
        setPortfolio(member.contacts.portfolio ?? "");
      }
      // Skills
      if (member.skillDetails?.length) {
        setSkills(member.skillDetails);
      }
    }
  }, [member]);

  // ── Image picker ───────────────────────────────────────────────────────────

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ── Skills helpers ─────────────────────────────────────────────────────────

  const addTech = () => {
    if (!techInput.trim()) return;
    setNewSkill((p) => ({
      ...p,
      technologies: [...p.technologies, techInput.trim()],
    }));
    setTechInput("");
  };

  const addSkill = () => {
    if (skills.length >= 4) {
      alert("Max 4 skills.");
      return;
    }
    if (!newSkill.name || !newSkill.technologies.length || !newSkill.percent)
      return;
    setSkills((p) => [...p, newSkill]);
    setNewSkill({ name: "", technologies: [], percent: 0 });
  };

  // ── Submit handlers ────────────────────────────────────────────────────────

  const handleSaveBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    mClear();
    await saveMemberBasic(userId, { name, role, bio, image });
    await updateProfile({ firstName, lastName, phone, gender });
  };

  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    mClear();
    await manageEducation(userId, {
      degree,
      institution,
      description: eduDesc,
      educationImage: eduImage ?? undefined,
    });
  };

  const handleSaveContacts = async (e: React.FormEvent) => {
    e.preventDefault();
    mClear();
    await manageContacts(userId, {
      linkedin,
      github,
      twitter,
      instagram,
      portfolio,
    });
  };

  const handleSaveSkills = async (e: React.FormEvent) => {
    e.preventDefault();
    mClear();
    await manageSkills(userId, { skillDetails: skills });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    pClear();
    if (newPwd !== confirmPwd) {
      setPwdError("Passwords do not match.");
      return;
    }
    if (newPwd.length < 8) {
      setPwdError("New password must be at least 8 characters.");
      return;
    }
    const ok = await updatePassword(userId, {
      oldPassword: oldPwd,
      newPassword: newPwd,
    });
    if (ok) {
      setOldPwd("");
      setNewPwd("");
      setConfirmPwd("");
    }
  };

  const saving = pSaving || mSaving;
  const error = mError || pError;
  const success = mSuccess || pSuccess;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    // px-4 here sat inside DashboardLayout's own gutter, double-padding
    // the form; the layout supplies the horizontal gutter already.
    <div className="min-w-0">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-950 px-4 sm:px-8 py-5 sm:py-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <User className="h-7 w-7" />
              {memberExists ? "Edit Your Profile" : "Complete Your Profile"}
            </h1>
            <p className="text-accent mt-1 text-sm">
              {memberExists
                ? "Update your information below"
                : "Fill out the form to set up your member profile"}
            </p>
          </div>

          <div className="p-4 sm:p-8 space-y-8 sm:space-y-10">
            {/* Global toast */}
            <Toast msg={error} type="error" />
            <Toast msg={success} type="success" />

            {/* ══════════════════════════════════════════════════
                SECTION 1: Basic Information
            ══════════════════════════════════════════════════ */}
            <form onSubmit={handleSaveBasic} className="space-y-6">
              <SectionHeader
                icon={<User className="h-5 w-5" />}
                title="Basic Information"
                subtitle="Your name, role, bio and avatar"
                color="text-secondary"
              />

              {/* Avatar picker */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-xl overflow-hidden bg-surface-muted
                                  border-2 border-line flex items-center justify-center"
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={28} className="text-ink-muted" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-secondary
                               rounded-full flex items-center justify-center text-white
                               hover:bg-primary transition-colors shadow"
                  >
                    <Camera size={13} />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImagePick}
                  />
                </div>
                <div className="text-sm text-ink-muted">
                  <p className="font-medium text-primary">Profile photo</p>
                  <p className="text-xs mt-0.5">JPG, PNG up to 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-w-0-all">
                <Input
                  label="Display Name *"
                  placeholder="Entue MUGABO"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Role / Position *"
                  placeholder="e.g. Full Stack Developer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
                <Input
                  label="First Name"
                  placeholder="Entue"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  label="Last Name"
                  placeholder="MUGABO"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <Input
                  label="Phone"
                  placeholder="+250791396400"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-primary">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 border border-line rounded-lg
                               focus:ring-2 focus:ring-secondary focus:border-transparent
                               transition-colors text-sm bg-white"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Textarea
                    label="Bio *"
                    rows={4}
                    placeholder="Tell us about yourself, your background and interests..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-950 text-white py-3.5 rounded-lg font-semibold
                           hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
              >
                {saving ? "Saving…" : "Save Basic Info"}
              </button>
            </form>

            {/* ══════════════════════════════════════════════════
                SECTION 2: Education
            ══════════════════════════════════════════════════ */}
            <form onSubmit={handleSaveEducation} className="space-y-6">
              <SectionHeader
                icon={<Award className="h-5 w-5" />}
                title="Education"
                subtitle="Degree, institution and description"
                color="text-secondary"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-w-0-all">
                <Input
                  label="Degree"
                  accent="purple"
                  placeholder="Bachelor of Science in Computer Science"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                />
                <Input
                  label="Institution"
                  accent="purple"
                  placeholder="University of Technology"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                />

                {/* Education image upload */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-primary">
                    Institution Logo (image file)
                  </label>
                  <input
                    ref={eduFileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEduImage(e.target.files?.[0] ?? null)}
                    className="w-full text-sm text-ink-muted file:mr-3 file:py-2 file:px-4
                               file:rounded-lg file:border-0 file:text-sm file:font-semibold
                               file:bg-surface-muted file:text-primary hover:file:bg-surface-muted"
                  />
                  {member?.education?.imageUrl && !eduImage && (
                    <p className="text-xs text-ink-muted mt-1">
                      Current:{" "}
                      <a
                        href={member.education.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary underline"
                      >
                        View logo
                      </a>
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Textarea
                    label="Description"
                    accent="purple"
                    rows={3}
                    placeholder="Describe your educational experience, achievements..."
                    value={eduDesc}
                    onChange={(e) => setEduDesc(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-white py-3.5 rounded-lg font-semibold
                           hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
              >
                {saving ? "Saving…" : "Save Education"}
              </button>
            </form>

            {/* ══════════════════════════════════════════════════
                SECTION 3: Contacts
            ══════════════════════════════════════════════════ */}
            <form onSubmit={handleSaveContacts} className="space-y-6">
              <SectionHeader
                icon={<Mail className="h-5 w-5" />}
                title="Contact Information"
                subtitle="Social media and professional links"
                color="text-green-600"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-w-0-all">
                <Input
                  label="LinkedIn"
                  accent="green"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
                <Input
                  label="GitHub"
                  accent="green"
                  type="url"
                  placeholder="https://github.com/username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
                <Input
                  label="Twitter/X"
                  accent="green"
                  type="url"
                  placeholder="https://twitter.com/username"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                />
                <Input
                  label="Instagram"
                  accent="green"
                  type="url"
                  placeholder="https://instagram.com/username"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
                <Input
                  label="Portfolio"
                  accent="green"
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-green-700 text-white py-3.5 rounded-lg font-semibold
                           hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
              >
                {saving ? "Saving…" : "Save Contacts"}
              </button>
            </form>

            {/* ══════════════════════════════════════════════════
                SECTION 4: Skills
            ══════════════════════════════════════════════════ */}
            <form onSubmit={handleSaveSkills} className="space-y-6">
              <SectionHeader
                icon={<Code className="h-5 w-5" />}
                title="Skills & Technologies"
                subtitle="Up to 4 skill categories with proficiency levels"
                color="text-orange-600"
              />

              {/* New skill builder */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-primary text-sm">
                  Add New Skill
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0-all">
                  <Input
                    label="Skill Category"
                    accent="orange"
                    placeholder="e.g. Frontend Development"
                    value={newSkill.name}
                    onChange={(e) =>
                      setNewSkill((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-primary">
                      Proficiency (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="85"
                      value={newSkill.percent || ""}
                      onChange={(e) =>
                        setNewSkill((p) => ({
                          ...p,
                          percent: +e.target.value || 0,
                        }))
                      }
                      className="w-full px-4 py-3 border border-line rounded-lg
                                 focus:ring-2 focus:ring-orange-500 focus:border-transparent
                                 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-primary">
                    Technologies
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. React, TypeScript…"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTech())
                      }
                      className="flex-1 px-4 py-3 border border-line rounded-lg
                                 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                    <button
                      type="button"
                      onClick={addTech}
                      className="px-5 py-3 bg-orange-600 text-white rounded-lg
                                 hover:bg-orange-700 transition-colors font-medium text-sm"
                    >
                      Add
                    </button>
                  </div>
                  {newSkill.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newSkill.technologies.map((t, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 bg-orange-100
                                                  text-orange-800 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {t}
                          <button
                            type="button"
                            onClick={() =>
                              setNewSkill((p) => ({
                                ...p,
                                technologies: p.technologies.filter(
                                  (_, j) => j !== i,
                                ),
                              }))
                            }
                          >
                            <Trash2 size={11} className="hover:text-red-600" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={addSkill}
                  disabled={
                    !newSkill.name ||
                    !newSkill.technologies.length ||
                    !newSkill.percent
                  }
                  className="w-full bg-orange-600 text-white py-3 rounded-lg
                             hover:bg-orange-700 disabled:bg-line disabled:cursor-not-allowed
                             transition-colors font-medium text-sm"
                >
                  Add Skill
                </button>
              </div>

              {/* Added skills */}
              {skills.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0-all">
                  {skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-line rounded-xl p-4 relative"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setSkills((p) => p.filter((_, i) => i !== idx))
                        }
                        className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="flex justify-between items-start mb-1.5 pr-6">
                        <h4 className="text-sm font-bold text-primary">
                          {skill.name}
                        </h4>
                        <span className="text-xs font-bold text-orange-600">
                          {skill.percent}%
                        </span>
                      </div>
                      <div className="w-full bg-line rounded-full h-1.5 mb-3">
                        <div
                          className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${skill.percent}%` }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {skill.technologies.map((t) => (
                          <span
                            key={t}
                            className="bg-surface-muted text-ink-muted px-2 py-0.5 rounded text-xs"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={saving || skills.length === 0}
                className="w-full bg-orange-600 text-white py-3.5 rounded-lg font-semibold
                           hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
              >
                {saving ? "Saving…" : "Save Skills"}
              </button>
            </form>

            {/* ══════════════════════════════════════════════════
                SECTION 5: Change Password
            ══════════════════════════════════════════════════ */}
            <form onSubmit={handleChangePassword} className="space-y-6">
              <SectionHeader
                icon={<Lock className="h-5 w-5" />}
                title="Change Password"
                subtitle="Update your account password"
                color="text-red-600"
              />
              <Toast msg={pwdError} type="error" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Current Password *"
                  type="password"
                  accent="red"
                  placeholder="••••••••"
                  value={oldPwd}
                  onChange={(e) => setOldPwd(e.target.value)}
                  required
                />
                <Input
                  label="New Password *"
                  type="password"
                  accent="red"
                  placeholder="••••••••"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  required
                />
                <Input
                  label="Confirm New Password *"
                  type="password"
                  accent="red"
                  placeholder="••••••••"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={pSaving}
                className="w-full bg-red-700 text-white py-3.5 rounded-lg font-semibold
                           hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
              >
                {pSaving ? "Updating…" : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberForm;
