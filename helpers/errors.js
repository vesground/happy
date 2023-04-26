function CustomError({ code, message }) {
  return JSON.stringify({ code, message });
}

export function GeneralError(message) {
  return CustomError({ code: 500, message });
}
