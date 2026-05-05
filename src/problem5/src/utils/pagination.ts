export interface PaginationParams {
  page: number;
  limit: number;
}

export function paginationMeta(total: number, { page, limit }: PaginationParams) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}
