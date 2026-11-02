import type { Metadata } from "next";
import ProductSection from "../components/storefront/product-section";
import SiteFooter from "../components/storefront/site-footer";
import SiteHeader from "../components/storefront/site-header";

export const metadata: Metadata = {
    title: "Shop all",
    description: "Browse every Little Orbit piece for children and teenagers.",
};

export default function AllProductsPage() {
    return (
        <>
            <SiteHeader />
            <main>
                <ProductSection isPageHeading />
            </main>
            <SiteFooter />
        </>
    );
}
