export function isRelativeURL(url: string): boolean {
  return url.startsWith("/");
}

export function getURLPath(url: URL): string {
  return url.pathname + url.search + url.hash;
}
