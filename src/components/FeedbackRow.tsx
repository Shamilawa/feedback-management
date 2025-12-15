import React, { useState } from "react";
import {
    Pencil,
    Trash2,
    FileText,
    AlignLeft,
    MessageSquare,
    Lightbulb,
    GitFork,
    Tags,
} from "lucide-react";
import { toast } from "sonner";
import { FeedbackItem } from "../types";
import { cn } from "../lib/utils";
import EditFeedbackForm from "./EditFeedbackForm";
import Modal from "./Modal";

interface FeedbackRowProps {
    feedback: FeedbackItem;
    isOpen: boolean;
    isDeleting?: boolean;
    onToggle: () => void;
    onDelete: (id: string) => void;
    onUpdate: (
        id: string,
        updates: Partial<FeedbackItem>
    ) => Promise<void> | void;
}

export default function FeedbackRow({
    feedback,
    isOpen,
    onToggle,
    isDeleting,
    onDelete,
    onUpdate,
}: FeedbackRowProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };

    const confirmDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(feedback.id);
        setShowDeleteConfirm(false);
    };

    const cancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteConfirm(false);
    };

    const handleSave = async (updates: Partial<FeedbackItem>) => {
        try {
            await onUpdate(feedback.id, updates);
            setIsEditModalOpen(false);
            toast.success("Feedback updated correctly");
        } catch (error) {
            console.error("Failed to update feedback:", error);
            toast.error("Failed to update feedback. Please try again.");
        }
    };

    return (
        <React.Fragment>
            {/* Main Row Content */}
            <tr
                onClick={onToggle}
                className={cn(
                    "group cursor-pointer hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0",
                    isOpen && "bg-gray-50",
                    isDeleting && "opacity-0 scale-95"
                )}
            >
                {/* 1. Request Reason */}
                <td className="px-6 py-4 align-top py-5">
                    <div className="flex gap-3">
                        <div
                            className={cn(
                                "shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 transition-transform duration-200",
                                isOpen && "rotate-180 text-gray-900"
                            )}
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-900 font-medium mb-1 line-clamp-2">
                                {feedback.feedbackRequestReason ||
                                    feedback.workflowName}
                            </p>
                        </div>
                    </div>
                </td>

                {/* 2. Status */}
                <td className="px-6 py-4 align-top py-5">
                    <span
                        className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                            feedback.status.toUpperCase() === "COMPLETED"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : feedback.status.toUpperCase() === "PENDING"
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                        )}
                    >
                        {feedback.status.charAt(0).toUpperCase() +
                            feedback.status.slice(1).toLowerCase()}
                    </span>
                </td>

                {/* 3. Attachments */}
                <td className="px-6 py-4 align-top py-5">
                    {feedback.file ? (
                        <a
                            href={`data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${feedback.file}`}
                            download={`feedback-${feedback.sessionId}.xlsx`}
                            className="flex items-center gap-2 max-w-[140px] text-gray-500 hover:text-indigo-600 transition-colors group/file text-left"
                            title="Download Excel Report"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-600 group-hover/file:bg-indigo-50 group-hover/file:text-indigo-600 transition-colors">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-xs font-medium truncate w-full">
                                    feedback-{feedback.sessionId.slice(0, 8)}
                                    .xlsx
                                </span>
                                <span className="text-[10px] text-gray-400 group-hover/file:text-indigo-500">
                                    Click to download
                                </span>
                            </div>
                        </a>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 bg-gray-50 rounded-md border border-gray-100 cursor-not-allowed select-none">
                            <span className="text-xs font-medium">None</span>
                        </span>
                    )}
                </td>

                {/* 4. Edit */}
                <td className="px-6 py-4 align-top text-center w-16 py-5">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (feedback.status.toUpperCase() !== "COMPLETED") {
                                setIsEditModalOpen(true);
                            }
                        }}
                        disabled={feedback.status.toUpperCase() === "COMPLETED"}
                        className={cn(
                            "p-2 rounded-lg transition-all",
                            feedback.status.toUpperCase() === "COMPLETED"
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                        )}
                        title={
                            feedback.status.toUpperCase() === "COMPLETED"
                                ? "Feedback Completed"
                                : "Provide Feedback"
                        }
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                </td>

                {/* 5. Delete */}
                <td className="px-6 py-4 align-top text-center w-16 py-5">
                    <button
                        onClick={handleDeleteClick}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Feedback"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </td>
            </tr>

            {/* Expanded Content Row */}
            {isOpen && (
                <tr className="bg-gray-50/25">
                    <td
                        colSpan={5}
                        className="px-8 py-0 border-b border-gray-200"
                    >
                        <div className="py-8 space-y-8 animate-in slide-in-from-top-1 duration-200">
                            {/* Full Request Reason */}
                            <section>
                                <div className="flex items-center gap-2 mb-3 text-gray-500">
                                    <AlignLeft className="w-4 h-4" />
                                    <h4 className="text-xs font-semibold uppercase tracking-wider">
                                        Full Request Reason
                                    </h4>
                                </div>
                                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                                    <p className="text-sm text-gray-900 font-medium leading-relaxed">
                                        {feedback.feedbackRequestReason ||
                                            feedback.workflowName}
                                    </p>
                                </div>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Feedback Provided */}
                                <section className="flex flex-col h-full">
                                    <div className="flex items-center gap-2 mb-3 text-gray-500">
                                        <MessageSquare className="w-4 h-4" />
                                        <h4 className="text-xs font-semibold uppercase tracking-wider">
                                            Feedback Provided
                                        </h4>
                                    </div>
                                    <div className="bg-white p-4 border border-gray-200 rounded-lg flex-1">
                                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                            {feedback.feedbackMessage || (
                                                <span className="text-gray-400 italic">
                                                    No feedback message
                                                    provided.
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </section>

                                {/* Rationale */}
                                <section className="flex flex-col h-full">
                                    <div className="flex items-center gap-2 mb-3 text-gray-500">
                                        <Lightbulb className="w-4 h-4" />
                                        <h4 className="text-xs font-semibold uppercase tracking-wider">
                                            Justification / Rationale
                                        </h4>
                                    </div>
                                    <div className="bg-white p-4 border border-gray-200 rounded-lg flex-1">
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {feedback.rationale || (
                                                <span className="text-gray-400 italic">
                                                    No rationale provided.
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </section>
                            </div>

                            {/* Additional Info: Workflow & Tags */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-200">
                                {/* Workflow Name */}
                                <section>
                                    <div className="flex items-center gap-2 mb-3 text-gray-500">
                                        <GitFork className="w-4 h-4" />
                                        <h4 className="text-xs font-semibold uppercase tracking-wider">
                                            Workflow
                                        </h4>
                                    </div>
                                    <div className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-200">
                                        {feedback.workflowName}
                                    </div>
                                </section>

                                {/* Tags */}
                                <section>
                                    <div className="flex items-center gap-2 mb-3 text-gray-500">
                                        <Tags className="w-4 h-4" />
                                        <h4 className="text-xs font-semibold uppercase tracking-wider">
                                            Applicable Criteria/Tags
                                        </h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {feedback.metadata &&
                                        Object.keys(feedback.metadata).length >
                                            0 ? (
                                            Object.entries(
                                                feedback.metadata
                                            ).map(([key, value]) => (
                                                <span
                                                    key={key}
                                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                                                >
                                                    <span className="font-semibold mr-1">
                                                        {key}:
                                                    </span>
                                                    {String(value)}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">
                                                No metadata associated
                                            </span>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </td>
                </tr>
            )}

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Provide Feedback"
            >
                <EditFeedbackForm
                    feedback={feedback}
                    onSave={handleSave}
                    onCancel={() => setIsEditModalOpen(false)}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Confirm Deletion"
                className="max-w-md"
            >
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-6">
                        Are you sure you want to delete this feedback item? This
                        action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={cancelDelete}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    );
}
