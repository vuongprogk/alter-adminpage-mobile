import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
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
import type { User } from "~/models/CommonModal";
import { getAllUsersRequest, updateUserRoleRequest } from "~/api/user";

// Format date utility
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const MemoizedTableRow = React.memo(({ row, roles, handleRoleChange }: any) => (
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
));

const Users = () => {
  const navigate = useNavigate();

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsersRequest,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [roles, setRoles] = React.useState<Record<string, string>>({});

  const handleRoleChange = async (userId: string, newRole: string) => {
    setRoles((prev) => ({ ...prev, [userId]: newRole }));
    try {
      await updateUserRoleRequest(userId, newRole); // Call API to update role
    } catch (error) {
      console.error("Failed to update role:", error);
      setRoles((prev) => ({
        ...prev,
        [userId]: data.find((u) => u.id === userId)?.role || "0",
      })); // Revert on failure
    }
  };

  React.useEffect(() => {
    if (data.length > 0) {
      const initialRoles = data.reduce((acc, user) => {
        acc[user.id] = user.role;
        return acc;
      }, {} as Record<string, string>);
      setRoles(initialRoles);
    }
  }, [data]);

  // Columns definition
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <select
          value={roles[row.original.id] || row.original.role}
          onChange={(e) => handleRoleChange(row.original.id, e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="1">Admin</option>
          <option value="0">User</option>
        </select>
      ),
    },
  ];

  const memoizedData = React.useMemo(() => data, [data]);

  // Ensure hooks are not conditionally rendered
  const table = useReactTable({
    data: memoizedData,
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
    return <div className="p-6 text-gray-600">Loading users...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load users.</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-gray-50 via-purple-50 to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-8 text-center drop-shadow-lg">
          Users
        </h1>

        <div className="flex justify-end mb-6">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition"
            onClick={() => navigate("/user/form")}
          >
            Add New User
          </button>
        </div>

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
                table
                  .getRowModel()
                  .rows.map((row) => (
                    <MemoizedTableRow
                      key={row.id}
                      row={row}
                      roles={roles}
                      handleRoleChange={handleRoleChange}
                    />
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center p-4"
                  >
                    No users available.
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

export default Users;
