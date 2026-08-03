import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import IntroLoader from "@/components/public/IntroLoader";
import AntiTheft from "@/components/public/AntiTheft";

export default function PublicLayout({ children }) {
  return (
    <div className="public-site">
      <IntroLoader />
      <AntiTheft />
      <Header />
      <main className="public-content">{children}</main>
      <Footer />
    </div>
  );
}
