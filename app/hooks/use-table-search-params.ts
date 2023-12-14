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
  console.log(
    `getPaginationFromSearchParams(): pageIndexParam is ${pageIndexParam}`
  );
  const pageSizeParam: string | null = searchParams.get(pageSizeParamName);
  console.log(
    `getPaginationFromSearchParams(): pageSizeParam is ${pageSizeParam}`
  );

  let pageIndex: number;
  if (!pageIndexParam) {
    console.log(
      `getPaginationFromSearchParams(): pageIndexParam is not set, setting it to the default value ${defaultState.pageIndex}`
    );
    pageIndex = defaultState.pageIndex;
  } else {
    console.log(
      `getPaginationFromSearchParams(): pageIndexParam is set, setting it to the value ${parseInt(
        pageIndexParam,
        10
      )}`
    );
    pageIndex = parseInt(pageIndexParam, 10);
  }

  let pageSize: number;
  if (!pageSizeParam) {
    console.log(
      `getPaginationFromSearchParams(): pageSizeParam is not set, setting it to the default value ${defaultState.pageSize}`
    );
    pageSize = defaultState.pageSize;
  } else {
    console.log(
      `getPaginationFromSearchParams(): pageSizeParam is set, setting it to the value ${parseInt(
        pageSizeParam,
        10
      )}`
    );
    pageSize = parseInt(pageSizeParam, 10);
  }

  console.log(
    `getSortFromSearchParams(): returning {pageIndex: ${pageIndex}, pageSize: ${pageSize}}`
  );
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
  console.log(
    `getSortFromSearchParams(): sortDescendingParam is ${sortDescendingParam}`
  );

  const sortIdParam: string | null = searchParams.get(sortIdParamName);
  console.log(`getSortFromSearchParams(): sortIdParam is ${sortIdParam}`);

  let desc: boolean;
  if (!sortDescendingParam) {
    console.log(
      `getSortFromSearchParams(): sortDescendingParam is not set, setting it to the default value ${defaultState.desc}`
    );
    desc = defaultState.desc;
  } else {
    console.log(
      `getSortFromSearchParams(): sortDescendingParam is set, setting it to the value ${
        sortDescendingParam === "true" || sortDescendingParam === ""
      }`
    );
    desc = sortDescendingParam === "true" || sortDescendingParam === "";
  }

  let id: string;
  if (!sortIdParam) {
    console.log(
      `getSortFromSearchParams(): sortIdParam is not set, setting it to the default value ${defaultState.id}`
    );
    id = defaultState.id;
  } else {
    console.log(
      `getSortFromSearchParams(): sortDescendingParam is set, setting it to the value ${sortIdParam}`
    );
    id = sortIdParam;
  }

  console.log(
    `getSortFromSearchParams(): returning {id: ${id}, desc: ${desc}}`
  );
  return {
    id,
    desc,
  };
};

export default useTableSearchParams;
