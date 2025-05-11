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
      navigate("/tours");
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

  if (isEdit && isLoading) return <div>Loading...</div>;
  if (isEdit && isError) return <div>Error loading tour</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-purple-600">
        {isEdit ? "Edit Tour" : "Create Tour"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tour Name"
        />
        <textarea
          className="w-full border p-2 rounded"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          className="w-full border p-2 rounded"
          name="destination"
          value={form.destination}
          onChange={handleChange}
          placeholder="Destination"
        />
        <input
          className="w-full border p-2 rounded"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
        />
        <input
          className="w-full border p-2 rounded"
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleChange}
        />
        <input
          className="w-full border p-2 rounded"
          name="endDate"
          type="date"
          value={form.endDate}
          onChange={handleChange}
        />

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Show existing image in edit mode */}
        {isEdit && data?.imageUrl && !imageFile && (
          <div>
            <p className="text-gray-500">Current Image:</p>
            <img
              src={`http://localhost:5000/${data.imageUrl}`}
              alt="Current"
              className="w-64 h-auto rounded shadow"
            />
          </div>
        )}

        {imageFile && (
          <div>
            <p className="text-gray-500">New Image Preview:</p>
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="w-64 h-auto rounded shadow"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          {isEdit ? "Update Tour" : "Create Tour"}
        </button>

        {mutation.isSuccess && (
          <p className="text-green-600 mt-2">
            {isEdit
              ? "Tour updated successfully."
              : "Tour created successfully."}
          </p>
        )}
      </form>
    </div>
  );
};

export default TourForm;
