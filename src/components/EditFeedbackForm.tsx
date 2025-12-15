import React, { useState } from "react";
import { Upload, X, FileText } from "lucide-react";
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
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate upload and save
        onSave({
            feedbackMessage: content,
            feedbackData: file
                ? URL.createObjectURL(file)
                : feedback.feedbackData,
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
                            "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg transition-colors cursor-pointer hover:bg-gray-50",
                            isDragOver && "border-indigo-500 bg-indigo-50/50"
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
                                    <span className="text-sm font-medium">
                                        {file.name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}
                                        className="p-1 hover:bg-indigo-100 rounded-full"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                        >
                                            <span className="p-1">
                                                Upload a file
                                            </span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, PDF up to 10MB
                                    </p>
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
