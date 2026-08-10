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
  ClipboardEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getJwtToken, logIn, loginWithGoogle, signUp } from "@/libs/auth";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useMutation } from "@apollo/client";
import {
  REQUEST_PASSWORD_RESET,
  RESET_PASSWORD,
  VERIFY_PASSWORD_RESET_CODE,
} from "@/apollo/user/mutation";

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
  const [googleError, setGoogleError] = useState("");
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
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  // Handed out by the server once the code verifies; the reset step spends it.
  const [resetToken, setResetToken] = useState("");
  const [loginNotice, setLoginNotice] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [googleBtnWrap, setGoogleBtnWrap] = useState<HTMLDivElement | null>(
    null,
  );
  const [googleBtnWidth, setGoogleBtnWidth] = useState(300);

  const [requestPasswordReset] = useMutation(REQUEST_PASSWORD_RESET);
  const [verifyPasswordResetCode] = useMutation(VERIFY_PASSWORD_RESET_CODE);
  const [resetPassword] = useMutation(RESET_PASSWORD);

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
      setGoogleError("");
      setResetError("");
      setLoginNotice("");
      setResetToken("");
      setOtp(Array(6).fill(""));
      setForgotForm({ name: "", email: "" });
      setResetForm({ password: "", confirmPassword: "" });
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

  useEffect(() => {
    if (!googleBtnWrap) return;

    const updateWidth = () =>
      setGoogleBtnWidth(Math.min(googleBtnWrap.offsetWidth, 400));

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(googleBtnWrap);
    return () => observer.disconnect();
  }, [googleBtnWrap]);

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
      setResetError("");
    };

  const handleResetChange =
    (field: keyof typeof resetForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setResetForm((prev) => ({ ...prev, [field]: event.target.value }));
      setResetError("");
    };

  const sendResetCode = async () => {
    await requestPasswordReset({
      variables: {
        input: {
          memberUserName: forgotForm.name.trim(),
          memberEmail: forgotForm.email.trim(),
        },
      },
    });
    setOtp(Array(6).fill(""));
    setTimeLeft(180);
    window.setTimeout(() => otpRefs.current[0]?.focus(), 80);
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

  const handleForgotSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setResetError("");
    setResetLoading(true);
    try {
      await sendResetCode();
      setMode("verify");
    } catch {
      setResetError(t("auth2.errResetRequest"));
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = otp.join("");
    if (code.length !== otp.length) {
      setResetError(t("auth2.errCodeIncomplete"));
      return;
    }

    setResetError("");
    setResetLoading(true);
    try {
      const { data } = await verifyPasswordResetCode({
        variables: {
          input: { memberUserName: forgotForm.name.trim(), code },
        },
      });
      setResetToken(data?.verifyPasswordResetCode ?? "");
      setResetForm({ password: "", confirmPassword: "" });
      setMode("reset");
    } catch {
      setResetError(t("auth2.errCode"));
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (resetForm.password !== resetForm.confirmPassword) {
      setResetError(t("auth2.errMismatch"));
      return;
    }

    setResetError("");
    setResetLoading(true);
    try {
      await resetPassword({
        variables: {
          input: { resetToken, memberPassword: resetForm.password },
        },
      });

      // Land back on login with the username already filled, so the new password
      // can be used straight away.
      setLoginForm({ name: forgotForm.name.trim(), password: "" });
      setLoginNotice(t("auth2.resetDone"));
      setResetToken("");
      setResetForm({ password: "", confirmPassword: "" });
      setMode("login");
    } catch {
      setResetError(t("auth2.errResetExpired"));
    } finally {
      setResetLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResetError("");
    setResetLoading(true);
    try {
      await sendResetCode();
    } catch {
      setResetError(t("auth2.errResetRequest"));
    } finally {
      setResetLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    setResetError("");
    setOtp((prev) => {
      const next = [...prev];
      next[index] = nextValue;
      return next;
    });

    if (nextValue && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // maxLength caps a paste at one character per box, so the whole code has to be
  // spread across the boxes by hand.
  const handleOtpPaste = (
    index: number,
    event: ClipboardEvent<HTMLInputElement>,
  ) => {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!digits) return;

    event.preventDefault();
    setResetError("");
    setOtp((prev) => {
      const next = [...prev];
      digits.split("").forEach((digit, offset) => {
        if (index + offset < next.length) next[index + offset] = digit;
      });
      return next;
    });

    otpRefs.current[Math.min(index + digits.length, otp.length - 1)]?.focus();
  };

  const handleOtpKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    const { credential } = credentialResponse;
    if (!credential) return;

    setGoogleError("");
    await loginWithGoogle(credential);

    if (getJwtToken()) onClose();
    else setGoogleError(t("auth2.errLogin"));
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
      <div className="auth-google-btn" ref={setGoogleBtnWrap}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setGoogleError(t("auth2.errLogin"))}
          theme="outline"
          size="large"
          shape="rectangular"
          text="continue_with"
          logo_alignment="left"
          width={googleBtnWidth}
        />
      </div>
      {googleError && <p className="auth-form-error">{googleError}</p>}
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
                  onClick={() => {
                    setLoginNotice("");
                    setResetError("");
                    setForgotForm({ name: loginForm.name, email: "" });
                    setMode("forgot");
                  }}
                >
                  {t("auth2.forgotPassword")}
                </button>
              </div>

              {loginNotice && <p className="auth-form-notice">{loginNotice}</p>}
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

              {resetError && <p className="auth-form-error">{resetError}</p>}

              <button
                className="auth-primary-button"
                type="submit"
                disabled={resetLoading}
              >
                {resetLoading ? t("auth2.sending") : t("auth2.sendResetCode")}
              </button>

              <p className="auth-switch-copy">
                {t("auth2.rememberPassword")}
                <button
                  type="button"
                  onClick={() => {
                    setResetError("");
                    setMode("login");
                  }}
                >
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

              {resetError && <p className="auth-form-error">{resetError}</p>}

              <button
                className="auth-primary-button"
                type="submit"
                disabled={resetLoading}
              >
                {resetLoading ? t("auth2.resetting") : t("auth2.resetPassword")}
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
                    onPaste={(event) => handleOtpPaste(index, event)}
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`Verification digit ${index + 1}`}
                  />
                ))}
              </div>

              <div className="auth-otp-meta">
                <p>
                  {timeLeft > 0 ? (
                    <>
                      OTP will expire in <strong>{formatTime(timeLeft)}</strong>
                    </>
                  ) : (
                    <strong>{t("auth2.codeExpired")}</strong>
                  )}
                </p>
                <p>
                  {t("auth2.noCode")}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resetLoading}
                  >
                    {t("auth2.resend")}
                  </button>
                </p>
              </div>

              {resetError && <p className="auth-form-error">{resetError}</p>}

              <div className="auth-step-dots">
                <span />
                <span className="active" />
              </div>

              <button
                className="auth-primary-button"
                type="submit"
                disabled={resetLoading || timeLeft === 0}
              >
                {resetLoading ? t("auth2.verifying") : t("auth2.submit")}
              </button>

              <p className="auth-switch-copy">
                {t("auth2.rememberPassword")}
                <button
                  type="button"
                  onClick={() => {
                    setResetError("");
                    setMode("login");
                  }}
                >
                  {t("auth2.backToLogin")}
                </button>
              </p>
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
