import type { Metadata } from "next";
import AnnouncementBar from "../components/storefront/announcement-bar";
import CartView from "../components/storefront/cart-view";
import SiteFooter from "../components/storefront/site-footer";
import SiteHeader from "../components/storefront/site-header";

export const metadata: Metadata = {
    title: "Shopping cart",
};

export default function CartPage() {
    return (
        <>
            <AnnouncementBar />
            <SiteHeader />
            <main>
                <CartView />
            </main>
            <SiteFooter />
        </>
    );
}
