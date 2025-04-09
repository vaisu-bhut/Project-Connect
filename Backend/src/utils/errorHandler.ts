interface ErrorResponse {
  error: {
    message: string;
    details?: string;
  };
}

export const createError = (message: string, error?: any): ErrorResponse => {
  return {
    error: {
      message,
      details: error?.message || error
    }
  };
}; 