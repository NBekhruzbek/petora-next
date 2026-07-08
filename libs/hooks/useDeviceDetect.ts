import { useEffect, useState } from "react";

type Device = "mobile" | "desktop";

const MOBILE_UA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;
const MOBILE_MAX_WIDTH = 768;

const getDevice = (): Device => {
  if (typeof window === "undefined") return "desktop"; // SSR himoyasi
  const byUA = MOBILE_UA.test(navigator.userAgent);
  const byWidth = window.innerWidth <= MOBILE_MAX_WIDTH;
  return byUA || byWidth ? "mobile" : "desktop";
};

const useDeviceDetect = (): Device => {
  const [device, setDevice] = useState<Device>("desktop");

  useEffect(() => {
    const update = () => setDevice(getDevice());
    update(); // mount paytida bir marta
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []); // bo'sh deps — faqat bir marta o'rnatiladi

  return device;
};

export default useDeviceDetect;
