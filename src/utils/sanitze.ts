export const sanitize = (input: string): string => {
  const response = input.toLowerCase().trim();

  return response;
};
