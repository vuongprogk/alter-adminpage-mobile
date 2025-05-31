"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getServicesRequest, updateTourServicesRequest } from "~/api/service";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";

const ServiceManagement = () => {
  const { tourId } = useParams<{ tourId: string }>();
  const navigate = useNavigate();

  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    if (tourId) {
      getServicesRequest()
        .then((data) => setServices(data))
        .catch(() => alert("Failed to fetch services"));
    }
  }, [tourId]);

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSave = async () => {
    if (tourId) {
      await updateTourServicesRequest(tourId, { serviceId: selectedServices })
        .then(() => {
          alert("Services updated successfully!");
          navigate(`/admin/tour/${tourId}`);
        })
        .catch(() => alert("Failed to update services."));
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          Manage Services for Tour
        </h1>
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="flex items-center">
              <input
                type="checkbox"
                id={`service-${service.id}`}
                checked={selectedServices.includes(service.id)}
                onChange={() => handleServiceChange(service.id)}
                className="mr-2"
              />
              <label htmlFor={`service-${service.id}`} className="text-sm">
                {service.name}
              </label>
            </div>
          ))}
        </div>
        <div className="mt-6 text-right">
          <Button
            onClick={handleSave}
            className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
