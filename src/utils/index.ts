/**
 * Converts an object's keys from snake_case to camelCase
 * @param obj The object to convert
 * @returns A new object with camelCase keys
 */
export function snakeToCamelCase<T extends Record<string, any>>(obj: T): T {
  const convertToCamelCase = (key: string) =>
    key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

  const convertValue = (value: any): any => {
    if (Array.isArray(value)) {
      return value.map(convertValue);
    } else if (typeof value === "object" && value !== null) {
      return snakeToCamelCase(value);
    }
    return value;
  };

  return Object.entries(obj).reduce((acc, [key, value]) => {
    const camelKey = convertToCamelCase(key);
    acc[camelKey as keyof T] = convertValue(value);
    return acc;
  }, {} as T);
}
