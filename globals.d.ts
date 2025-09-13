declare function $import<T = any>(path: string, parentDir?: string): T;

interface Window {
  ALIASES: {
    [key: string]: string;
  };
  resolvePath: (requestPath: string, parentDir?: string) => string;
  $import: typeof $import;
}
