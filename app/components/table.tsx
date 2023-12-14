import {
  IconCaretLeftFilled,
  IconCaretRightFilled,
  IconSquareChevronDownFilled,
  IconSquareChevronUpFilled,
} from "@tabler/icons-react";
import {
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  Cell,
  ColumnDef,
  Row,
  Table as TanstackTable,
} from "@tanstack/table-core";
import { getCoreRowModel } from "@tanstack/table-core";
import type { ReactElement } from "react";

import useTableSearchParams from "~/hooks/use-table-search-params";

interface TableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
}

export default function Table<T>({
  columns,
  data,
}: TableProps<T>): ReactElement {
  const [pagination, sorting, setPagination, setSorting] = useTableSearchParams(
    {
      pageIndex: 0,
      pageSize: 10,
    },
    {
      desc: false,
      id: "id",
    }
  );

  const table: TanstackTable<T> = useReactTable({
    columns: columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
    },
  });

  return (
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
          {table.getRowModel().rows.map((row: Row<T>) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell: Cell<T, unknown>) => (
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
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <IconCaretLeftFilled size={14} />
        </button>
        <button
          onClick={(): void => {
            table.nextPage();
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
  );
}
