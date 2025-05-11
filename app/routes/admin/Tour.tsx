import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getTourByIdRequest } from "~/api/tour";

const Tour = ({
  params,
}: {
  params: {
    tourId: string;
  };
}) => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tour", params.tourId],
    queryFn: () => getTourByIdRequest(params.tourId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const formatDate = (date: string) => {
    const parsed = new Date(date);
    return isNaN(parsed.getTime())
      ? "Invalid date"
      : parsed.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading tour details...</div>;
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-red-500">Error loading tour information.</div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-purple-600 mb-4">{data.name}</h1>
        <img
          src={`http://localhost:5000/${data.imageUrl}`}
          alt={data.name}
          className="w-full max-h-96 object-cover rounded-lg shadow mb-6"
        />
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Description:</span> {data.description}
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Destination:</span> {data.destination}
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Price:</span> ${data.price.toFixed(2)}
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">Start Date:</span>{" "}
          {formatDate(data.startDate)}
        </p>
        <p className="text-gray-600 mb-1">
          <span className="font-semibold">End Date:</span>{" "}
          {formatDate(data.endDate)}
        </p>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition"
            onClick={() => navigate(`/tour/form/${data.id}`)}
          >
            Edit Tour
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tour;
