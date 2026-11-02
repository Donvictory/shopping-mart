import SiteHeader from "./components/storefront/site-header";
import HeroSection from "./components/storefront/hero-section";
import ProductSection from "./components/storefront/product-section";
import PromiseStrip from "./components/storefront/promise-strip";
import SiteFooter from "./components/storefront/site-footer";
import BrandStory from "./components/storefront/brand-story";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <HeroSection />
      <PromiseStrip />
      <ProductSection limit={8} />
      <BrandStory />
      <SiteFooter />
    </main>
  );
}