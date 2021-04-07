export const sanitize = (input: string): string => {
  const param = input.toLowerCase().trim();
  // apparently replaceAll does not work in Node just yet, will use it at a later stage
  // const output = param.replaceAll(' ', '-');

  const output = param.split(' ').join('-');

  return output;
};
