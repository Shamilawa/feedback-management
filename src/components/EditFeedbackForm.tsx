import React, { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { FeedbackItem } from "../types";
import { cn } from "../lib/utils";

interface EditFeedbackFormProps {
    feedback: FeedbackItem;
    onSave: (updatedFeedback: Partial<FeedbackItem>) => void;
    onCancel: () => void;
}

export default function EditFeedbackForm({
    feedback,
    onSave,
    onCancel,
}: EditFeedbackFormProps) {
    const [content, setContent] = useState(feedback.feedbackMessage || "");
    const [file, setFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setError("Only Excel files (.xls, .xlsx) are allowed.");
            return false;
        }
        setError(null);
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
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let base64File = feedback.feedbackFile;

        if (file) {
            try {
                base64File = await convertToBase64(file);
            } catch (err) {
                console.error("Error converting file to base64", err);
                setError("Error processing file. Please try again.");
                return;
            }
        }

        onSave({
            feedbackMessage: content,
            feedbackFile: base64File,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 bg-gray-50/50 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200"
        >
            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="feedback-content"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Feedback Content
                    </label>
                    <textarea
                        id="feedback-content"
                        rows={4}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border resize-none transition-shadow"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Detailed feedback content..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Attachments
                    </label>
                    <div
                        className={cn(
                            "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
                            isDragOver
                                ? "border-indigo-500 bg-indigo-50/50"
                                : "border-gray-300 hover:bg-gray-50",
                            error ? "border-red-300 bg-red-50/50" : ""
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() =>
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
                            ) : (
                                <>
                                    <Upload
                                        className={cn(
                                            "mx-auto h-12 w-12",
                                            error
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
                                                Upload Excel file
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
                                    {error && (
                                        <p className="text-xs text-red-600 font-medium mt-2">
                                            {error}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </form>
    );
}
