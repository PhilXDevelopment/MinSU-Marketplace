import axios from "axios";
import { useState } from "react";

interface AddProductProps {
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
  userId: string;
}

type ProductStatus = "active" | "inactive" | "draft";
type ProductCategory = "electronics" | "clothing" | "books" | "home";

export default function AddProduct({
  isOpen,
  onClose,
  apiUrl,
  userId,
}: AddProductProps) {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ProductStatus>("draft");
  const [category, setCategory] = useState<ProductCategory>("electronics");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!productName) newErrors.productName = "Product name is required";
    if (!description) newErrors.description = "Description is required";
    if (typeof quantity !== "number" || quantity <= 0)
      newErrors.quantity = "Quantity must be a positive number";
    if (typeof price !== "number" || price <= 0)
      newErrors.price = "Price must be greater than 0";
    if (!validFrom) newErrors.validFrom = "Start date is required";
    if (!validTo) newErrors.validTo = "End date is required";
    if (validFrom && validTo && new Date(validFrom) > new Date(validTo))
      newErrors.validTo = "End date must be after the start date";
    if (images.length === 0)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setImages([]);
    setProductName("");
    setDescription("");
    setQuantity("");
    setPrice("");
    setValidFrom("");
    setValidTo("");
    setStatus("draft");
    setCategory("electronics");
    setErrors({});
    setApiError(null);
  };

  const handleSubmit = async () => {
    setApiError(null);
    if (!validate()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("userid", userId);
      formData.append("name", productName);
      formData.append("description", description);
      formData.append("quantity", quantity.toString());
      formData.append("price", price.toString());
      formData.append("valid_from", validFrom);
      formData.append("valid_to", validTo);
      formData.append("status", status);
      formData.append("category", category);

      images.forEach((image) => formData.append("images", image));

      const res = await axios.post(
        `${apiUrl}api/user-product/addproduct`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log(res.data);
      setLoading(false);
      resetForm();
      onClose();
    } catch (err: any) {
      console.error(err);
      setApiError(
        `Failed to add product: ${
          err?.response?.data?.message || err.message || "Unknown error"
        }`
      );
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-md p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl scrollbar-hide p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={() => {
            resetForm();
            onClose();
          }}
        >
          ×
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Add New Product
        </h2>

        {apiError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{apiError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              className={`w-full border rounded-lg p-2 ${
                errors.productName ? "border-red-500" : "border-gray-300"
              }`}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            {errors.productName && (
              <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              className={`w-full border rounded-lg p-2 ${
                errors.quantity ? "border-red-500" : "border-gray-300"
              }`}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              min={0.01}
              step={0.01}
              className={`w-full border rounded-lg p-2 ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full border rounded-lg p-2 border-gray-300"
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
            >
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home Goods</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full border rounded-lg p-2 border-gray-300"
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus)}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block font-medium text-gray-700 mb-1">
                Valid From
              </label>
              <input
                type="date"
                className={`w-full border rounded-lg p-2 ${
                  errors.validFrom ? "border-red-500" : "border-gray-300"
                }`}
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
              />
              {errors.validFrom && (
                <p className="text-red-500 text-sm mt-1">{errors.validFrom}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block font-medium text-gray-700 mb-1">
                Valid To
              </label>
              <input
                type="date"
                className={`w-full border rounded-lg p-2 ${
                  errors.validTo ? "border-red-500" : "border-gray-300"
                }`}
                value={validTo}
                onChange={(e) => setValidTo(e.target.value)}
              />
              {errors.validTo && (
                <p className="text-red-500 text-sm mt-1">{errors.validTo}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={4}
            className={`w-full border rounded-lg p-2 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">
            Product Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className={`w-full border rounded-lg p-2 ${
              errors.images ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images}</p>
          )}

          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={img.name}
                    className="w-28 h-28 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full md:w-1/4 bg-green-600 text-white py-3 rounded-lg font-semibold shadow text-lg transition ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
          }`}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
