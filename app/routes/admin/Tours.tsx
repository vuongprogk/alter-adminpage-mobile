import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getAllToursRequest } from "~/api/tour";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const Tours = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tours"],
    queryFn: getAllToursRequest,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading tours...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load tours.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-purple-600 mb-6">Tours</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <Table className="w-full table-auto text-sm">
          <TableHeader className="bg-gray-100 text-gray-700 uppercase text-xs">
            <TableRow>
              <TableHead className="p-4 text-left">Name</TableHead>
              <TableHead className="p-4 text-left">Destination</TableHead>
              <TableHead className="p-4 text-left">Price</TableHead>
              <TableHead className="p-4 text-left">Start Date</TableHead>
              <TableHead className="p-4 text-left">End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-gray-600">
            {data?.length > 0 ? (
              data.map((tour) => (
                <TableRow
                  key={tour.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => navigate(`/tour/${tour.id}`)}
                >
                  <TableCell className="p-4">{tour.name}</TableCell>
                  <TableCell className="p-4">{tour.destination}</TableCell>
                  <TableCell className="p-4 font-medium">
                    ${tour.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="p-4">
                    {formatDate(tour.startDate)}
                  </TableCell>
                  <TableCell className="p-4">
                    {formatDate(tour.endDate)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="p-4 text-center text-gray-400" colSpan={5}>
                  No tours available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Tours;
