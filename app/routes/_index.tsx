import type { MetaFunction } from "@remix-run/node";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Table from "~/components/table";
import { Person } from "~/data";

export const meta: MetaFunction = () => {
  return [
    { title: "remix-tanstack-table-test" },
    { name: "description", content: "remix-tanstack-table-test" },
  ];
};

export default function Index() {
  const columns = useMemo<ColumnDef<Person>[]>(() => {
    return [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "surname", header: "Surname" },
      { accessorKey: "age", header: "Age" },
    ];
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>remix-tanstack-table-test</h1>
      <Table columns={columns} />
    </div>
  );
}
