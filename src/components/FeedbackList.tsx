import { useState } from "react";
import FeedbackRow from "./FeedbackRow";
import { FeedbackItem } from "../types";

const MOCK_DATA: FeedbackItem[] = [
    {
        id: "1",
        feedbackSummary: "Login process is confusing for new users",
        feedbackDetails:
            "The current login flow redirects too many times. Users are getting lost between SSO and email login. We should simplify the initial screen to only show one primary option based on their domain.",
        date: "Dec 14, 2023",
        status: "New",
        attachmentUrl: "mock-url",
    },
    {
        id: "2",
        feedbackSummary: "Dark mode contrast issues on dashboard",
        feedbackDetails:
            "Some of the charts are hard to read in dark mode, specifically the blue line on the black background. The contrast ratio needs to be improved for accessibility compliance.",
        date: "Dec 13, 2023",
        status: "Pending",
    },
    {
        id: "3",
        feedbackSummary: "Feature request: Bulk export for reports",
        feedbackDetails:
            "We need a way to export all monthly reports at once instead of one by one. This is a major pain point for our finance team at the end of the month.",
        date: "Dec 12, 2023",
        status: "Reviewed",
    },
    {
        id: "4",
        feedbackSummary: "Mobile navigation menu glitch",
        feedbackDetails:
            "On iPhone 14 Pro, the navigation menu overlaps with the dynamic island when scrolled to the top. Needs padding adjustment.",
        date: "Dec 10, 2023",
        status: "New",
    },
];

export default function FeedbackList() {
    const [items, setItems] = useState<FeedbackItem[]>(MOCK_DATA);
    const [openId, setOpenId] = useState<string | null>(null);
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

    const handleToggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    const handleDelete = (id: string) => {
        // Trigger exit animation
        setDeletingIds((prev) => new Set(prev).add(id));

        // Wait for animation to finish before actual removal
        setTimeout(() => {
            setItems(items.filter((item) => item.id !== id));
            setDeletingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
            if (openId === id) setOpenId(null);
        }, 300); // Matches the duration-300 class
    };

    const handleUpdate = async (id: string, updates: Partial<FeedbackItem>) => {
        // Simulate API delay for better UX feel
        await new Promise((resolve) => setTimeout(resolve, 500));

        setItems(
            items.map((item) =>
                item.id === id ? { ...item, ...updates } : item
            )
        );
    };

    return (
        <div className="space-y-4">
            {/* Header/Filter Bar (Visual only for now) */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        All Feedback
                    </h2>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                        {items.length}
                    </span>
                </div>
                <div className="flex gap-2">
                    {/* Placeholder for potential filters */}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {items.map((item) => (
                    <FeedbackRow
                        key={item.id}
                        feedback={item}
                        isOpen={openId === item.id}
                        isDeleting={deletingIds.has(item.id)}
                        onToggle={() => handleToggle(item.id)}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                    />
                ))}

                {items.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                        <p className="text-gray-500">
                            No feedback items found.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
