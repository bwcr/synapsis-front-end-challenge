interface Meta {
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export type PaginationResponse<T> = {
  data: T[];
  meta: Meta;
};

export type BaseResponse<T> = {
  data: T;
  meta: Meta | null;
};
