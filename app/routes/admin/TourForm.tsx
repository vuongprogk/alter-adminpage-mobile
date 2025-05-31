import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getTourByIdRequest,
  updateTourRequest,
  createTourRequest,
  updateTourCategoriesAndTagsRequest,
  updateTourServicesRequest,
} from "~/api/tour";
import { getServicesRequest, getServiceByTourIdRequest } from "~/api/service";
import { useState, useEffect } from "react";
import type { Category, Tag } from "~/models/CommonModal";
import { getCategories, getTags } from "~/api/tourRelevent";
import { Link, useNavigate } from "react-router";

type TourFormInput = {
  name: string;
  description: string;
  destination: string;
  price: number;
  startDate: string;
  endDate: string;
};

const TourForm = ({ params }: { params?: { tourId?: string } }) => {
  const isEdit = Boolean(params?.tourId && params.tourId !== "");
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    enabled: isEdit,
    queryKey: ["tour", params?.tourId],
    queryFn: () => getTourByIdRequest(params!.tourId!),
  });

  const mutation = useMutation({
    mutationFn: async ({
      data,
      imageFile,
    }: {
      data: TourFormInput;
      imageFile?: File;
    }) => {
      return isEdit
        ? updateTourRequest(params!.tourId!, data, imageFile)
        : createTourRequest(data, imageFile!);
    },
    onSuccess: () => {
      alert(
        isEdit ? "Tour updated successfully!" : "Tour created successfully!"
      );
      if (isEdit) {
        navigate(`/tour/${params?.tourId}`);
      } else {
        navigate("/tours");
      }
    },
  });

  const [form, setForm] = useState<TourFormInput>({
    name: "",
    description: "",
    destination: "",
    price: 0,
    startDate: "",
    endDate: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false); // New state for unified modal
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const [categories, setCategories] = useState<Category[]>([]); // Ensure initialized as empty array
  const [tags, setTags] = useState<Tag[]>([]); // Ensure initialized as empty array
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    if (data && isEdit) {
      setForm({
        name: data.name || "",
        description: data.description || "",
        destination: data.destination || "",
        price: data.price || 0,
        startDate: data.startDate?.split("T")[0] || "",
        endDate: data.endDate?.split("T")[0] || "",
      });

      // Pre-select assigned categories and tags
      setSelectedCategories(
        data.categories?.map((cat: Category) => cat.id) || []
      );
      setSelectedTags(data.tags?.map((tag: Tag) => tag.id) || []); // Fixed incorrect usage
    }
  }, [data, isEdit]);

  useEffect(() => {
    // Fetch categories and tags when the modal is opened
    if (isDetailsModalOpen) {
      getCategories()
        .then((data) => setCategories(data))
        .catch(() => alert("Failed to fetch categories"));

      getTags()
        .then((data) => setTags(data))
        .catch(() => alert("Failed to fetch tags"));
    }
  }, [isDetailsModalOpen]);

  useEffect(() => {
    if (params?.tourId) {
      Promise.all([
        getServicesRequest(),
        getServiceByTourIdRequest(params.tourId), // Fetch services assigned to the tour
      ])
        .then(([allServices, assignedServices]) => {
          setServices(allServices);
          setSelectedServices(assignedServices.map((service) => service.id)); // Pre-select assigned services
        })
        .catch(() => alert("Failed to fetch services"));
    }
  }, [params?.tourId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ data: form, imageFile: imageFile || undefined });
  };

  const handleDetailsModalSubmit = async () => {
    try {
      if (params?.tourId) {
        await updateTourCategoriesAndTagsRequest(params.tourId, {
          CategoryIds: selectedCategories,
          TagIds: selectedTags,
        });
        await updateTourServicesRequest(params.tourId, {
          serviceId: selectedServices,
        });
        alert("Tour details updated successfully!");
        setDetailsModalOpen(false);
      }
    } catch {
      alert("Failed to update tour details.");
    }
  };

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleServiceSubmit = async () => {
    if (params?.tourId) {
      await updateTourServicesRequest(params.tourId, {
        serviceId: selectedServices,
      })
        .then(() => alert("Services updated successfully!"))
        .catch(() => alert("Failed to update services."));
    }
  };

  const toggleSelection = (
    id: number,
    selectedList: number[],
    setSelectedList: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    setSelectedList((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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
        Error loading tour
      </div>
    );

  return (
    <div className="p-8 bg-gradient-to-r from-purple-50 via-gray-50 to-purple-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-8 text-center">
          {isEdit ? "Edit Tour" : "Create Tour"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Tour Name
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter the tour name"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter a detailed description"
              rows={4}
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Destination
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              name="destination"
              value={form.destination}
              onChange={handleChange}
              placeholder="Enter the destination"
            />
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-1">
              <label className="block font-semibold text-gray-700 mb-2">
                Price
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter the price"
              />
            </div>
            <div className="grid grid-cols-2 col-span-4 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Tour Image
            </label>
            <div
              className="w-64 h-40 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-600 transition-all"
              onClick={() => document.getElementById("imageInput")?.click()}
            >
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : isEdit && data?.imageUrl ? (
                <img
                  src={`http://localhost:8080/${data.imageUrl}`}
                  alt="Current"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-400">Click to upload image</span>
              )}
            </div>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition-all"
          >
            {isEdit ? "Update Tour" : "Create Tour"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition-all"
            onClick={() => setDetailsModalOpen(true)}
          >
            Manage Tour Details
          </button>
        </div>

        {isDetailsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Manage Tour Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Categories
                  </label>
                  <div className="space-y-2">
                    {(categories || []).map((category) => (
                      <div key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() =>
                            toggleSelection(
                              category.id,
                              selectedCategories,
                              setSelectedCategories
                            )
                          }
                          className="mr-2"
                        />
                        <div>
                          <span className="font-semibold">{category.name}</span>
                          <p className="text-sm text-gray-500">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <div className="space-y-2">
                    {(tags || []).map((tag) => (
                      <div key={tag.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag.id)}
                          onChange={() =>
                            toggleSelection(tag.id, selectedTags, setSelectedTags)
                          }
                          className="mr-2"
                        />
                        <span>{tag.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Services
                  </label>
                  <div className="space-y-2">
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
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-all"
                  onClick={() => setDetailsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all"
                  onClick={handleDetailsModalSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourForm;
