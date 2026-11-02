import { redirect } from "next/navigation";

// Checkout now lives on the cart page, beside the order summary.
export default function CheckoutPage() {
    redirect("/cart");
}
