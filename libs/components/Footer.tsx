import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";

const Footer = () => {
  const router = useRouter();

  return (
    <Stack className="footer-main">
      <Stack className="container">
        <Stack className={"footer-info"}>
          <Box className={"logo-section"}>
            <img className="logo" src="/img/logo/Petora-logo.png" alt="" />
            <span className="logo-name">Petora</span>
          </Box>
          <Box className={"text"}>
            Welcome to Cuddle & Care Pets! We provide quality pet products,
            grooming, and care advice for your furry friends.
          </Box>
          <Stack className="contact-section">
            <Box className={"contact"}>
              <img src="/img/icons/Email.svg" alt="" />
              <a href="mailto:bekhruzbek2022@gmail.com">bekhruzbek2022@gm...</a>
            </Box>
            <Box className={"contact"}>
              <img src="/img/icons/Phone.svg" alt="" />
              <a href="tel:+821058898183">+82 10-5889-8183</a>
            </Box>
            <Box className={"contact"}>
              <img src="/img/icons/Email.svg" alt="" />
              <a href="mailto:bekhruzbek2022@gmail.com">bekhruzbek2022@gm...</a>
            </Box>
            <Box className={"contact"}>
              <img src="/img/icons/Phone.svg" alt="" />
              <a href="tel:+821058898183">+82 10-5889-8183</a>
            </Box>
          </Stack>
          <Stack className="social-media">
            <Box>
              <Button
                component={Link}
                href="https://www.instagram.com/mr_bekhruzbek1"
              >
                <img src="/img/icons/Instagram.svg" alt="" />
              </Button>
            </Box>
            <Box>
              <Button
                component={Link}
                href="https://www.facebook.com/NBekhruzbek"
              >
                <img src="/img/icons/Facebook.svg" alt="" />
              </Button>
            </Box>
            <Box>
              <Button
                component={Link}
                href="https://www.linkedin.com/in/nbekhruzbek/"
              >
                <img src="/img/icons/Linkedin.svg" alt="" />
              </Button>
            </Box>
          </Stack>
        </Stack>

        <Stack className={"footer-img"}>
          <Box className={"first-square"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="303"
              height="316"
              viewBox="0 0 313 336"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M308.854 273.328L307.858 272.031C307.197 272.538 306.427 272.927 305.567 273.158L301.525 274.241L301.948 275.821L305.991 274.738C307.062 274.451 308.026 273.964 308.854 273.328ZM83.6465 334.315L83.2232 332.735L79.1806 333.818C78.3208 334.048 77.4591 334.096 76.6336 333.987L76.4195 335.609C77.4544 335.745 78.5328 335.685 79.6039 335.398L83.6465 334.315ZM1.36356 74.9983L2.94342 74.575L1.86049 70.5334C1.63011 69.6737 1.58232 68.812 1.69134 67.9865L0.0698018 67.7724C-0.0668643 68.8073 -0.0063629 69.8857 0.280633 70.9568L1.36356 74.9983ZM228.407 1.3639L232.45 0.280682C233.521 -0.00631394 234.6 -0.0667964 235.634 0.0698704L235.42 1.69139C234.595 1.58238 233.733 1.63017 232.873 1.86055L228.831 2.94376L228.407 1.3639ZM310.69 260.68L309.11 261.104L310.193 265.145C310.424 266.005 310.472 266.866 310.363 267.692L311.984 267.906C312.121 266.871 312.06 265.793 311.773 264.722L310.69 260.68ZM308.525 252.597L306.945 253.02L304.779 244.937L306.359 244.514L308.525 252.597ZM304.193 236.431L302.613 236.854L300.447 228.771L302.027 228.348L304.193 236.431ZM299.861 220.265L298.281 220.688L296.115 212.605L297.695 212.182L299.861 220.265ZM295.529 204.099L293.95 204.522L291.784 196.439L293.364 196.016L295.529 204.099ZM291.198 187.933L289.618 188.356L287.452 180.273L289.032 179.849L291.198 187.933ZM286.866 171.766L285.286 172.19L283.12 164.107L284.7 163.683L286.866 171.766ZM282.534 155.6L280.954 156.024L278.789 147.94L280.368 147.517L282.534 155.6ZM278.203 139.434L276.623 139.857L274.457 131.774L276.037 131.351L278.203 139.434ZM273.871 123.268L272.291 123.691L270.125 115.608L271.705 115.185L273.871 123.268ZM269.539 107.102L267.959 107.525L265.793 99.4421L267.373 99.0187L269.539 107.102ZM265.207 90.9357L263.628 91.359L261.462 83.2759L263.042 82.8526L265.207 90.9357ZM260.876 74.7695L259.296 75.1929L257.13 67.1098L258.71 66.6865L260.876 74.7695ZM256.544 58.6034L254.964 59.0267L252.798 50.9436L254.378 50.5203L256.544 58.6034ZM252.212 42.4372L250.632 42.8606L248.467 34.7775L250.046 34.3542L252.212 42.4372ZM247.881 26.2711L246.301 26.6944L244.135 18.6114L245.715 18.188L247.881 26.2711ZM243.549 10.105L241.969 10.5283L240.886 6.48671C240.656 5.62693 240.266 4.85681 239.759 4.19644L241.056 3.20023C241.692 4.02813 242.179 4.99231 242.466 6.06339L243.549 10.105ZM220.322 3.53033L220.746 5.1102L212.66 7.27663L212.237 5.69677L220.322 3.53033ZM204.152 7.8632L204.575 9.44306L196.49 11.6095L196.066 10.0296L204.152 7.8632ZM187.981 12.1961L188.405 13.7759L180.319 15.9424L179.896 14.3625L187.981 12.1961ZM171.811 16.5289L172.234 18.1088L164.149 20.2752L163.725 18.6954L171.811 16.5289ZM155.64 20.8618L156.064 22.4417L147.978 24.6081L147.555 23.0282L155.64 20.8618ZM139.47 25.1947L139.893 26.7745L131.808 28.941L131.385 27.3611L139.47 25.1947ZM123.299 29.5275L123.723 31.1074L115.637 33.2738L115.214 31.694L123.299 29.5275ZM107.129 33.8604L107.552 35.4403L99.4669 37.6067L99.0436 36.0268L107.129 33.8604ZM90.9583 38.1933L91.3817 39.7731L83.2964 41.9396L82.8731 40.3597L90.9583 38.1933ZM74.7878 42.5261L75.2112 44.106L67.1259 46.2724L66.7026 44.6926L74.7878 42.5261ZM58.6174 46.859L59.0407 48.4389L50.9554 50.6053L50.5321 49.0254L58.6174 46.859ZM42.4469 51.1919L42.8702 52.7717L34.785 54.9382L34.3616 53.3583L42.4469 51.1919ZM26.2764 55.5247L26.6997 57.1046L18.6145 59.271L18.1912 57.6912L26.2764 55.5247ZM10.1059 59.8576L10.5293 61.4375L6.48666 62.5207C5.6269 62.7511 4.85677 63.1405 4.19639 63.6476L3.20018 62.3504C4.02808 61.7146 4.99225 61.2278 6.06333 60.9408L10.1059 59.8576ZM3.52941 83.0814L5.10927 82.6581L7.27512 90.7411L5.69527 91.1645L3.52941 83.0814ZM7.86112 99.2475L9.44098 98.8242L11.6068 106.907L10.027 107.331L7.86112 99.2475ZM12.1928 115.414L13.7727 114.99L15.9385 123.073L14.3587 123.497L12.1928 115.414ZM16.5245 131.58L18.1044 131.156L20.2702 139.24L18.6904 139.663L16.5245 131.58ZM20.8562 147.746L22.4361 147.323L24.6019 155.406L23.0221 155.829L20.8562 147.746ZM25.1879 163.912L26.7678 163.489L28.9337 171.572L27.3538 171.995L25.1879 163.912ZM29.5196 180.078L31.0995 179.655L33.2654 187.738L31.6855 188.161L29.5196 180.078ZM33.8514 196.244L35.4312 195.821L37.5971 203.904L36.0172 204.327L33.8514 196.244ZM38.1831 212.411L39.7629 211.987L41.9288 220.07L40.3489 220.494L38.1831 212.411ZM42.5148 228.577L44.0946 228.153L46.2605 236.236L44.6806 236.66L42.5148 228.577ZM46.8465 244.743L48.4263 244.319L50.5922 252.403L49.0123 252.826L46.8465 244.743ZM51.1782 260.909L52.758 260.486L54.9239 268.569L53.344 268.992L51.1782 260.909ZM55.5099 277.075L57.0897 276.652L59.2556 284.735L57.6757 285.158L55.5099 277.075ZM59.8416 293.241L61.4214 292.818L63.5873 300.901L62.0074 301.324L59.8416 293.241ZM64.1733 309.407L65.7531 308.984L67.919 317.067L66.3391 317.49L64.1733 309.407ZM68.505 325.574L70.0849 325.15L71.1678 329.192C71.3982 330.052 71.7876 330.822 72.2948 331.482L70.9975 332.478C70.3617 331.65 69.8749 330.686 69.5879 329.615L68.505 325.574ZM91.7317 332.148L91.3084 330.568L99.3937 328.402L99.817 329.982L91.7317 332.148ZM107.902 327.815L107.479 326.235L115.564 324.069L115.987 325.649L107.902 327.815ZM124.073 323.482L123.649 321.903L131.735 319.736L132.158 321.316L124.073 323.482ZM140.243 319.15L139.82 317.57L147.905 315.403L148.328 316.983L140.243 319.15ZM156.414 314.817L155.99 313.237L164.076 311.07L164.499 312.65L156.414 314.817ZM172.584 310.484L172.161 308.904L180.246 306.738L180.669 308.317L172.584 310.484ZM188.755 306.151L188.331 304.571L196.417 302.405L196.84 303.985L188.755 306.151ZM204.925 301.818L204.502 300.238L212.587 298.072L213.01 299.652L204.925 301.818ZM221.096 297.485L220.672 295.905L228.758 293.739L229.181 295.319L221.096 297.485ZM237.266 293.152L236.843 291.572L244.928 289.406L245.351 290.986L237.266 293.152ZM253.437 288.819L253.013 287.24L261.098 285.073L261.522 286.653L253.437 288.819ZM269.607 284.487L269.184 282.907L277.269 280.74L277.692 282.32L269.607 284.487ZM285.778 280.154L285.354 278.574L293.439 276.407L293.863 277.987L285.778 280.154Z"
                fill="#595959"
              />
            </svg>
          </Box>
          <Box className={"second-square"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="350"
              viewBox="0 0 373 396"
              fill="none"
            >
              <g filter="url(#filter0_d_4612_3647)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M107.911 36.6003L334.297 97.2605C335.17 97.4943 335.688 98.3911 335.454 99.2636L266.146 357.922C265.913 358.795 265.016 359.312 264.143 359.079L37.7566 298.418C36.8841 298.185 36.3663 297.288 36.6001 296.415L105.907 37.7568C106.141 36.8843 107.038 36.3665 107.911 36.6003ZM335.991 90.941C340.353 92.11 342.942 96.5943 341.773 100.957L272.466 359.615C271.297 363.978 266.813 366.567 262.45 365.398L36.0633 304.738C31.7006 303.569 29.1116 299.085 30.2806 294.722L99.5879 36.0636C100.757 31.7009 105.241 29.1119 109.604 30.2808L335.991 90.941Z"
                  fill="white"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_4612_3647"
                  x="0"
                  y="0"
                  width="372.054"
                  height="395.679"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="15" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_4612_3647"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_4612_3647"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </Box>
          <img className="dog-image" src="/img/footer-dog.png" alt="" />
        </Stack>

        <Stack className={"footer-nav"}>
          <Box className={"main-text"}>Navbar</Box>
          <Stack className="router-box">
            <Box className="left-box">
              <Link href={"/"}>
                <div className="navLink-text">
                  {" "}
                  <FiberManualRecordOutlinedIcon
                    style={{ fontSize: "12px" }}
                  />{" "}
                  Home
                </div>
              </Link>
              <Link href={"/service"}>
                <div className="navLink-text">
                  <FiberManualRecordOutlinedIcon style={{ fontSize: "12px" }} />{" "}
                  Service
                </div>
              </Link>
              <Link href={"/agents"}>
                <div className="navLink-text">
                  <FiberManualRecordOutlinedIcon style={{ fontSize: "12px" }} />{" "}
                  Agents
                </div>
              </Link>
            </Box>
            <Box className={"right-box"}>
              <Link href={"/shop"}>
                <div className="navLink-text">
                  <FiberManualRecordOutlinedIcon style={{ fontSize: "12px" }} />{" "}
                  Shop
                </div>
              </Link>
              <Link href={"/community?articleCategory=FREE"}>
                <div className="navLink-text">
                  <FiberManualRecordOutlinedIcon style={{ fontSize: "12px" }} />{" "}
                  Community
                </div>
              </Link>
              <Link href={"/cs"}>
                <div className="navLink-text">
                  <FiberManualRecordOutlinedIcon style={{ fontSize: "12px" }} />{" "}
                  CS
                </div>
              </Link>
            </Box>
          </Stack>
          <Box className={"enjoy-text"}>Enjoy Our Services!</Box>
        </Stack>
        <img className="union1" src="/img/icons/Footer-union.svg" alt="" />
        <img className="union2" src="/img/icons/Footer-union.png" alt="" />
      </Stack>
    </Stack>
  );
};

export default Footer;
