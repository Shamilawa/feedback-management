import React, { useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    Pencil,
    Trash2,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    X,
    FileText,
    Bot,
} from "lucide-react";
import { toast } from "sonner";
import { FeedbackItem } from "../types";
import { cn } from "../lib/utils";
import EditFeedbackForm from "./EditFeedbackForm";

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
    isDeleting,
    onToggle,
    onDelete,
    onUpdate,
}: FeedbackRowProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const getStatusColor = (status: FeedbackItem["status"]) => {
        const normalized = status.toUpperCase();
        switch (normalized) {
            case "NEW":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "REVIEWED":
                return "bg-green-50 text-green-700 border-green-200";
            case "PENDING":
                return "bg-amber-50 text-amber-700 border-amber-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: FeedbackItem["status"]) => {
        const normalized = status.toUpperCase();
        switch (normalized) {
            case "NEW":
                return <AlertCircle className="w-3 h-3 mr-1" />;
            case "REVIEWED":
                return <CheckCircle2 className="w-3 h-3 mr-1" />;
            case "PENDING":
                return <Clock className="w-3 h-3 mr-1" />;
            default:
                return null;
        }
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        if (!isOpen) onToggle();
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };

    const confirmDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(feedback.sessionId);
    };

    const cancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteConfirm(false);
    };

    const handleSave = async (updates: Partial<FeedbackItem>) => {
        await onUpdate(feedback.sessionId, updates);
        setIsEditing(false);
        toast.success("Feedback updated correctly");
    };

    return (
        <div
            className={cn(
                "group bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-100",
                isDeleting && "opacity-0 scale-95 translate-x-4"
            )}
        >
            {/* Main Row Content */}
            <div
                onClick={onToggle}
                className={cn(
                    "p-4 cursor-pointer flex items-center justify-between gap-4 transition-colors",
                    isOpen ? "bg-gray-50/50" : "hover:bg-gray-50/30"
                )}
            >
                {/* Left Section: Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <span
                            className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors duration-300",
                                getStatusColor(feedback.status)
                            )}
                        >
                            {getStatusIcon(feedback.status)}
                            {feedback.status.toUpperCase()}
                        </span>
                        {feedback.date && (
                            <span className="text-xs text-gray-500 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {feedback.date}
                            </span>
                        )}
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 truncate mb-1 group-hover:text-indigo-600 transition-colors">
                        {feedback.workflowName}
                    </h3>
                    {/* Rationale Display */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                        <span className="font-medium text-gray-700">
                            Rationale:{" "}
                        </span>
                        {feedback.rationale}
                    </p>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center gap-3">
                    {/* ... (Delete confirm and buttons logic remains same) ... */}
                    {showDeleteConfirm ? (
                        <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                            <span className="text-sm text-red-600 font-medium hidden sm:inline">
                                Are you sure?
                            </span>
                            <button
                                onClick={confirmDelete}
                                className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                title="Confirm Delete"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                title="Cancel"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div
                            className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={handleEditClick}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Edit Feedback"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete Feedback"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className="pl-2 border-l border-gray-200 text-gray-400">
                        {isOpen ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            <div
                className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                )}
            >
                <div className="overflow-hidden">
                    {isEditing ? (
                        <EditFeedbackForm
                            feedback={feedback}
                            onSave={handleSave}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 text-sm text-gray-600 space-y-5">
                            {/* AI Analysis Section - Compact */}
                            {feedback.feedbackAttributes && (
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <Bot className="w-3.5 h-3.5" />
                                        AI Decision Logic
                                    </h4>

                                    {/* Vertical layout for Reason vs Attributes */}
                                    <div className="space-y-4">
                                        {/* Main Reason */}
                                        <div className="space-y-1.5">
                                            <span className="text-xs font-semibold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-block">
                                                Reasoning
                                            </span>
                                            <p className="text-gray-900 leading-relaxed font-medium">
                                                {
                                                    feedback.feedbackAttributes
                                                        .Reason
                                                }
                                            </p>
                                        </div>

                                        {/* Compact Attributes List */}
                                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                                            <div className="space-y-2">
                                                {Object.entries(
                                                    feedback.feedbackAttributes
                                                )
                                                    .filter(
                                                        ([key]) =>
                                                            key !== "Reason" &&
                                                            key !==
                                                                "feedback_request_reason"
                                                    ) // Filter out redundant keys if any
                                                    .map(([key, value]) => (
                                                        <div
                                                            key={key}
                                                            className="flex items-center justify-between gap-2 text-xs border-b border-gray-50 last:border-0 pb-2 last:pb-0"
                                                        >
                                                            <span className="text-gray-500 font-medium truncate">
                                                                {key}
                                                            </span>
                                                            <span className="font-medium text-gray-900 text-right">
                                                                {typeof value ===
                                                                "boolean" ? (
                                                                    <span
                                                                        className={cn(
                                                                            "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide",
                                                                            value
                                                                                ? "bg-green-100 text-green-700"
                                                                                : "bg-gray-100 text-gray-500"
                                                                        )}
                                                                    >
                                                                        {value
                                                                            ? "Yes"
                                                                            : "No"}
                                                                    </span>
                                                                ) : (
                                                                    <span
                                                                        className="truncate max-w-[300px] inline-block align-bottom"
                                                                        title={String(
                                                                            value
                                                                        )}
                                                                    >
                                                                        {String(
                                                                            value
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Separator */}
                            <div className="border-t border-gray-200" />

                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Detailed Feedback Message
                                </h4>
                                <p className="leading-relaxed whitespace-pre-wrap text-gray-800">
                                    {feedback.feedbackMessage ||
                                        "No detailed feedback provided."}
                                </p>
                            </div>

                            {feedback.feedbackFile && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Attachments
                                    </h4>
                                    <a
                                        href={`data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${feedback.feedbackFile}`}
                                        download={`feedback-${feedback.sessionId}.xlsx`}
                                        className="inline-flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-all group/file"
                                    >
                                        <FileText className="w-4 h-4 text-gray-400 group-hover/file:text-indigo-500" />
                                        <span className="font-medium text-xs">
                                            Download Excel Report
                                        </span>
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
