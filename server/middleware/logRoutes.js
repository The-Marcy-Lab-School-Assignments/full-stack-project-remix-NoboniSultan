/**
 * Middleware: logRoutes
 * Logs each incoming request's method and path to the console.
 */
const logRoutes = (req, _res, next) => {
  console.log(`  ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = logRoutes;