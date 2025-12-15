import { useState, useMemo } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import FeedbackRow from "./FeedbackRow";
import { FeedbackItem } from "../types";
import { cn } from "../lib/utils";

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
    {
        id: "5",
        feedbackSummary: "Slow loading times on analytics page",
        feedbackDetails:
            "The analytics dashboard takes over 5 seconds to load on 4G networks. We need to optimize the initial data fetch or implement skeleton loading states.",
        date: "Dec 09, 2023",
        status: "New",
    },
    {
        id: "6",
        feedbackSummary: "Typo in terms of service",
        feedbackDetails:
            "Section 4.2 has a spelling mistake. It says 'liablity' instead of 'liability'.",
        date: "Dec 08, 2023",
        status: "Reviewed",
    },
    {
        id: "7",
        feedbackSummary: "Request for calendar integration",
        feedbackDetails:
            "It would be great if we could sync the deadlines directly to Google Calendar.",
        date: "Dec 07, 2023",
        status: "Pending",
    },
    {
        id: "8",
        feedbackSummary: "Profile image upload fails",
        feedbackDetails:
            "Uploading a PNG larger than 2MB causes a silent failure. Needs a proper error message.",
        date: "Dec 06, 2023",
        status: "New",
    },
    {
        id: "9",
        feedbackSummary: "Confusion about pricing tiers",
        feedbackDetails:
            "The standard plan features are not clearly distinguished from the pro plan on the pricing page.",
        date: "Dec 05, 2023",
        status: "Reviewed",
    },
    {
        id: "10",
        feedbackSummary: "Export to CSV is broken",
        feedbackDetails:
            "Clicking the export button does nothing in Safari browser.",
        date: "Dec 04, 2023",
        status: "New",
    },
    {
        id: "11",
        feedbackSummary: "Add dark mode support",
        feedbackDetails: "Please add a toggle for dark mode in the settings.",
        date: "Dec 03, 2023",
        status: "New",
    },
    {
        id: "12",
        feedbackSummary: "Notification settings not saving",
        feedbackDetails:
            "I uncheck email notifications but they turn back on after refresh.",
        date: "Dec 02, 2023",
        status: "Pending",
    },
];

type FilterStatus = "All" | FeedbackItem["status"];

const ITEMS_PER_PAGE = 5;

export default function FeedbackList() {
    const [items, setItems] = useState<FeedbackItem[]>(MOCK_DATA);
    const [openId, setOpenId] = useState<string | null>(null);
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

    // UX State
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
    const [currentPage, setCurrentPage] = useState(1);

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

    // Filter Logic
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch =
                item.feedbackSummary
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                item.feedbackDetails
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            const matchesStatus =
                statusFilter === "All" || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [items, searchTerm, statusFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredItems.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredItems, currentPage]);

    // Reset pagination when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    return (
        <div className="space-y-6">
            {/* Controls Section */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
                {/* Search and Total Count */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search feedback..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                        Showing {filteredItems.length} results
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    <Filter className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                    {(["All", "New", "Pending", "Reviewed"] as const).map(
                        (status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                                    statusFilter === status
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                {status}
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3 min-h-[400px]">
                {paginatedItems.length > 0 ? (
                    paginatedItems.map((item) => (
                        <FeedbackRow
                            key={item.id}
                            feedback={item}
                            isOpen={openId === item.id}
                            isDeleting={deletingIds.has(item.id)}
                            onToggle={() => handleToggle(item.id)}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                        />
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
                        <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 font-medium mb-1">
                            No matching feedback
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Try adjusting your filters or search terms.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page <span className="font-medium">{currentPage}</span>{" "}
                        of <span className="font-medium">{totalPages}</span>
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>
            )}
        </div>
    );
}
