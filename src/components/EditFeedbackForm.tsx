import React, { useState } from "react";
import { Upload, FileText, Loader2, AlignLeft } from "lucide-react";
import { FeedbackItem } from "../types";
import { cn } from "../lib/utils";
import { toast } from "sonner";

interface EditFeedbackFormProps {
    feedback: FeedbackItem;
    onSave: (updatedFeedback: Partial<FeedbackItem>) => Promise<void> | void;
    onCancel: () => void;
}

export default function EditFeedbackForm({
    feedback,
    onSave,
    onCancel,
}: EditFeedbackFormProps) {
    const [feedbackMessage, setFeedbackMessage] = useState(
        feedback.feedbackMessage || ""
    );
    const [rationale, setRationale] = useState(feedback.rationale || "");
    const [metadata, setMetadata] = useState(
        feedback.metadata ? JSON.stringify(feedback.metadata, null, 2) : ""
    );
    const [providedBy, setProvidedBy] = useState(feedback.providedBy || "");

    const [file, setFile] = useState<File | null>(null);
    const [existingFile, setExistingFile] = useState(!!feedback.file);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

    const validateFile = (file: File): boolean => {
        // Check for Excel mime types or extension
        const validTypes = [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        const fileName = file.name.toLowerCase();
        const validExtension =
            fileName.endsWith(".xls") || fileName.endsWith(".xlsx");

        if (!validTypes.includes(file.type) && !validExtension) {
            setErrors((prev) => ({
                ...prev,
                file: "Only Excel files (.xls, .xlsx) are allowed.",
            }));
            return false;
        }
        setErrors((prev) => ({ ...prev, file: null }));
        return true;
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
                setExistingFile(false); // Replace existing file
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
                setExistingFile(false); // Replace existing file
            } else {
                e.target.value = ""; // Reset input
            }
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // Remove data:application/...,base64, prefix to get raw base64
                const base64 = result.split(",")[1];
                resolve(base64);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const validateJSON = (value: string): boolean => {
        try {
            JSON.parse(value);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { [key: string]: string | null } = {};
        let isValid = true;

        if (!feedbackMessage.trim()) {
            newErrors.feedbackMessage = "Feedback content is required.";
            isValid = false;
        }

        if (metadata.trim() && !validateJSON(metadata)) {
            newErrors.metadata = "Invalid JSON format.";
            isValid = false;
        }

        if (errors.file) {
            isValid = false;
        }

        if (!isValid) {
            setErrors((prev) => ({ ...prev, ...newErrors }));
            toast.error("Please fix form errors.");
            return;
        }

        // Clear previous errors if valid
        setErrors({});

        // Determine the final file value
        let base64File: string | null = null;
        if (file) {
            try {
                base64File = await convertToBase64(file);
            } catch (err) {
                console.error("Error converting file to base64", err);
                toast.error("Error processing file");
                return;
            }
        } else if (existingFile) {
            base64File = feedback.file;
        }

        let parsedMetadata = null;
        if (metadata) {
            try {
                parsedMetadata = JSON.parse(metadata);
            } catch (e) {
                console.error("Error parsing metadata", e);
            }
        }

        try {
            setIsSaving(true);
            await onSave({
                feedbackMessage: feedbackMessage,
                rationale: rationale,
                metadata: parsedMetadata,
                providedBy: providedBy,
                file: base64File,
            });
        } catch (error) {
            console.error("Error saving feedback:", error);
            // Toast handling is likely done in parent, but strictly speaking we ensure we stop loading here
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 bg-gray-50/50 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200"
        >
            <div className="space-y-6">
                {/* Request Reason (Read-only) */}
                {feedback.feedbackRequestReason && (
                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-2">
                        <div className="flex items-center gap-2 mb-2">
                            <AlignLeft className="w-4 h-4 text-blue-900" />
                            <h3 className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
                                Request Reason
                            </h3>
                        </div>
                        <div className="max-h-32 overflow-y-auto custom-scrollbar pr-2">
                            <p className="text-sm text-blue-950 font-medium leading-relaxed">
                                {feedback.feedbackRequestReason}
                            </p>
                        </div>
                    </div>
                )}

                {/* Feedback Content */}
                <div>
                    <label
                        htmlFor="feedback-content"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Feedback <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="feedback-content"
                        rows={4}
                        className={cn(
                            "w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border resize-none transition-shadow",
                            errors.feedbackMessage &&
                                "border-red-300 focus:border-red-500 focus:ring-red-500"
                        )}
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        placeholder="Detailed feedback content..."
                    />
                    {errors.feedbackMessage && (
                        <p className="text-xs text-red-600 font-medium mt-1">
                            {errors.feedbackMessage}
                        </p>
                    )}
                </div>

                {/* Attachments */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Attachments
                    </label>
                    <div
                        className={cn(
                            "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
                            isDragOver
                                ? "border-indigo-500 bg-indigo-50/50"
                                : "border-gray-300 hover:bg-gray-50",
                            errors.file ? "border-red-300 bg-red-50/50" : ""
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() =>
                            !file &&
                            !existingFile &&
                            document.getElementById("file-upload")?.click()
                        }
                    >
                        <div className="space-y-1 text-center">
                            {file ? (
                                <div className="flex items-center justify-center gap-2 text-indigo-600">
                                    <FileText className="h-8 w-8" />
                                    <div className="text-left">
                                        <div className="text-sm font-medium">
                                            {file.name}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                            }}
                                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : existingFile ? (
                                <div className="flex items-center justify-center gap-2 text-indigo-600">
                                    <FileText className="h-8 w-8" />
                                    <div className="text-left">
                                        <div className="text-sm font-medium">
                                            Existing Excel File
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExistingFile(false);
                                            }}
                                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Upload
                                        className={cn(
                                            "mx-auto h-12 w-12",
                                            errors.file
                                                ? "text-red-400"
                                                : "text-gray-400"
                                        )}
                                    />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                        >
                                            <span className="p-1">
                                                Upload file
                                            </span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                accept=".xls,.xlsx"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        XLS or XLSX only
                                    </p>
                                    {errors.file && (
                                        <p className="text-xs text-red-600 font-medium mt-2">
                                            {errors.file}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Rationale */}
                <div>
                    <label
                        htmlFor="rationale"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Rationale
                    </label>
                    <textarea
                        id="rationale"
                        rows={3}
                        className={cn(
                            "w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border resize-none transition-shadow",
                            errors.rationale &&
                                "border-red-300 focus:border-red-500 focus:ring-red-500"
                        )}
                        value={rationale}
                        onChange={(e) => setRationale(e.target.value)}
                        placeholder="Explain the reasoning behind this feedback..."
                    />
                    {errors.rationale && (
                        <p className="text-xs text-red-600 font-medium mt-1">
                            {errors.rationale}
                        </p>
                    )}
                </div>

                {/* Metadata */}
                <div>
                    <label
                        htmlFor="metadata"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Applicable Criteria/Tags (JSON)
                    </label>
                    <textarea
                        id="metadata"
                        rows={4}
                        className={cn(
                            "w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border resize-none transition-shadow font-mono",
                            errors.metadata &&
                                "border-red-300 focus:border-red-500 focus:ring-red-500"
                        )}
                        value={metadata}
                        onChange={(e) => setMetadata(e.target.value)}
                        placeholder='{"key": "value"}'
                    />
                    {errors.metadata && (
                        <p className="text-xs text-red-600 font-medium mt-1">
                            {errors.metadata}
                        </p>
                    )}
                </div>

                {/* Provided By */}
                <div>
                    <label
                        htmlFor="provided-by"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Provided By
                    </label>
                    <input
                        id="provided-by"
                        type="text"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border transition-shadow"
                        value={providedBy}
                        onChange={(e) => setProvidedBy(e.target.value)}
                        placeholder="John Doe"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
