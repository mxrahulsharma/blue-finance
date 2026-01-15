export const errorHandler = (err, req, res, next) => {
    console.error("🔥 ERROR:", err);
  
    const statusCode = err.statusCode || 500;
    const message =
      err.isOperational
        ? err.message
        : "Something went wrong. Please try again.";
  
    res.status(statusCode).json({
      success: false,
      message,
    });
  };
  