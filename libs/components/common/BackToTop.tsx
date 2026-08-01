import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

/**
 * Back-to-top control, pinned bottom-right of every customer-facing page.
 *
 * Two jobs, split between two layers so neither has to compromise:
 *  - the ring reports how far down the page you are, so the button answers
 *    "how much is left?" before you press it;
 *  - the paw answers "what does pressing do?" — on hover it takes a step
 *    upward, so the motion itself is the affordance. Same paw geometry as the
 *    empty states and the 404 trail.
 */

const REVEAL_AT = 400; // ~half a viewport: far enough down that returning is a real errand
const RING_RADIUS = 22; // in the 48-unit viewBox, leaving room for the 2-unit stroke
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const PawPrint = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <ellipse cx="12" cy="16.4" rx="5.6" ry="4.6" />
    <ellipse
      cx="5.5"
      cy="10.4"
      rx="2.5"
      ry="3.2"
      transform="rotate(-20 5.5 10.4)"
    />
    <ellipse
      cx="9.9"
      cy="7.2"
      rx="2.4"
      ry="3.3"
      transform="rotate(-7 9.9 7.2)"
    />
    <ellipse
      cx="14.5"
      cy="7.2"
      rx="2.4"
      ry="3.3"
      transform="rotate(7 14.5 7.2)"
    />
    <ellipse
      cx="18.9"
      cy="10.4"
      rx="2.5"
      ry="3.2"
      transform="rotate(20 18.9 10.4)"
    />
  </svg>
);

const BackToTop = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(
        scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0,
      );
      setVisible(y > REVEAL_AT);
    };

    // Scroll fires far faster than the ring can meaningfully redraw, so collapse
    // every burst into one read per frame.
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const handleClick = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className={`back-to-top${visible ? " is-visible" : ""}`}
      onClick={handleClick}
      aria-label={t("backToTop")}
    >
      <svg className="back-to-top-ring" viewBox="0 0 48 48" aria-hidden="true">
        <circle
          className="back-to-top-ring-track"
          cx="24"
          cy="24"
          r={RING_RADIUS}
        />
        <circle
          className="back-to-top-ring-fill"
          cx="24"
          cy="24"
          r={RING_RADIUS}
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH * (1 - progress)}
        />
      </svg>

      {/* Three paws — left, right, left — on a track one paw tall. Sliding it up
          by two paws lands on a print identical to the one it started from, so
          the walk loops without a seam. */}
      <span className="back-to-top-window" aria-hidden="true">
        <span className="back-to-top-track">
          <PawPrint className="back-to-top-paw paw-left" />
          <PawPrint className="back-to-top-paw paw-right" />
          <PawPrint className="back-to-top-paw paw-left" />
        </span>
      </span>

      <span className="back-to-top-label" aria-hidden="true">
        {t("backToTop")}
      </span>
    </button>
  );
};

export default BackToTop;
