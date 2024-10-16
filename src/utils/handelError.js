// Utility to catch async errors
export const catchErorr = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);  // Directly pass the caught error to next()
    }
}

// Global error handler
export const globalErorr = (error, req, res, next) => {
    const statusCode = error.cause || 500;
    const errorMessage = error.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: "false",
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        validationError: req.validationError || undefined,
    });
}
