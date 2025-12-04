import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewProduct() {
  const navigate = useNavigate();

  const product = {
    id: 1,
    name: "Wireless Headphones",
    price: 599,
    rating: 4.8,
    images: [
      "https://via.placeholder.com/400x400",
      "https://via.placeholder.com/400x400/aaa",
      "https://via.placeholder.com/400x400/bbb",
    ],
    description:
      "High-quality wireless headphones with noise cancellation and long battery life. Comfortable fit, premium sound, and ideal for music lovers who want superior sound quality and a sleek design. Perfect for commuting, exercising, or home use. Battery lasts up to 30 hours with quick charge feature, making it reliable for travel and everyday use.",
    category: "electronics",
    reviews: [
      { id: 1, user: "Alice", rating: 5, comment: "Excellent sound quality!" },
      { id: 2, user: "Bob", rating: 4, comment: "Very comfortable to wear." },
      {
        id: 3,
        user: "Charlie",
        rating: 5,
        comment: "Battery lasts really long.",
      },
    ],
  };

  const seller = {
    name: "John Doe",
    avatar: "https://via.placeholder.com/80",
    rating: 4.9,
    reviews: 120,
    location: "Manila, Philippines",
  };

  const [liked, setLiked] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const toggleDescription = () => setShowFullDesc(!showFullDesc);

  const openModal = (index) => {
    setCurrentImage(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const prevImage = () =>
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );

  const nextImage = () =>
    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );

  return (
    <div className="min-h-screen bg-emerald-50 p-4 pb-14 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-2 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="hover:underline flex items-center gap-1"
        >
          ← Back
        </button>
        / <span className="text-gray-700 font-medium">{product.name}</span>
      </nav>

      {/* Product + Seller Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 flex flex-col lg:flex-row gap-6">
        <div
          className="w-full lg:w-1/2 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => openModal(currentImage)}
        >
          <img
            src={product.images[currentImage]}
            alt={product.name}
            className="object-cover w-full h-full rounded-2xl"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-emerald-700">
              {product.name}
            </h1>
            <p className="text-emerald-700 font-bold text-2xl mt-2">
              ₱{product.price}
            </p>
            <p className="text-xs text-yellow-500 mt-1">⭐ {product.rating}</p>

            {/* Description */}
            <p className="text-gray-600 mt-4">
              {showFullDesc
                ? product.description
                : `${product.description.slice(0, 150)}...`}
            </p>
            {product.description.length > 150 && (
              <button
                onClick={toggleDescription}
                className="text-emerald-600 text-sm font-medium mt-1 hover:underline"
              >
                {showFullDesc ? "Read Less" : "Read More"}
              </button>
            )}

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button className="bg-emerald-600 text-white px-6 py-2 rounded-xl hover:bg-emerald-700 transition active:scale-95">
                Add to Cart
              </button>
              <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-xl hover:bg-gray-300 transition active:scale-95">
                Buy Now
              </button>
              <button
                onClick={() => setLiked(!liked)}
                className={`px-6 py-2 rounded-xl transition active:scale-95 ${
                  liked
                    ? "bg-pink-500 text-white hover:bg-pink-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {liked ? "❤️ Liked" : "🤍 Like"}
              </button>
            </div>
          </div>

          {/* Seller Info */}
          <div className="mt-6 flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-emerald-100">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-16 h-16 rounded-full border-2 border-emerald-400"
            />
            <div>
              <p className="font-bold text-emerald-700">{seller.name}</p>
              <p className="text-gray-500 text-xs">{seller.location}</p>
              <p className="text-yellow-500 text-xs mt-1">
                ⭐ {seller.rating} ({seller.reviews} reviews)
              </p>
            </div>
            <button className="ml-auto bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition">
              Follow
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
        <h2 className="text-2xl font-bold text-emerald-700 mb-4">
          Product Reviews
        </h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 p-4 rounded-xl border border-emerald-100"
              >
                <p className="font-medium text-sm">{review.user}</p>
                <p className="text-yellow-500 text-xs mt-1">
                  ⭐ {review.rating}
                </p>
                <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {modalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-blue-100/40 flex items-center justify-center z-50">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-2xl font-bold"
          >
            ✕
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 text-white text-4xl font-bold"
          >
            &lt;
          </button>
          <img
            src={product.images[currentImage]}
            alt={product.name}
            className="max-h-[80vh] max-w-[80vw] object-contain rounded-2xl"
          />
          <button
            onClick={nextImage}
            className="absolute right-4 text-white text-4xl font-bold"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
