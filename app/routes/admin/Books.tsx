"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getAllBooksRequest } from "~/api/book";
import {
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import type { Book } from "~/models/CommonModal";

// Format date utility
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// Updated columns definition
const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "username",
    header: "User Name",
  },
  {
    accessorKey: "tourName",
    header: "Tour Name",
  },
  {
    accessorKey: "bookingDate",
    header: "Booking Date",
    cell: ({ row }) => formatDate(row.getValue("bookingDate")),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

const Books = () => {
  const navigate = useNavigate();

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["books"],
    queryFn: getAllBooksRequest,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading books...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load books.</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-gray-50 via-purple-50 to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-8 text-center drop-shadow-lg">
          Books
        </h1>

        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <Table className="w-full text-sm">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="p-4 text-left">
                      {header.isPlaceholder
                        ? null
                        : header.column.columnDef.header instanceof Function
                        ? header.column.columnDef.header(header.getContext())
                        : header.column.columnDef.header}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-gray-100 cursor-pointer transition"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-4">
                        {cell.column.columnDef.cell
                          ? cell.column.columnDef.cell(cell.getContext())
                          : cell.getValue()}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center p-4"
                  >
                    No books available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-4 py-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Books;
