import { useSearchParams } from "@remix-run/react";
import type {
  ColumnSort,
  OnChangeFn,
  PaginationState,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import { functionalUpdate } from "@tanstack/react-table";

const pageIndexParamName = "page-index";
const pageSizeParamName = "page-size";
const sortDescendingParamName = "sort-desc";
const sortIdParamName = "sort-id";

const useTableSearchParams = (
  defaultPaginationState: PaginationState,
  defaultSortState: ColumnSort
): [
  PaginationState,
  SortingState,
  OnChangeFn<PaginationState>,
  OnChangeFn<SortingState>
] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pagination: PaginationState = getPaginationFromSearchParams(
    searchParams,
    defaultPaginationState
  );

  const sorting: ColumnSort = getSortFromSearchParams(
    searchParams,
    defaultSortState
  );

  const setPagination = (updateOrValue: Updater<PaginationState>): void => {
    const paginationState: PaginationState = functionalUpdate(
      updateOrValue,
      pagination
    );

    searchParams.set(pageIndexParamName, String(paginationState.pageIndex));
    searchParams.set(pageSizeParamName, String(paginationState.pageSize));
    setSearchParams(searchParams);
  };

  const setSorting = (updateOrValue: Updater<SortingState>): void => {
    const sortState: ColumnSort[] = functionalUpdate(updateOrValue, [sorting]);
    searchParams.set(
      sortDescendingParamName,
      String(sortState[0]?.desc ?? false)
    );

    searchParams.set(sortIdParamName, String(sortState[0]?.id ?? "id"));
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
