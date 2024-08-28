import localFont from "next/font/local";

const proximaNova = localFont({
  src: [
    {
      path: "../src/assets/fonts/proximanova/ProximaNovaT-Thin.ttf",
      weight: "100",
      style: "font-thin",
    },
    {
      path: "../src/assets/fonts/proximanova/ProximaNova-Light.ttf",
      weight: "300",
      style: "Light",
    },
    {
      path: "../src/assets/fonts/proximanova/ProximaNova-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../src/assets/fonts/proximanova/ProximaNova-Regular.ttf",
      weight: "500",
      style: "medium",
    },
    {
      path: "../src/assets/fonts/proximanova/ProximaNova-Semibold.ttf",
      weight: "600",
      style: "Semibold",
    },
    {
      path: "../src/assets/fonts/proximanova/ProximaNova-Bold.ttf",
      weight: "700",
      style: "Bold",
    },
    {
      path: "../src/assets/fonts/proximanova/ProximaNova-Extrabld.ttf",
      weight: "800",
      style: "Extrabld",
    },
  ],
  variable: "--font-proximanova",
});

export { proximaNova };
