import { logError } from 'helpers/loggers';

export function handleError(res, error) {
  logError(error.stack)
  res.status(500).send({ message: 'Server error. Ask a backend developer to fix it.' })
}
  
export function handleResponse(res, data) {
  res.status(200).send({ data })
}