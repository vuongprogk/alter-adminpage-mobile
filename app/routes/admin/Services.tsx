"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { getServicesRequest } from "~/api/service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import type { Service } from "~/models/CommonModal"; // Import Service model
import { useNavigate } from "react-router";

// Format date utility
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const Services = () => {
  const navigate = useNavigate(); // Move useNavigate to the top level

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<Service[]>({
    // Use Service[] as the type for data
    queryKey: ["services"],
    queryFn: getServicesRequest,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  if (isLoading) {
    return <div className="p-6 text-gray-600">Loading services...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load services.</div>;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-8 text-center drop-shadow-lg">
          Services
        </h1>

        <div className="mb-4 text-right">
          <Button
            onClick={
              () => navigate("/service/form") // Navigate to the create service page
            }
            className="bg-purple-700 text-white hover:bg-purple-800"
          >
            Create New Service
          </Button>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="p-4 text-left">Service ID</TableHead>
                <TableHead className="p-4 text-left">Tour ID</TableHead>
                <TableHead className="p-4 text-left">Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((service: Service) => (
                  <TableRow
                    key={service.id}
                    className="hover:bg-gray-100 cursor-pointer transition"
                    onClick={() => navigate(`/service/form/${service.id}`)}
                  >
                    <TableCell className="p-4">{service.id}</TableCell>
                    <TableCell className="p-4">{service.tourId}</TableCell>
                    <TableCell className="p-4">{service.name}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center p-4">
                    No services available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Services;
