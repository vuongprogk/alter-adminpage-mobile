import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getTourByIdRequest } from "~/api/tour";
import { getServiceByTourIdRequest } from "~/api/service"; // Import service API

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

  const {
    data: services,
    isLoading: isServicesLoading,
    isError: isServicesError,
  } = useQuery({
    queryKey: ["services", params.tourId],
    queryFn: () => getServiceByTourIdRequest(params.tourId),
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

  const totalPrice =
    (data?.price || 0) +
    (services && services.length > 0
      ? services.reduce((sum: number, service: any) => sum + (service.price || 0), 0)
      : 0);

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading tour details...</div>;
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-red-500">Error loading tour information.</div>
    );
  }

  const placeholderImage = "https://via.placeholder.com/600x400?text=No+Image";

  return (
    <div className="p-8 bg-gradient-to-r from-gray-50 via-purple-50 to-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-6 text-center">
          {data.name}
        </h1>
        <div className="relative overflow-hidden rounded-lg shadow-lg mb-8">
          <img
            src={
              data.imageUrl
                ? `http://localhost:8080/${data.imageUrl}`
                : placeholderImage
            }
            alt={data.name}
            className="w-full max-h-96 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="space-y-4">
          <p className="text-gray-700 text-lg">
            <span className="font-semibold text-purple-600">Description:</span>{" "}
            {data.description}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold text-purple-600">Destination:</span>{" "}
            {data.destination}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold text-purple-600">Price:</span>{" "}
            <span className="text-green-600 font-bold">
              ${(data?.price || 0).toFixed(2)}
            </span>
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold text-purple-600">Start Date:</span>{" "}
            {formatDate(data.startDate)}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold text-purple-600">End Date:</span>{" "}
            {formatDate(data.endDate)}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold text-purple-600">Tags:</span>{" "}
            {data.tags && data.tags.length > 0
              ? data.tags.map((item) => item.name).join(", ")
              : "No tags available"}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold text-purple-600">Categories:</span>{" "}
            {data.categories && data.categories.length > 0
              ? data.categories.map((item) => item.name).join(", ")
              : "No categories available"}
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold text-purple-600">Total Price:</span>{" "}
            <span className="text-green-600 font-bold">
              ${totalPrice.toFixed(2)}
            </span>
          </p>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Services</h2>
          {isServicesLoading ? (
            <p className="text-gray-500">Loading services...</p>
          ) : isServicesError || !services ? (
            <p className="text-red-500">Error loading services.</p>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {services.map((service: any) => (
                <li key={service.id} className="text-gray-700">
                  <span className="font-semibold">{service.name}:</span>{" "}
                  <span>{service.description}</span>{" "}
                  <span className="text-green-600 font-bold">
                    (${(service.price || 0).toFixed(2)})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:from-purple-700 hover:to-purple-900 hover:scale-105 dark:shadow-none dark:bg-purple-700 dark:hover:bg-purple-800"
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
