const handleResponse = (
  res,
  statusCode,
  { message, data = null, error = null }
) => {
  res.status(statusCode).json({
    message,
    data,
    code: statusCode,
    error,
  });
};
module.exports = handleResponse;
