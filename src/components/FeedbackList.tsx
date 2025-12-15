import { useState, useMemo } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import FeedbackRow from "./FeedbackRow";
import { FeedbackItem } from "../types";
import { cn } from "../lib/utils";

const MOCK_DATA: FeedbackItem[] = [
    {
        sessionId: "59bacfd4-52cf-4980-8c73-703697dc62ba",
        workflowName: "Ticket Resolution",
        rationale:
            "The request is a general greeting without a specific task or category.",
        feedbackAttributes: {
            Reason: "The request is a general greeting and doesn't specify a particular category or priority.",
            unknown_word: false,
            user_request: "Hi how are you",
            call_external: true,
            unknown_category: true,
            unknown_priority: true,
            available_memories:
                "Greetings, general inquiries, conversational responses.",
            feedback_request_reason:
                "The request is a general greeting without a specific task or category.",
        },
        status: "PENDING",
        feedbackMessage: null,
        feedbackData: null,
        date: "Dec 14, 2023",
    },
    {
        sessionId: "2",
        workflowName: "Dashboard Analytics",
        rationale: "Contrast issues observed in dark mode environment.",
        status: "Pending",
        feedbackMessage:
            "Some of the charts are hard to read in dark mode, specifically the blue line on the black background.",
        feedbackData: null,
        date: "Dec 13, 2023",
    },
    {
        sessionId: "3",
        workflowName: "Report Export",
        rationale: "Efficiency bottleneck in generating monthly reports.",
        status: "Reviewed",
        feedbackMessage:
            "We need a way to export all monthly reports at once instead of one by one.",
        feedbackData: "mock-url",
        date: "Dec 12, 2023",
    },
    {
        sessionId: "4",
        workflowName: "Mobile Navigation",
        rationale: "UI overlap issue on newer iPhone models.",
        status: "New",
        feedbackMessage:
            "On iPhone 14 Pro, the navigation menu overlaps with the dynamic island.",
        feedbackData: null,
        date: "Dec 10, 2023",
    },
    {
        sessionId: "5",
        workflowName: "Analytics Performance",
        rationale: "Page load speed below acceptable threshold.",
        status: "New",
        feedbackMessage:
            "The analytics dashboard takes over 5 seconds to load on 4G networks.",
        feedbackData: null,
        date: "Dec 09, 2023",
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
            setItems(items.filter((item) => item.sessionId !== id));
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
                item.sessionId === id ? { ...item, ...updates } : item
            )
        );
    };

    // Filter Logic
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch =
                item.workflowName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                item.rationale.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus =
                statusFilter === "All" ||
                item.status.toUpperCase() === statusFilter.toUpperCase();
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
                            placeholder="Search workflow or rationale..."
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
                    {(["All", "NEW", "PENDING", "REVIEWED"] as const).map(
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
                            key={item.sessionId}
                            feedback={item}
                            isOpen={openId === item.sessionId}
                            isDeleting={deletingIds.has(item.sessionId)}
                            onToggle={() => handleToggle(item.sessionId)}
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
