export function processUIString(str: string): string {
  return shorten(capitalize(str), 30);
}

function shorten(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  throw new Error("test error");
  return str.slice(0, maxLength) + '...';
}

function capitalize(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}
