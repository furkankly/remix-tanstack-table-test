import { useSearchParams } from "@remix-run/react";
import type {
  ColumnSort,
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

const pageIndexParamName = "page-index";
const pageSizeParamName = "page-size";
const sortDescendingParamName = "sort-desc";
const sortIdParamName = "sort-id";

type SetPaginationFn = (state: PaginationState) => void;
type SetSortingFn = (state: SortingState) => void;

const useTableSearchParams = (
  defaultPaginationState: PaginationState,
  defaultSortState: ColumnSort
): [PaginationState, SortingState, SetPaginationFn, SetSortingFn] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pagination: PaginationState = getPaginationFromSearchParams(
    searchParams,
    defaultPaginationState
  );
  const sorting: ColumnSort = getSortFromSearchParams(
    searchParams,
    defaultSortState
  );

  const setPagination = (state: PaginationState): void => {
    searchParams.set(
      pageIndexParamName,
      String(state?.pageIndex ?? defaultPaginationState.pageIndex)
    );
    searchParams.set(
      pageSizeParamName,
      String(state?.pageSize ?? defaultPaginationState.pageSize)
    );

    setSearchParams(searchParams);
  };

  const setSorting = (state: SortingState): void => {
    if (!state[0]) {
      searchParams.set(sortDescendingParamName, String(defaultSortState.desc));
      searchParams.set(sortIdParamName, defaultSortState.id);
      return;
    } else {
      searchParams.set(sortDescendingParamName, String(state[0].desc));
      searchParams.set(sortIdParamName, state[0].id);
    }

    setSearchParams(searchParams);
  };

  return [pagination, [sorting], setPagination, setSorting];
};

const getPaginationFromSearchParams = (
  searchParams: URLSearchParams,
  defaultState: PaginationState
): PaginationState => {
  const pageIndexParam: string | null = searchParams.get(pageIndexParamName);
  const pageSizeParam: string | null = searchParams.get(pageSizeParamName);

  let pageIndex: number;
  if (!pageIndexParam) {
    pageIndex = defaultState.pageIndex;
  } else {
    pageIndex = parseInt(pageIndexParam, 10);
  }

  let pageSize: number;
  if (!pageSizeParam) {
    pageSize = defaultState.pageSize;
  } else {
    pageSize = parseInt(pageSizeParam, 10);
  }

  return {
    pageIndex,
    pageSize,
  };
};

const getSortFromSearchParams = (
  searchParams: URLSearchParams,
  defaultState: ColumnSort
): ColumnSort => {
  const sortDescendingParam: string | null = searchParams.get(
    sortDescendingParamName
  );
  const sortIdParam: string | null = searchParams.get(sortIdParamName);

  let desc: boolean;
  if (!sortDescendingParam) {
    desc = defaultState.desc;
  } else {
    desc = sortDescendingParam === "true" || sortDescendingParam === "";
  }

  let id: string;
  if (!sortIdParam) {
    id = defaultState.id;
  } else {
    id = sortIdParam;
  }

  return {
    id,
    desc,
  };
};

export default useTableSearchParams;
