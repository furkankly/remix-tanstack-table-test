import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Person, fetchData, makeData } from "~/data";
import {
  json,
  LoaderFunctionArgs,
  TypedResponse,
  redirect,
} from "@remix-run/node";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export let mockData: null | Person[] = null;

// this code runs in the server
export const loader = async ({
  request,
}: LoaderFunctionArgs): Promise<
  | TypedResponse<{
      data: { data: Person[]; size: number };
      pageSize: string;
      pageIndex: string;
      sortId: string;
      sortDir: string;
    }>
  | undefined
> => {
  if (!mockData) {
    mockData = makeData(1000);
  }
  const searchParams = new URLSearchParams(request.url.split("?")[1]);
  if (
    !searchParams.get("page_size") ||
    !searchParams.get("page_index") ||
    !searchParams.get("sort_id") ||
    !searchParams.get("sort_dir")
  ) {
    searchParams.set("page_size", "10");
    searchParams.set("page_index", "0");
    searchParams.set("sort_id", "name");
    searchParams.set("sort_dir", "asc");

    // Redirect to the URL with default parameters
    const redirectUrl = `/?${searchParams.toString()}`;
    return redirect(redirectUrl);
  }

  const url = new URL(request.url);
  const pageSize = url.searchParams.get("page_size") as string;
  const pageIndex = url.searchParams.get("page_index") as string;
  const sortId = url.searchParams.get("sort_id") as string;
  const sortDir = url.searchParams.get("sort_dir") as string;
  const data = await fetchData({ pageSize, pageIndex });

  return json({ data, pageSize, pageIndex, sortId, sortDir });
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
