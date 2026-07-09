import React, { useEffect, useRef } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { gsap } from "gsap";
import useDeviceDetect from "@/libs/hooks/useDeviceDetect";

interface InstagramPost {
  id: number;
  image: string;
  alt: string;
}

const basePosts: InstagramPost[] = [
  { id: 1, image: "/img/social-media/insta1.jpg", alt: "Instagram post 1" },
  { id: 2, image: "/img/social-media/insta2.jpeg", alt: "Instagram post 2" },
  { id: 3, image: "/img/social-media/insta3.jpg", alt: "Instagram post 3" },
  { id: 4, image: "/img/social-media/insta4.webp", alt: "Instagram post 4" },
  { id: 5, image: "/img/social-media/insta5.jpeg", alt: "Instagram post 5" },
  { id: 6, image: "/img/social-media/insta6.jpg", alt: "Instagram post 6" },
  { id: 7, image: "/img/social-media/insta7.jpg", alt: "Instagram post 7" },
  { id: 8, image: "/img/social-media/insta8.webp", alt: "Instagram post 8" },
];

const carouselPosts: InstagramPost[] = Array.from({ length: 12 }, (_, idx) => ({
  id: idx + 1,
  image: basePosts[idx % basePosts.length]!.image,
  alt: `Instagram post ${idx + 1}`,
}));
const INSTAGRAM_URL = "https://www.instagram.com/mr_bekhruzbek1/";

const randomInt = (max: number) => Math.floor(Math.random() * max) + 1;

const SocialMedia = () => {
  const device = useDeviceDetect();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // The 3D coverflow is mouse-driven; the mobile branch renders a plain
    // grid instead, so skip the GSAP setup entirely there.
    if (device === "mobile") return;

    const content = contentRef.current;
    const carousel = carouselRef.current;
    const items = carousel
      ? Array.from(carousel.querySelectorAll<HTMLElement>(".carouselItem"))
      : [];

    if (!content || !carousel || items.length === 0) return;

    const itemLength = items.length;
    const rY = 360 / itemLength;
    const radius = Math.round(250 / Math.tan(Math.PI / itemLength));

    let mouseX = 0;
    const mouseZ = -radius;
    let addX = 0;

    gsap.set(content, { perspective: 600 });
    gsap.set(carousel, { z: mouseZ });

    items.forEach((item, i) => {
      const block = item.querySelector<HTMLElement>(".carouselItemInner");
      if (!block) return;

      const nrX = 360 * randomInt(2);
      const nrY = 360 * randomInt(2);
      const nx = -2000 + randomInt(4000);
      const ny = -2000 + randomInt(4000);
      const nz = -4000 + randomInt(4000);
      const duration = 1.5 + randomInt(10) * 0.1;
      const delay = 1 - randomInt(8) * 0.1;

      gsap.set(item, {
        rotationY: rY * i,
        z: radius,
        transformOrigin: `50% 50% ${-radius}px`,
        autoAlpha: 0,
      });
      gsap.set(block, {
        z: nz,
        rotationY: nrY,
        rotationX: nrX,
        x: nx,
        y: ny,
        autoAlpha: 0,
      });

      gsap.to(item, { autoAlpha: 1, delay });
      gsap.to(block, {
        delay,
        duration,
        rotationY: 0,
        rotationX: 0,
        z: 0,
        ease: "expo.inOut",
      });
      gsap.to(block, {
        delay,
        duration: duration - 0.5,
        x: 0,
        y: 0,
        autoAlpha: 1,
        ease: "expo.inOut",
      });
    });

    const onMouseMove = (event: MouseEvent) => {
      mouseX = -(-(window.innerWidth * 0.5) + event.pageX) * 0.0008;
    };

    window.addEventListener("mousemove", onMouseMove);

    const autoRotateSpeed = 0.001;

    const loop = window.setInterval(() => {
      addX += mouseX || autoRotateSpeed;

      gsap.to(carousel, {
        duration: 5,
        rotationY: addX,
        rotationX: 0,
        ease: "power3.out",
      });
      gsap.set(carousel, { z: mouseZ });
    }, 1000 / 60);

    return () => {
      window.clearInterval(loop);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [device]);

  if (device === "mobile") {
    return (
      <Stack className="instagram-frame">
        <Stack className="container">
          <Stack className="instagram-main">
            <Box className="section-title">
              FOLLOW US ON <span className="social-media-text">INSTAGRAM</span>
            </Box>
            <Typography className="instagram-mobile-subtitle">
              Join our Instagram community for updates, special deals, and
              more!
            </Typography>
            <Box className="instagram-mobile-grid">
              {basePosts.map((post) => (
                <a
                  key={post.id}
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="instagram-mobile-tile"
                  aria-label={`${post.alt} - open on Instagram`}
                >
                  <img src={post.image} alt={post.alt} loading="lazy" />
                </a>
              ))}
            </Box>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack className="instagram-frame">
      <Stack className="container">
        <Stack className="instagram-main">
          <Box className="section-title">
            FOLLOW US ON <span className="social-media-text">INSTAGRAM</span>
          </Box>
          <Typography
            sx={{
              fontFamily: '"Archivo", sans-serif',
              fontSize: "16px",
              fontWeight: 400,
              color: "#646464",
              textAlign: "center",
            }}
          >
            Join our Instagram community for updates, special deals, and more!
          </Typography>
          <Stack id="contentContainer" ref={contentRef} className="trans3d">
            <section
              id="carouselContainer"
              ref={carouselRef}
              className="trans3d"
            >
              {carouselPosts.map((post) => (
                <figure key={post.id} className="carouselItem trans3d">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${post.alt} - open on Instagram`}
                  >
                    <Stack
                      className="carouselItemInner trans3d"
                      aria-hidden="true"
                      style={{ backgroundImage: `url('${post.image}')` }}
                    >
                      <Stack className="instagram-overlay">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M7 2H17C19.7614 2 22 4.23858 22 7V17C22 19.7614 19.7614 22 17 22H7C4.23858 22 2 19.7614 2 17V7C2 4.23858 4.23858 2 7 2ZM12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7ZM12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9ZM17.5 6C18.3284 6 19 6.67157 19 7.5C19 8.32843 18.3284 9 17.5 9C16.6716 9 16 8.32843 16 7.5C16 6.67157 16.6716 6 17.5 6Z" />
                        </svg>
                      </Stack>
                    </Stack>
                  </a>
                </figure>
              ))}
            </section>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SocialMedia;
