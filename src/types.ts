export interface FeedbackAttributes {
    [key: string]: any;
}

export interface FeedbackItem {
    id: string;
    sessionId: string;
    workflowName: string;
    feedbackRequestReason?: string; // New top-level field
    rationale: string | null;
    status: string; // "PENDING", "COMPLETED", etc.
    feedbackMessage: string | null;
    feedbackAttributes?: {
        [key: string]: any;
    };
    feedbackData?: {
        rating?: number;
        category?: string;
        [key: string]: any;
    };
    file: string | null;
    metadata?: any; // New field
    providedBy?: string; // New field
    date?: string;
}
