import { useState, useMemo, useEffect } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
} from "lucide-react";
import FeedbackRow from "./FeedbackRow";
import { FeedbackItem } from "../types";
import { cn } from "../lib/utils";

// Removed MOCK_DATA in favor of real backend data

// Removed MOCK_DATA in favor of real backend data

export default function FeedbackList() {
    const [items, setItems] = useState<FeedbackItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [openId, setOpenId] = useState<string | null>(null);
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(import.meta.env.VITE_API_URL);
                if (!response.ok) {
                    throw new Error("Failed to fetch feedback data");
                }
                const result = await response.json();
                setItems(result.data || []);
                setError(null);
            } catch (err) {
                console.error("Error fetching feedback:", err);
                setError(
                    "Failed to load feedback data. Please try again later."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeedback();
    }, []);

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
                (item.rationale &&
                    item.rationale
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()));
            const matchesStatus =
                statusFilter === "ALL" ||
                item.status.toUpperCase() === statusFilter.toUpperCase();
            return matchesSearch && matchesStatus;
        });
    }, [items, searchTerm, statusFilter]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredItems.slice(start, start + itemsPerPage);
    }, [filteredItems, currentPage, itemsPerPage]);

    // Reset pagination when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // --- UI: Loading State ---
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
                <p className="text-sm font-medium">Loading feedback...</p>
            </div>
        );
    }

    // --- UI: Error State ---
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
                <AlertCircle className="w-10 h-10 mb-4" />
                <p className="text-lg font-medium mb-2">Something went wrong</p>
                <p className="text-sm text-gray-500">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-full mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
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
                    {/* Status Filter */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {["ALL", "PENDING", "COMPLETED"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-md transition-all",
                                    statusFilter === status
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                                )}
                            >
                                {status.charAt(0) +
                                    status.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table View */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[40%] min-w-[250px]"
                                >
                                    Request Reason
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Applicable Criteria/Tags
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Attachments
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-16"
                                >
                                    Edit
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-16"
                                >
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedItems.length > 0 ? (
                                paginatedItems.map((item) => (
                                    <FeedbackRow
                                        key={item.sessionId}
                                        feedback={item}
                                        isOpen={openId === item.sessionId}
                                        isDeleting={deletingIds.has(
                                            item.sessionId
                                        )}
                                        onToggle={() =>
                                            handleToggle(item.sessionId)
                                        }
                                        onDelete={handleDelete}
                                        onUpdate={handleUpdate}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                                <Search className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <h3 className="text-gray-900 font-medium mb-1">
                                                No matching feedback
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                Try adjusting your filters or
                                                search terms.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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
