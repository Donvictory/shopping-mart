import type { Metadata } from "next";
import AnnouncementBar from "../components/storefront/announcement-bar";
import FavouritesView from "../components/storefront/favourites-view";
import SiteFooter from "../components/storefront/site-footer";
import SiteHeader from "../components/storefront/site-header";

export const metadata: Metadata = {
    title: "Favourites",
    description: "The Little Orbit pieces you've saved for later.",
};

export default function FavouritesPage() {
    return (
        <>
            <AnnouncementBar />
            <SiteHeader />
            <main>
                <FavouritesView />
            </main>
            <SiteFooter />
        </>
    );
}
