import "./globals.css";
import { proximaNova } from "../../utils/customFonts";
import ClientProvider from "./ClientProvider";

export const metadata = {
  title: "TechTracker",
  description: "Generated by @S-ali007",
  icons: "/stop-watch/stop-watch.png",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${proximaNova.className} w-full flex  `}
      >
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
