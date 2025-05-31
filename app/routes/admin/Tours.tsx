"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getAllToursRequest } from "~/api/tour";

import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import type { Tour } from "~/models/CommonModal";

// Format date utility
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// Columns definition
const columns = [
  {
    accessorKey: "name",
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
    accessorKey: "destination",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Destination <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `$${row.getValue("price").toFixed(2)}`,
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => formatDate(row.getValue("startDate")),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => formatDate(row.getValue("endDate")),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.getValue("description"),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) =>
      row
        .getValue("tags")
        .map((tag) => tag.name)
        .join(", "),
  },
  {
    accessorKey: "categories",
    header: "Categories",
    cell: ({ row }) =>
      row
        .getValue("categories")
        .map((category) => category.name)
        .join(", "),
  },
];

const Tours = () => {
  const navigate = useNavigate();

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tours"],
    queryFn: getAllToursRequest,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const placeholderImage = "https://via.placeholder.com/300x200?text=No+Image";

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading tours...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load tours.</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-gray-50 via-purple-50 to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-8 text-center drop-shadow-lg">
          Tours
        </h1>

        <div className="flex justify-end mb-6">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition"
            onClick={() => navigate("/tour/form")}
          >
            Add New Tour
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.length > 0 ? (
            data.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition-transform cursor-pointer"
                onClick={() => navigate(`/tour/${tour.id}`)}
              >
                <div className="relative overflow-hidden rounded-lg shadow mb-4">
                  <img
                    src={
                      tour.imageUrl
                        ? `http://localhost:8080/${tour.imageUrl}`
                        : placeholderImage
                    }
                    alt={tour.name}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <h2 className="text-xl font-bold text-purple-700 mb-2">
                  {tour.name}
                </h2>
                <p className="text-gray-600">
                  <strong>Destination:</strong> {tour.destination}
                </p>
                <p className="text-gray-600">
                  <strong>Price:</strong> ${tour.price.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  <strong>Start Date:</strong> {formatDate(tour.startDate)}
                </p>
                <p className="text-gray-600">
                  <strong>End Date:</strong> {formatDate(tour.endDate)}
                </p>
                <p className="text-gray-600">
                  <strong>Description:</strong> {tour.description}
                </p>
                <p className="text-gray-600">
                  <strong>Tags:</strong>{" "}
                  {tour.tags.map((tag) => tag.name).join(", ")}
                </p>
                <p className="text-gray-600">
                  <strong>Categories:</strong>{" "}
                  {tour.categories.map((category) => category.name).join(", ")}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600">
              No tours available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tours;
