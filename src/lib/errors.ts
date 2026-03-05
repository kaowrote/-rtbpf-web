export type ErrorCode =
    | "VALIDATION_ERROR"
    | "BAD_REQUEST"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "UNPROCESSABLE"
    | "RATE_LIMITED"
    | "INTERNAL_ERROR"
    | "SERVICE_UNAVAILABLE";

interface ErrorDetail {
    field?: string;
    message: string;
}

export class AppError extends Error {
    public code: ErrorCode;
    public details?: ErrorDetail[];
    public statusCode: number;

    constructor({
        message,
        code,
        statusCode,
        details,
    }: {
        message: string;
        code: ErrorCode;
        statusCode: number;
        details?: ErrorDetail[];
    }) {
        super(message);
        this.name = "AppError";
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
    }
}
