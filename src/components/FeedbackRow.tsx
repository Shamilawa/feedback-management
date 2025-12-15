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
} from "lucide-react";
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
    const [isSuccess, setIsSuccess] = useState(false);

    const getStatusColor = (status: FeedbackItem["status"]) => {
        switch (status) {
            case "New":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "Reviewed":
                return "bg-green-50 text-green-700 border-green-200";
            case "Pending":
                return "bg-amber-50 text-amber-700 border-amber-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const getStatusIcon = (status: FeedbackItem["status"]) => {
        switch (status) {
            case "New":
                return <AlertCircle className="w-3 h-3 mr-1" />;
            case "Reviewed":
                return <CheckCircle2 className="w-3 h-3 mr-1" />;
            case "Pending":
                return <Clock className="w-3 h-3 mr-1" />;
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
        onDelete(feedback.id);
    };

    const cancelDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteConfirm(false);
    };

    const handleSave = async (updates: Partial<FeedbackItem>) => {
        await onUpdate(feedback.id, updates);
        setIsEditing(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2000); // Reset success after 2s
    };

    return (
        <div
            className={cn(
                "group bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300",
                isDeleting && "opacity-0 scale-95 translate-x-4",
                isSuccess &&
                    "ring-2 ring-green-500 border-green-500 bg-green-50/10"
            )}
        >
            {/* Main Row Content */}
            <div
                onClick={onToggle}
                className={cn(
                    "p-4 cursor-pointer flex items-center justify-between gap-4 transition-colors",
                    isOpen ? "bg-gray-50/50" : "hover:bg-gray-50/30",
                    isSuccess && "bg-green-50/30"
                )}
            >
                {/* Left Section: Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <span
                            className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors duration-300",
                                isSuccess
                                    ? "bg-green-100 text-green-800 border-green-300"
                                    : getStatusColor(feedback.status)
                            )}
                        >
                            {isSuccess ? (
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                            ) : (
                                getStatusIcon(feedback.status)
                            )}
                            {isSuccess ? "Updated" : feedback.status}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {feedback.date}
                        </span>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 truncate mb-1 group-hover:text-indigo-600 transition-colors">
                        {feedback.feedbackSummary}
                    </h3>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center gap-3">
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
                        <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-sm text-gray-600 space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Detailed Feedback
                                </h4>
                                <p className="leading-relaxed whitespace-pre-wrap">
                                    {feedback.feedbackDetails}
                                </p>
                            </div>

                            {feedback.attachmentUrl && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                        Attachments
                                    </h4>
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-all group/file"
                                    >
                                        <FileText className="w-4 h-4 text-gray-400 group-hover/file:text-indigo-500" />
                                        <span className="font-medium">
                                            Attached Document
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
