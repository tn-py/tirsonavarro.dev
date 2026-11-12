const hasOrder = (order: number | undefined): order is number =>
  typeof order === "number" && Number.isFinite(order);

/**
 * Orders projects for display: entries with a finite numeric `order` first
 * (ascending), then the rest by title. Ties on `order` break by title.
 * Returns a new array; the input is not mutated.
 */
export function sortProjects<T extends { title: string; order?: number }>(projects: T[]): T[] {
  return [...projects].sort((a, b) => {
    const aOrdered = hasOrder(a.order);
    const bOrdered = hasOrder(b.order);
    if (aOrdered && bOrdered && a.order !== b.order) return a.order! - b.order!;
    if (aOrdered !== bOrdered) return aOrdered ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
}
