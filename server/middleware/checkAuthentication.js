/**
 * Middleware: checkAuthentication
 * Blocks unauthenticated requests with a 401 before they reach any controller.
 * Attach to any route that requires a logged-in user.
 */
const checkAuthentication = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'You must be logged in.' });
  }
  next();
};

module.exports = checkAuthentication;