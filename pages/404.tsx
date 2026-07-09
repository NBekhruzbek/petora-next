import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Stack } from "@mui/material";
import withLayoutBasic from "@/libs/components/layout/LayoutBasic";
import useDeviceDetect from "@/libs/hooks/useDeviceDetect";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

interface PawPrint {
  id: number;
  x: number;
  y: number;
}

const NotFoundPage = () => {
  const router = useRouter();
  const device = useDeviceDetect();
  const [pawPrints, setPawPrints] = useState<PawPrint[]>([]);
  const [isFound, setIsFound] = useState(false);

  const addPawPrint = useCallback((x: number, y: number) => {
    const id = Date.now() + Math.random();

    setPawPrints((prints) => [...prints.slice(-13), { id, x, y }]);

    window.setTimeout(() => {
      setPawPrints((prints) => prints.filter((print) => print.id !== id));
    }, 1100);
  }, []);

  useEffect(() => {
    // The paw-print cursor trail follows the mouse — meaningless on touch,
    // where pointermove only fires while dragging.
    if (device === "mobile") return;

    let lastStamp = 0;

    const handlePointerMove = (event: PointerEvent) => {
      const now = performance.now();

      if (now - lastStamp < 85) return;

      lastStamp = now;
      addPawPrint(event.clientX, event.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [addPawPrint, device]);

  const handlePetClick = () => {
    setIsFound(true);
    window.setTimeout(() => setIsFound(false), 2200);
  };

  return (
    <>
      <Head>
        <title>404 - Page Not Found | Petora</title>
      </Head>

      <Stack className="petora-error-wrap">
        <main className={`petora-404 ${isFound ? "is-found" : ""}`}>
          {pawPrints.map((print, index) => (
            <span
              aria-hidden="true"
              className="cursor-paw"
              key={print.id}
              style={{
                left: print.x,
                top: print.y,
                animationDelay: `${index * 0.015}s`,
              }}
            >
              <PetsRoundedIcon />
            </span>
          ))}

          <span className="soft-orbit orbit-one" aria-hidden="true" />
          <span className="soft-orbit orbit-two" aria-hidden="true" />
          <span className="soft-orbit orbit-three" aria-hidden="true" />

          <section
            className="storybook-stage"
            aria-labelledby="not-found-title"
          >
            <div className="floating-detail detail-one" aria-hidden="true">
              <AutoAwesomeRoundedIcon />
            </div>
            <div className="floating-detail detail-two" aria-hidden="true">
              <PetsRoundedIcon />
            </div>
            <div className="floating-detail detail-three" aria-hidden="true">
              <AutoAwesomeRoundedIcon />
            </div>

            <button
              aria-label="Cheer up the lost puppy"
              className="pet-portrait"
              type="button"
              onClick={handlePetClick}
            >
              <span className="portrait-ring" />
              <span className="scene-sky" aria-hidden="true" />
              <span className="scene-tree tree-left" aria-hidden="true" />
              <span className="scene-tree tree-right" aria-hidden="true" />
              <span className="scene-hill hill-left" aria-hidden="true" />
              <span className="scene-hill hill-right" aria-hidden="true" />
              <img
                src="/img/pets/pet404error.png"
                alt="A tiny lost puppy looking for the missing page"
              />
              <span className="map-note" aria-hidden="true">
                <SearchRoundedIcon />
              </span>
              <span className="tail-wag" aria-hidden="true" />
              <span className="happy-burst burst-one" aria-hidden="true">
                <CelebrationRoundedIcon />
              </span>
              <span className="happy-burst burst-two" aria-hidden="true">
                <AutoAwesomeRoundedIcon />
              </span>
            </button>

            <div className="paw-trail" aria-hidden="true">
              <PetsRoundedIcon />
              <PetsRoundedIcon />
              <PetsRoundedIcon />
              <PetsRoundedIcon />
              <PetsRoundedIcon />
            </div>

            <div className="copy-card">
              <span className="eyebrow">Error - 404</span>
              <h1 id="not-found-title">
                404 - Page Not Found <PetsRoundedIcon />
              </h1>
              <p>
                Uh-oh... looks like this page wandered off. Our little buddy
                could not find what you were looking for.
              </p>

              <div className="petora-404-actions">
                <button
                  className="petora-404-btn primary"
                  type="button"
                  onClick={() => router.push("/")}
                >
                  <HomeRoundedIcon />
                  <span>Take Me Home</span>
                </button>
              </div>
            </div>
          </section>
        </main>
      </Stack>
    </>
  );
};

export default withLayoutBasic(NotFoundPage);
