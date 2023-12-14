import {
  IconCaretLeftFilled,
  IconCaretRightFilled,
  IconSquareChevronDownFilled,
  IconSquareChevronUpFilled,
} from "@tabler/icons-react";
import {
  flexRender,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/table-core";
import { getCoreRowModel } from "@tanstack/table-core";
import { Person } from "~/data";

import { useRouteLoaderData, useSearchParams } from "@remix-run/react";
import { loader as parentLoader } from "~/root";

interface TableProps {
  columns: ColumnDef<Person>[];
}

const updateSearchParams = (param: string, value: string) => {
  const currentSearchParams = new URLSearchParams(window.location.search);
  currentSearchParams.set(param, value);
  return currentSearchParams;
};

export default function Table({ columns }: TableProps) {
  const [, setSearchParams] = useSearchParams();
  const data = useRouteLoaderData<typeof parentLoader>("root");

  const pageCount = data ? data.data.size / parseInt(data.pageSize) : 0;

  const table = useReactTable({
    columns,
    data: data?.data.data ?? [],
    getCoreRowModel: getCoreRowModel(),
    // as we're doing CSR sorting
    getSortedRowModel: getSortedRowModel(),
    // as we're doing SSR pagination
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: parseInt(data?.pageIndex as string) ?? 0,
        pageSize: parseInt(data?.pageSize as string) ?? 10,
      },
    },
    pageCount,
  });

  return (
    data?.data && (
      <>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    colSpan={header.colSpan}
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div>
                      <span>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </span>
                      {{
                        asc: <IconSquareChevronUpFilled size={14} />,
                        desc: <IconSquareChevronDownFilled size={14} />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button
            onClick={(): void => {
              table.previousPage();
              const pageSize = table.getState().pagination.pageSize;
              const nextPageIndex = (
                table.getState().pagination.pageIndex - pageSize
              ).toString();
              const newSearchParams = updateSearchParams(
                "page_index",
                nextPageIndex
              );
              setSearchParams(newSearchParams);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <IconCaretLeftFilled size={14} />
          </button>
          <button
            onClick={(): void => {
              table.nextPage();
              const pageSize = table.getState().pagination.pageSize;
              const nextPageIndex = (
                table.getState().pagination.pageIndex + pageSize
              ).toString();
              const newSearchParams = updateSearchParams(
                "page_index",
                nextPageIndex
              );
              setSearchParams(newSearchParams);
            }}
            disabled={!table.getCanNextPage()}
          >
            <IconCaretRightFilled size={14} />
          </button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
        </div>
      </>
    )
  );
}
