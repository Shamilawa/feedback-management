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
    id: string;
    sessionId: string;
    workflowName: string;
    feedbackRequestReason?: string; // New top-level field
    rationale: string | null;
    status: string; // "PENDING", "COMPLETED", etc.
    feedbackMessage: string | null;
    feedbackAttributes?: {
        tags?: string[];
        feedback_request_reason?: string;
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
