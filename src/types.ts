export interface FeedbackItem {
    id: string;
    feedbackSummary: string; // Shown in collapsed view
    feedbackDetails: string; // Shown in expanded view
    date: string;
    status: "New" | "Reviewed" | "Pending";
    attachmentUrl?: string;
}
