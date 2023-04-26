import { logError } from 'helpers/loggers';

export function handleError(res, error) {
  const isUncontrolledError = error instanceof Error;
  if (isUncontrolledError) {
    logError(error.stack);
    res.status(500).send({ message: 'Server error. Ask a backend developer to fix it.' });
    return;
  }

  const { code, message } = JSON.parse(error);
  res.status(code).send({ message });
}

export function handleResponse(res, data) {
  res.status(200).send({ data });
}
