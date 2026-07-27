/**
 * "Pounce to basket" — the product tile leaps from the page into the basket.
 *
 * The motion follows animal physics rather than machine physics, which is the
 * one thing a pet shop can do that a generic fly-to-cart cannot: a crouch
 * before the leap, squash/stretch keyed to the direction of travel, an apex
 * ABOVE the basket, and a recoil in the basket that receives the weight.
 *
 * Everything is driven by the Web Animations API rather than CSS classes so
 * the badge and button animations compose with the styles already on them
 * instead of fighting the deeply-nested selectors in scss/pc/main.scss.
 */

const CROUCH_MS = 110;
const LEAP_MS = 470;
const CATCH_MS = 380;
const BADGE_POP_MS = 420;

/** A detail-page hero is far too big to fly; cap the ghost's longest edge. */
const MAX_GHOST_EDGE = 120;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The basket mounts twice (mobile topbar + desktop nav); only one is laid out. */
const visibleBasketButton = () =>
  Array.from(document.querySelectorAll<HTMLElement>(".basket-icon-btn")).find(
    (el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    },
  ) ?? null;

/**
 * The basket absorbing the item's weight, then the count ticking up.
 *
 * Animates the individual `translate` / `scale` properties rather than
 * `transform`, so the button keeps its CSS hover transform and the badge keeps
 * MUI's anchor translate — writing `transform` here would clobber both.
 */
const playCatch = (button: HTMLElement) => {
  button.animate(
    [
      { translate: "0 0", scale: "1" },
      { translate: "0 3px", scale: "0.92", offset: 0.3 },
      { translate: "0 -1px", scale: "1.06", offset: 0.62 },
      { translate: "0 0", scale: "1" },
    ],
    { duration: CATCH_MS, easing: "cubic-bezier(0.3, 1.2, 0.4, 1)" },
  );

  button.querySelector<HTMLElement>(".MuiBadge-badge")?.animate(
    [{ scale: "1" }, { scale: "1.5", offset: 0.35 }, { scale: "1" }],
    { duration: BADGE_POP_MS, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  );
};

/**
 * Sends `source` (an <img>, or any element containing one) to the basket.
 *
 * Returns false when no flight was played — reduced motion, no basket on
 * screen, or no image to clone — so the caller can fall back to a toast.
 */
export const flyToBasket = (source: HTMLElement | null): boolean => {
  if (typeof window === "undefined" || !source) return false;

  const target = visibleBasketButton();
  if (!target) return false;

  if (prefersReducedMotion()) {
    playCatch(target);
    return false;
  }

  const image =
    source instanceof HTMLImageElement ? source : source.querySelector("img");
  if (!image?.currentSrc && !image?.src) return false;

  // Measure on the next frame rather than now: the caller adds the item just
  // before calling this, and React commits that update after the handler
  // returns. Reading rects here would aim the leap using pre-commit layout.
  // (The header also reflows on scroll — `.navbar-main.transparent` above
  // 30px — so the basket's position is only trustworthy once settled.)
  requestAnimationFrame(() => runFlight(source, image, target));
  return true;
};

const runFlight = (
  source: HTMLElement,
  image: HTMLImageElement,
  target: HTMLElement,
) => {
  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  if (!from.width || !to.width) return;

  // Shrink the ghost around the source's centre so dx/dy stay centre-to-centre.
  const shrink = Math.min(1, MAX_GHOST_EDGE / Math.max(from.width, from.height));
  const width = from.width * shrink;
  const height = from.height * shrink;
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);

  // Three layers so each axis carries its own easing: x travels linearly (a
  // projectile's horizontal velocity is constant) while y overshoots.
  const ghost = document.createElement("div");
  ghost.className = "basket-fly-ghost";
  ghost.style.left = `${from.left + (from.width - width) / 2}px`;
  ghost.style.top = `${from.top + (from.height - height) / 2}px`;
  ghost.style.width = `${width}px`;
  ghost.style.height = `${height}px`;

  const lift = document.createElement("div");
  lift.className = "ghost-lift";

  const body = document.createElement("div");
  body.className = "ghost-body";

  const clone = document.createElement("img");
  clone.src = image.currentSrc || image.src;
  clone.alt = "";

  body.appendChild(clone);
  lift.appendChild(body);
  ghost.appendChild(lift);
  document.body.appendChild(ghost);

  const total = CROUCH_MS + LEAP_MS;
  const timing = {
    duration: LEAP_MS,
    delay: CROUCH_MS,
    fill: "both" as const,
  };

  const travel = ghost.animate(
    [{ translate: "0 0" }, { translate: `${dx}px 0` }],
    { ...timing, easing: "linear" },
  );

  // Overshooting past dy (which is negative — the basket is above) carries the
  // apex over the basket before it drops in. A cat landing on a counter.
  lift.animate([{ translate: "0 0" }, { translate: `0 ${dy}px` }], {
    ...timing,
    easing: "cubic-bezier(0.58, 1.38, 0.62, 1)",
  });

  // Effect-level easing MUST stay linear here: WAAPI applies it to overall
  // progress before interpolating keyframes, which would slide these offsets
  // off the clock and swallow the crouch. Character goes on the keyframes.
  body.animate(
    [
      { scale: "1 1", rotate: "0deg", opacity: 1, offset: 0, easing: "ease-in" },
      // Coil.
      {
        scale: "1.14 0.82",
        rotate: "0deg",
        opacity: 1,
        offset: CROUCH_MS / total,
        easing: "cubic-bezier(0.2, 0, 0.2, 1)",
      },
      // Stretch along travel at peak velocity.
      {
        scale: "0.86 1.18",
        rotate: "-6deg",
        opacity: 1,
        offset: (CROUCH_MS + LEAP_MS * 0.22) / total,
        easing: "ease-out",
      },
      // Shrink with distance.
      {
        scale: "0.52 0.52",
        rotate: "2deg",
        opacity: 1,
        offset: (CROUCH_MS + LEAP_MS * 0.72) / total,
      },
      { scale: "0.46 0.46", rotate: "4deg", opacity: 0.9, offset: 0.88 },
      // Squash on impact.
      { scale: "0.44 0.3", rotate: "4deg", opacity: 0, offset: 1 },
    ],
    { duration: total, easing: "linear", fill: "both" },
  );

  // `finished` rather than a timer: a backgrounded tab pauses the animation but
  // would still fire setTimeout, stranding the ghost mid-flight.
  travel.finished
    .then(() => {
      ghost.remove();
      playCatch(target);
    })
    .catch(() => ghost.remove());
};
