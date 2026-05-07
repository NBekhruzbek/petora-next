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

interface LoginRegisterProps {
  open: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "register" | "verify";
type UserType = "admin" | "agent" | "user";
type IdStatus = "idle" | "checking" | "available" | "taken";

const userTypes: {
  value: UserType;
  label: string;
  description: string;
  Icon: typeof PersonOutline;
}[] = [
  {
    value: "admin",
    label: "Admin",
    description: "Manage platform operations",
    Icon: AdminPanelSettings,
  },
  {
    value: "agent",
    label: "Service Agent",
    description: "Offer pet care services",
    Icon: SupportAgent,
  },
  {
    value: "user",
    label: "User",
    description: "Book, shop and join Petora",
    Icon: PersonOutline,
  },
];

const maskId = (value: string) => {
  if (!value) return "your account ID";
  if (value.includes("@")) {
    const [name, domain] = value.split("@");
    return `${name.slice(0, 3)}${"*".repeat(Math.max(name.length - 3, 4))}@${domain}`;
  }

  return `${value.slice(0, 3)}${"*".repeat(Math.max(value.length - 3, 4))}`;
};

const LoginRegister = ({ open, onClose }: LoginRegisterProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedUserType, setSelectedUserType] = useState<UserType>("user");
  const [idStatus, setIdStatus] = useState<IdStatus>("idle");
  const [registerError, setRegisterError] = useState("");
  const [loginForm, setLoginForm] = useState({ name: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isRegister = mode !== "login";
  const sideImage = isRegister
    ? "/img/pets/PetSignUp.png"
    : "/img/pets/PetLogin.png";

  const title = useMemo(() => {
    if (mode === "login") return "Welcome to";
    if (mode === "register") return "Create Account";
    return "Check Your Email";
  }, [mode]);

  const subtitle = useMemo(() => {
    if (mode === "login") {
      return "Sign in with your ID and password, or continue with a connected account.";
    }
    if (mode === "register") {
      return "Join Petora to book trusted care, shop smarter, and protect pets together.";
    }
    return `We sent a 6-digit verification code to ${maskId(registerForm.email)}.`;
  }, [mode, registerForm.email]);

  useEffect(() => {
    if (open) {
      setMode("login");
      setShowPassword(false);
      setShowConfirmPassword(false);
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

  // Removed handleCheckId

  const handleSwitchToRegister = () => {
    setRegisterForm((prev) => ({ ...prev, name: loginForm.name }));
    setMode("register");
  };

  const handleSwitchToLogin = () => {
    setLoginForm((prev) => ({ ...prev, name: registerForm.name }));
    setMode("login");
  };

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError("Passwords do not match. Please re-enter them.");
      return;
    }

    setMode("verify");
    setTimeLeft(180);
    window.setTimeout(() => otpRefs.current[0]?.focus(), 80);
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
        <img
          className="google"
          src="./img/icons/google.png"
          alt="google logo"
        />
        Continue with Gmail
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
        aria-label="Close login dialog"
      >
        <Close />
      </IconButton>

      <section className={`auth-shell auth-shell-${mode}`}>
        <div className="auth-form-panel">
          <img src="./img/logo/Union.svg" className="auth-brand-logo" alt="" />
          <div className="auth-heading">
            <p className="auth-kicker">
              {mode === "login" ? "Petora Account" : "Petora Membership"}
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
                    Name
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
                    Password
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
                  <span>Remember me</span>
                </label>
                <button type="button" className="auth-link-button">
                  Forgot password?
                </button>
              </div>

              <button className="auth-primary-button" type="submit">
                Login
              </button>

              <p className="auth-switch-copy">
                Don't have an account?
                <button type="button" onClick={handleSwitchToRegister}>
                  Register here
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
                    Name
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
                    Email
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
                    Phone Number
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
                      Password
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
                      Re-enter
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
                aria-label="Choose user type"
              >
                {userTypes.map(({ value, label, description, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    className={selectedUserType === value ? "active" : ""}
                    onClick={() => setSelectedUserType(value)}
                    role="radio"
                    aria-checked={selectedUserType === value}
                  >
                    <Icon fontSize="small" />
                    <span>{label}</span>
                    <small>{description}</small>
                  </button>
                ))}
              </div>

              {registerError && (
                <p className="auth-form-error">{registerError}</p>
              )}

              <button className="auth-primary-button" type="submit">
                Create Account
              </button>

              <p className="auth-switch-copy">
                Already have an account?
                <button type="button" onClick={handleSwitchToLogin}>
                  Login Here
                </button>
              </p>

              {renderDivider()}
              {renderSocialButtons()}
            </form>
          )}

          {mode === "verify" && (
            <form
              className="auth-form auth-verify-form"
              onSubmit={handleLoginSubmit}
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
                  Didn't receive the code?
                  <button type="button" onClick={handleResendOtp}>
                    Resend
                  </button>
                </p>
              </div>

              <div className="auth-step-dots">
                <span />
                <span className="active" />
              </div>

              <button className="auth-primary-button" type="submit">
                Submit
              </button>

              <p className="auth-switch-copy">
                Already have an account?
                <button type="button" onClick={handleSwitchToLogin}>
                  Login Here
                </button>
              </p>

              {renderDivider()}
              {renderSocialButtons()}
            </form>
          )}
        </div>

        <aside
          className={`auth-visual-panel ${isRegister ? "signup" : "login"}`}
        >
          <div className="auth-visual-copy">
            <h3>
              {isRegister
                ? "Become a member today and help protect animals!"
                : "Healthy pets bring joy and enrich your life."}
            </h3>
          </div>

          <img
            src={sideImage}
            alt={
              isRegister ? "Cat and dog sitting together" : "Happy puppy waving"
            }
          />

          <div className="auth-benefit-card">
            {isRegister ? (
              <>
                <h4>Member Benefits: Exclusive Discounts, Rewards</h4>
                <p>
                  Enjoy special pricing on pet food, toys, accessories, and care
                  services.
                </p>
                <p>
                  Get early access to new products, events, and protection
                  programs.
                </p>
              </>
            ) : (
              <>
                <h4>Join Our Online Pet Care & Protection Community</h4>
                <p>
                  Share knowledge, meet trusted caregivers, and help pets live
                  better lives.
                </p>
                <div>
                  <span>
                    <CheckCircle fontSize="small" />
                    Join with 100k+ pet people
                  </span>
                </div>
              </>
            )}
          </div>
        </aside>
      </section>
    </Dialog>
  );
};

export default LoginRegister;
