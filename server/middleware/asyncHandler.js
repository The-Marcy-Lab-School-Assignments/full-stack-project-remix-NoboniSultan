// Express 4 does not catch rejections from async route handlers. Without this
// wrapper a failed query becomes an unhandled rejection, which on Node 15+
// terminates the process — so one bad database call takes the whole server
// down and Render answers 502 until it restarts.
//
// Wrapping forwards the error to the global error handler instead, which
// answers 500 and leaves the server running.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
