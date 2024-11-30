export function getPercentChange(
  pre: number | undefined,
  post: number | undefined
): number {
  if (!pre || !post) return 0;
  return ((post - pre) * 100) / pre;
}
