import { useTranslation } from "react-i18next";
import {
  AlternateEmail,
  AdminPanelSettings,
  CheckCircle,
  Close,
  LockOutlined,
  PersonOutline,
  PhoneIphone,
  SupportAgent,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Dialog, IconButton } from "@mui/material";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getJwtToken, logIn, signUp } from "@/libs/auth";

interface LoginRegisterProps {
  open: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "register" | "verify" | "forgot" | "reset";
type UserType = "ADMIN" | "AGENT" | "USER";

const userTypes: {
  value: UserType;
  labelKey: string;
  descKey: string;
  Icon: typeof PersonOutline;
}[] = [
  {
    value: "ADMIN",
    labelKey: "auth2.typeAdmin",
    descKey: "auth2.typeAdminDesc",
    Icon: AdminPanelSettings,
  },
  {
    value: "AGENT",
    labelKey: "auth2.typeAgent",
    descKey: "auth2.typeAgentDesc",
    Icon: SupportAgent,
  },
  {
    value: "USER",
    labelKey: "auth2.typeUser",
    descKey: "auth2.typeUserDesc",
    Icon: PersonOutline,
  },
];

const memberTypeMap: Record<UserType, string> = {
  ADMIN: "ADMIN",
  AGENT: "AGENT",
  USER: "USER",
};

const maskId = (value: string) => {
  if (!value) return "your account ID";
  if (value.includes("@")) {
    const [name, domain] = value.split("@");
    return `${name.slice(0, 3)}${"*".repeat(Math.max(name.length - 3, 4))}@${domain}`;
  }

  return `${value.slice(0, 3)}${"*".repeat(Math.max(value.length - 3, 4))}`;
};

const LoginRegister = ({ open, onClose }: LoginRegisterProps) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedUserType, setSelectedUserType] = useState<UserType>("USER");
  const [registerError, setRegisterError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [forgotForm, setForgotForm] = useState({ name: "", email: "" });
  const [resetForm, setResetForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isRegister = mode !== "login";
  const isResetFlow = mode === "forgot" || mode === "reset";
  const sideImage = isRegister
    ? "/img/pets/PetSignUp.png"
    : "/img/pets/PetLogin.png";

  const title = useMemo(() => {
    if (mode === "login") return t("auth2.titleLogin");
    if (mode === "register") return t("auth2.titleRegister");
    if (mode === "forgot") return t("auth2.titleForgot");
    if (mode === "reset") return t("auth2.titleReset");
    return t("auth2.titleVerify");
  }, [mode, t]);

  const subtitle = useMemo(() => {
    if (mode === "login") {
      return t("auth2.subLogin");
    }
    if (mode === "register") {
      return t("auth2.subRegister");
    }
    if (mode === "forgot") {
      return t("auth2.subForgot");
    }
    if (mode === "reset") {
      return t("auth2.subReset");
    }
    return t("auth2.subVerify", {
      target: maskId(forgotForm.email || registerForm.email),
    });
  }, [mode, registerForm.email, forgotForm.email, t]);

  useEffect(() => {
    if (open) {
      setMode("login");
      setShowPassword(false);
      setShowConfirmPassword(false);
      setLoginError("");
      setRegisterError("");
    }
  }, [open]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === "verify" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLoginChange =
    (field: keyof typeof loginForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setLoginForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleRegisterChange =
    (field: keyof typeof registerForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setRegisterForm((prev) => ({ ...prev, [field]: event.target.value }));
      setRegisterError("");
    };

  const handleForgotChange =
    (field: keyof typeof forgotForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForgotForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleResetChange =
    (field: keyof typeof resetForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setResetForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  // Removed handleCheckId

  const handleSwitchToRegister = () => {
    setRegisterForm((prev) => ({ ...prev, name: loginForm.name }));
    setMode("register");
  };

  const handleSwitchToLogin = () => {
    setLoginForm((prev) => ({ ...prev, name: registerForm.name }));
    setMode("login");
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!loginForm.name || !loginForm.password) return;

    setLoginError("");
    setLoginLoading(true);
    await logIn(loginForm.name, loginForm.password);
    setLoginLoading(false);

    if (getJwtToken()) onClose();
    else setLoginError(t("auth2.errLogin"));
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError(t("auth2.errMismatchRetype"));
      return;
    }

    setRegisterError("");
    setRegisterLoading(true);
    await signUp(
      registerForm.name,
      registerForm.email,
      registerForm.password,
      registerForm.phone,
      memberTypeMap[selectedUserType],
    );
    setRegisterLoading(false);

    if (getJwtToken()) onClose();
    else setRegisterError(t("auth2.errRegister"));
  };

  const handleForgotSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMode("verify");
    setTimeLeft(180);
    window.setTimeout(() => otpRefs.current[0]?.focus(), 80);
  };

  const handleResetSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (resetForm.password !== resetForm.confirmPassword) {
      setRegisterError(t("auth2.errMismatch"));
      return;
    }
    setMode("login");
  };

  const handleVerifySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "verify") {
      // In a real app, check if we came from 'forgot'
      // For this demo, let's assume if name in forgotForm is filled, we go to reset
      if (forgotForm.name) {
        setMode("reset");
      } else {
        // Successful registration logic
        setMode("login");
      }
    }
  };

  const handleResendOtp = () => {
    setTimeLeft(180);
    setOtp(Array(6).fill(""));
    otpRefs.current[0]?.focus();
    // Add API call for resending OTP here
  };

  const handleOtpChange = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = nextValue;
      return next;
    });

    if (nextValue && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const renderDivider = () => (
    <div className="auth-divider">
      <span />
      <em>or</em>
      <span />
    </div>
  );

  const renderSocialButtons = () => (
    <div className="auth-socials">
      <button type="button" className="auth-social-button">
        <img className="google" src="/img/icons/google.png" alt="google logo" />
        {t("auth2.gmail")}
      </button>
    </div>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      className="auth-dialog"
      PaperProps={{ className: "auth-dialog-paper" }}
    >
      <IconButton
        className="auth-close-button"
        onClick={onClose}
        aria-label={t("auth2.closeDialog")}
      >
        <Close />
      </IconButton>

      <section className={`auth-shell auth-shell-${mode}`}>
        <div className="auth-form-panel">
          <img src="/img/logo/Union.svg" className="auth-brand-logo" alt="" />
          <div className="auth-heading">
            <p className="auth-kicker">
              {mode === "login"
                ? t("auth2.kickerAccount")
                : t("auth2.kickerMembership")}
            </p>
            <h2>
              {title}
              {mode === "login" && <strong> Petora </strong>}
            </h2>
            <span>{subtitle}</span>
          </div>

          {mode === "login" && (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <label className="auth-field">
                <div className="auth-input-wrap">
                  <PersonOutline fontSize="small" />
                  <input
                    value={loginForm.name}
                    onChange={handleLoginChange("name")}
                    onFocus={() => setFocusedField("login-name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    autoComplete="username"
                  />
                  <span
                    className={
                      focusedField === "login-name" || loginForm.name
                        ? "floating"
                        : ""
                    }
                  >
                    {t("auth2.name")}
                  </span>
                </div>
              </label>

              <label className="auth-field">
                <div className="auth-input-wrap">
                  <LockOutlined fontSize="small" />
                  <input
                    value={loginForm.password}
                    onChange={handleLoginChange("password")}
                    onFocus={() => setFocusedField("login-password")}
                    onBlur={() => setFocusedField(null)}
                    type={showPassword ? "text" : "password"}
                    placeholder=" "
                    autoComplete="current-password"
                  />
                  <span
                    className={
                      focusedField === "login-password" || loginForm.password
                        ? "floating"
                        : ""
                    }
                  >
                    {t("auth2.password")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </button>
                </div>
              </label>

              <div className="auth-row">
                <label className="auth-check">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span>{t("auth2.rememberMe")}</span>
                </label>
                <button
                  type="button"
                  className="auth-link-button"
                  onClick={() => setMode("forgot")}
                >
                  {t("auth2.forgotPassword")}
                </button>
              </div>

              {loginError && <p className="auth-form-error">{loginError}</p>}

              <button
                className="auth-primary-button"
                type="submit"
                disabled={loginLoading}
              >
                {loginLoading ? t("auth2.loggingIn") : t("auth.loginShort")}
              </button>

              <p className="auth-switch-copy">
                {t("auth2.noAccount")}
                <button type="button" onClick={handleSwitchToRegister}>
                  {t("auth2.registerHere")}
                </button>
              </p>

              {renderDivider()}
              {renderSocialButtons()}
            </form>
          )}

          {mode === "register" && (
            <form
              className="auth-form auth-form-register"
              onSubmit={handleRegisterSubmit}
            >
              <label className="auth-field">
                <div className="auth-input-wrap">
                  <PersonOutline fontSize="small" />
                  <input
                    value={registerForm.name}
                    onChange={handleRegisterChange("name")}
                    onFocus={() => setFocusedField("reg-name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    autoComplete="name"
                    required
                  />
                  <span
                    className={
                      focusedField === "reg-name" || registerForm.name
                        ? "floating"
                        : ""
                    }
                  >
                    {t("auth2.name")}
                  </span>
                </div>
              </label>

              <label className="auth-field">
                <div className="auth-input-wrap">
                  <AlternateEmail fontSize="small" />
                  <input
                    value={registerForm.email}
                    onChange={handleRegisterChange("email")}
                    onFocus={() => setFocusedField("reg-email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    autoComplete="email"
                    required
                  />
                  <span
                    className={
                      focusedField === "reg-email" || registerForm.email
                        ? "floating"
                        : ""
                    }
                  >
                    {t("auth2.email")}
                  </span>
                </div>
              </label>

              <label className="auth-field">
                <div className="auth-input-wrap">
                  <PhoneIphone fontSize="small" />
                  <input
                    value={registerForm.phone}
                    onChange={handleRegisterChange("phone")}
                    onFocus={() => setFocusedField("reg-phone")}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    autoComplete="tel"
                    required
                  />
                  <span
                    className={
                      focusedField === "reg-phone" || registerForm.phone
                        ? "floating"
                        : ""
                    }
                  >
                    {t("auth2.phone")}
                  </span>
                </div>
              </label>

              <div className="auth-two-columns">
                <label className="auth-field">
                  <div className="auth-input-wrap">
                    <LockOutlined fontSize="small" />
                    <input
                      value={registerForm.password}
                      onChange={handleRegisterChange("password")}
                      onFocus={() => setFocusedField("reg-password")}
                      onBlur={() => setFocusedField(null)}
                      type={showPassword ? "text" : "password"}
                      placeholder=" "
                      autoComplete="new-password"
                      required
                    />
                    <span
                      className={
                        focusedField === "reg-password" || registerForm.password
                          ? "floating"
                          : ""
                      }
                    >
                      {t("auth2.password")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </button>
                  </div>
                </label>

                <label className="auth-field">
                  <div className="auth-input-wrap">
                    <LockOutlined fontSize="small" />
                    <input
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange("confirmPassword")}
                      onFocus={() => setFocusedField("reg-confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder=" "
                      autoComplete="new-password"
                      required
                    />
                    <span
                      className={
                        focusedField === "reg-confirmPassword" ||
                        registerForm.confirmPassword
                          ? "floating"
                          : ""
                      }
                    >
                      {t("auth2.reenter")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </button>
                  </div>
                </label>
              </div>

              <div
                className="auth-role-group"
                role="radiogroup"
                aria-label={t("auth2.chooseUserType")}
              >
                {userTypes.map(({ value, labelKey, descKey, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    className={selectedUserType === value ? "active" : ""}
                    onClick={() => setSelectedUserType(value)}
                    role="radio"
                    aria-checked={selectedUserType === value}
                  >
                    <Icon fontSize="small" />
                    <span>{t(labelKey)}</span>
                    <small>{t(descKey)}</small>
                  </button>
                ))}
              </div>

              {registerError && (
                <p className="auth-form-error">{registerError}</p>
              )}

              <button
                className="auth-primary-button"
                type="submit"
                disabled={registerLoading}
              >
                {registerLoading
                  ? t("auth2.creatingAccount")
                  : t("auth2.titleRegister")}
              </button>

              <p className="auth-switch-copy">
                {t("auth2.haveAccount")}
                <button type="button" onClick={handleSwitchToLogin}>
                  {t("auth2.loginHere")}
                </button>
              </p>

              {renderDivider()}
              {renderSocialButtons()}
            </form>
          )}

          {mode === "forgot" && (
            <form className="auth-form" onSubmit={handleForgotSubmit}>
              <label className="auth-field">
                <div className="auth-input-wrap">
                  <PersonOutline fontSize="small" />
                  <input
                    value={forgotForm.name}
                    onChange={handleForgotChange("name")}
                    onFocus={() => setFocusedField("forgot-name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    required
                  />
                  <span
                    className={
                      focusedField === "forgot-name" || forgotForm.name
                        ? "floating"
                        : ""
                    }
                  >
                    {t("auth2.name")}
                  </span>
                </div>
              </label>

              <label className="auth-field">
                <div className="auth-input-wrap">
                  <AlternateEmail fontSize="small" />
                  <input
                    value={forgotForm.email}
                    onChange={handleForgotChange("email")}
                    onFocus={() => setFocusedField("forgot-email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    type="email"
                    required
                  />
                  <span
                    className={
                      focusedField === "forgot-email" || forgotForm.email
                        ? "floating"
                        : ""
                    }
                  >
                    {t("auth2.email")}
                  </span>
                </div>
              </label>

              <button className="auth-primary-button" type="submit">
                {t("auth2.sendResetCode")}
              </button>

              <p className="auth-switch-copy">
                {t("auth2.rememberPassword")}
                <button type="button" onClick={() => setMode("login")}>
                  {t("auth2.backToLogin")}
                </button>
              </p>
            </form>
          )}

          {mode === "reset" && (
            <form className="auth-form" onSubmit={handleResetSubmit}>
              <label className="auth-field">
                <div className="auth-input-wrap">
                  <LockOutlined fontSize="small" />
                  <input
                    value={resetForm.password}
                    onChange={handleResetChange("password")}
                    onFocus={() => setFocusedField("reset-password")}
                    onBlur={() => setFocusedField(null)}
                    type={showPassword ? "text" : "password"}
                    placeholder=" "
                    required
                  />
                  <span
                    className={
                      focusedField === "reset-password" || resetForm.password
                        ? "floating"
                        : ""
                    }
                  >
                    {t("auth2.newPassword")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </button>
                </div>
              </label>

              <label className="auth-field">
                <div className="auth-input-wrap">
                  <LockOutlined fontSize="small" />
                  <input
                    value={resetForm.confirmPassword}
                    onChange={handleResetChange("confirmPassword")}
                    onFocus={() => setFocusedField("reset-confirm")}
                    onBlur={() => setFocusedField(null)}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder=" "
                    required
                  />
                  <span
                    className={
                      focusedField === "reset-confirm" ||
                      resetForm.confirmPassword
                        ? "floating"
                        : ""
                    }
                  >
                    {t("auth2.confirmPassword")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </button>
                </div>
              </label>

              <button className="auth-primary-button" type="submit">
                {t("auth2.resetPassword")}
              </button>
            </form>
          )}

          {mode === "verify" && (
            <form
              className="auth-form auth-verify-form"
              onSubmit={handleVerifySubmit}
            >
              <div className="auth-otp-grid">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(node) => {
                      otpRefs.current[index] = node;
                    }}
                    value={digit}
                    onChange={(event) =>
                      handleOtpChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleOtpKeyDown(index, event.key)}
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`Verification digit ${index + 1}`}
                  />
                ))}
              </div>

              <div className="auth-otp-meta">
                <p>
                  OTP will expire in <strong>{formatTime(timeLeft)}</strong>
                </p>
                <p>
                  {t("auth2.noCode")}
                  <button type="button" onClick={handleResendOtp}>
                    {t("auth2.resend")}
                  </button>
                </p>
              </div>

              <div className="auth-step-dots">
                <span />
                <span className="active" />
              </div>

              <button className="auth-primary-button" type="submit">
                {t("auth2.submit")}
              </button>

              <p className="auth-switch-copy">
                {t("auth2.haveAccount")}
                <button type="button" onClick={handleSwitchToLogin}>
                  {t("auth2.loginHere")}
                </button>
              </p>

              {renderDivider()}
              {renderSocialButtons()}
            </form>
          )}
        </div>

        <aside
          className={`auth-visual-panel ${isRegister ? "signup" : "login"} ${isResetFlow ? "reset-flow" : ""}`}
        >
          <div className="auth-visual-copy">
            <h3>
              {isResetFlow
                ? t("auth2.panelReset")
                : isRegister
                  ? t("auth2.panelRegister")
                  : t("auth2.panelLogin")}
            </h3>
          </div>

          <img
            src={sideImage}
            alt={isRegister ? t("auth2.altRegister") : t("auth2.altLogin")}
          />

          {!isResetFlow && (
            <div className="auth-benefit-card">
              {isRegister ? (
                <>
                  <h4>{t("auth2.benefitsTitle")}</h4>
                  <p>{t("auth2.benefits1")}</p>
                  <p>{t("auth2.benefits2")}</p>
                </>
              ) : (
                <>
                  <h4>{t("auth2.communityTitle")}</h4>
                  <p>{t("auth2.communityBody")}</p>
                  <div>
                    <span>
                      <CheckCircle fontSize="small" />
                      {t("auth2.communityBadge")}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </aside>
      </section>
    </Dialog>
  );
};

export default LoginRegister;
