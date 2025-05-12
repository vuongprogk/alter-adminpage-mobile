import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getTourByIdRequest,
  updateTourRequest,
  createTourRequest,
} from "~/api/tour";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

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
  console.log("isEdit", isEdit);
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
    }
  }, [data, isEdit]);

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
                  src={`http://localhost:5000/${data.imageUrl}`}
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
      </div>
    </div>
  );
};

export default TourForm;
