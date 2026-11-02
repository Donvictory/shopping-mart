import { statusLabels, statusStyles } from "../_lib/orders";
import type { OrderStatus } from "../_lib/orders";

export default function StatusBadge({ status }: { status: OrderStatus }) {
    return (
        <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}>
            {statusLabels[status]}
        </span>
    );
}
