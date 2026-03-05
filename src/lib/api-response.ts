import { NextResponse } from "next/server";
import { AppError, ErrorCode } from "./errors";
import { ZodError } from "zod";

type SuccessResponse<T> = {
    success: true;
    data: T;
    meta?: Record<string, any>;
};

type ErrorResponse = {
    success: false;
    error: {
        code: ErrorCode;
        message: string;
        details?: { field?: string; message: string }[];
    };
    meta: {
        request_id?: string;
        timestamp: string;
    };
};

export function successResponse<T>(
    data: T,
    meta?: Record<string, any>,
    status = 200
) {
    const body: SuccessResponse<T> = {
        success: true,
        data,
        meta: {
            ...meta,
            timestamp: new Date().toISOString(),
        },
    };

    return NextResponse.json(body, { status });
}

export function errorResponse(error: unknown, statusOrReq?: number | Request) {
    const timestamp = new Date().toISOString();

    // We can pass a trace ID or request ID from headers later
    let requestId: string | undefined = undefined;
    let statusCode = 500;

    if (typeof statusOrReq === "number") {
        statusCode = statusOrReq;
    } else if (statusOrReq instanceof Request) {
        requestId = statusOrReq.headers.get("x-request-id") || undefined;
    }

    let errorBody: ErrorResponse["error"] = {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
    };

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        errorBody = {
            code: error.code,
            message: error.message,
            details: error.details,
        };
    } else if (error instanceof ZodError) {
        const zodError = error as ZodError;
        statusCode = 400;
        errorBody = {
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details: zodError.issues.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            })),
        };
    } else if (typeof error === "string") {
        errorBody.message = error;
        if (statusCode === 500) statusCode = 400; // Default to 400 if it's a string manual error without code
    } else if (error instanceof Error) {
        // Hide details in production if it's not a known AppError
        if (process.env.NODE_ENV !== "production") {
            errorBody.message = error.message;
        }
    }

    const body: ErrorResponse = {
        success: false,
        error: errorBody,
        meta: {
            request_id: requestId,
            timestamp,
        },
    };

    return NextResponse.json(body, { status: statusCode });
}
