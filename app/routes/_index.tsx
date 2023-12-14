import type { MetaFunction } from "@remix-run/node";
import {
  CellContext,
  ColumnDef,
  ColumnHelper,
  createColumnHelper,
} from "@tanstack/react-table";
import { useMemo } from "react";
import Table from "~/components/table";
import { User } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "remix-tanstack-table-test" },
    { name: "description", content: "remix-tanstack-table-test" },
  ];
};

export default function Index() {
  const columns: ColumnDef<User, any>[] = useMemo(() => {
    const columnHelper: ColumnHelper<User> = createColumnHelper<User>();
    return [
      columnHelper.accessor("id", {
        cell: (props: CellContext<User, number>) => props.getValue(),
        header: (): string => "ID",
      }),
      columnHelper.accessor("name", {
        cell: (props: CellContext<User, string>) => props.getValue(),
        header: (): string => "Name",
      }),
      columnHelper.accessor("surname", {
        cell: (props: CellContext<User, string>) => props.getValue(),
        header: (): string => "Surname",
      }),
      columnHelper.accessor("age", {
        cell: (props: CellContext<User, number>) => props.getValue(),
        header: (): string => "Age",
      }),
    ];
  }, []);

  const data: User[] = useMemo(() => {
    return [
      {
        id: 1,
        name: "John",
        surname: "Doe",
        age: 40,
      },
      {
        id: 2,
        name: "Alex",
        surname: "Doe",
        age: 23,
      },
      {
        id: 3,
        name: "Derek",
        surname: "Doe",
        age: 33,
      },
    ];
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>remix-tanstack-table-test</h1>
      <Table columns={columns} data={data} />
    </div>
  );
}
