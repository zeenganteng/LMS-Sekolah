import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export const metadata = {
  title: "LMS Sekolah",
  description: "Learning Management System untuk sekolah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
