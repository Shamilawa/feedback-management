export interface FeedbackAttributes {
    Reason: string;
    unknown_word?: boolean;
    user_request?: string;
    call_external?: boolean;
    unknown_category?: boolean;
    unknown_priority?: boolean;
    available_memories?: string;
    feedback_request_reason?: string;
}

export interface FeedbackItem {
    sessionId: string;
    workflowName: string;
    rationale: string;
    feedbackAttributes?: FeedbackAttributes;
    status: "PENDING" | "REVIEWED" | "NEW" | "Pending" | "Reviewed" | "New";
    feedbackMessage: string | null;
    feedbackData: string | null;
    feedbackFile: string | null;
    date?: string;
}
