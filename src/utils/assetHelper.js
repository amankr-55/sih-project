/**
 * Resolves asset paths relative to Vite's base path.
 * Handles trailing slashes, leading slashes, and external URLs seamlessly.
 */
export function getAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const clean = path.replace(/^\.\//, '').replace(/^\//, '');
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : base + '/';
  return normalizedBase + clean;
}
