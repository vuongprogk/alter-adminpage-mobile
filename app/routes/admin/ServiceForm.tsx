"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getServiceByIdRequest,
  createServiceRequest,
  updateServiceRequest,
} from "~/api/service";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useNavigate } from "react-router";

type ServiceFormInput = {
  tourId: string;
  name: string;
  description: string;
};

const ServiceForm = ({
  params,
}: {
  params?: { serviceId?: string; tourId?: string };
}) => {
  const navigate = useNavigate(); // Always call hooks at the top level
  const isEdit = Boolean(params?.serviceId && params?.serviceId !== "");

  const { data, isLoading, isError } = useQuery({
    enabled: isEdit,
    queryKey: ["service", params?.serviceId],
    queryFn: () =>
      isEdit
        ? getServiceByIdRequest(params!.serviceId!)
        : Promise.resolve(null),
  });
  const mutation = useMutation({
    mutationFn: async (data: ServiceFormInput) => {
      return isEdit
        ? updateServiceRequest(params!.serviceId!, data)
        : createServiceRequest(data);
    },
    onSuccess: () => {
      alert(
        isEdit
          ? "Service updated successfully!"
          : "Service created successfully!"
      );
      navigate("/services");
    },
  });

  const [form, setForm] = useState<ServiceFormInput>({
    tourId: params?.tourId || "",
    name: "",
    description: "",
  });

  useEffect(() => {
    if (data && isEdit) {
      setForm({
        tourId: params?.tourId || data.tourId || "",
        name: data.name || "",
        description: data.description || "",
      });
    }
  }, [data, isEdit, params?.tourId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditService = async () => {
    mutation.mutate(form);
  };

  // Update handleSubmit to delegate to the appropriate function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (isEdit && isLoading)
    return (
      <div className="text-center text-purple-600 text-xl mt-10">
        Loading...
      </div>
    );
  if (isEdit && isError)
    return (
      <div className="text-center text-red-600 text-xl mt-10">
        Error loading service
      </div>
    );

  return (
    <div className="p-8 bg-gradient-to-r from-gray-50 via-blue-50 to-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          {isEdit ? "Edit Service" : "Create New Service"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!params?.tourId && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tour ID
              </label>
              <Input
                name="tourId"
                value={form.tourId}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="text-right">
            <Button
              type="submit"
              className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition-all"
            >
              {isEdit ? "Update Service" : "Create Service"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
