import * as Sentry from '@sentry/node';

// Error handler - vangt alle onbehandelde errors op + Sentry
export default function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  Sentry.captureException(err);
  
  res.status(500).json({
    message: 'An error occurred on the server, please double-check your request!'
  });
}
