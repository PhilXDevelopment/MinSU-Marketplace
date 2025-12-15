import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaUserPlus,
  FaArrowLeft,
  FaCreditCard,
  FaFlag,
} from "react-icons/fa";
import { useSocket } from "../../../../socketcontext";

interface User {
  firstname: string;
  lastname: string;
  avatar: string;
  userid: string;
}

export default function ViewProduct() {
  const socket = useSocket();
  const navigate = useNavigate();
  const { id } = useParams();
  const apiUrl = "http://localhost:3000/";

  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);

  const descRef = useRef<HTMLDivElement>(null);

  // Toggle Description
  const toggleDescription = () => setShowFullDesc(!showFullDesc);

  // Image Modal
  const openModal = (index: number) => {
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

  // Fetch Product and Seller
  const fetchProduct = async () => {
    try {
      const res = await axios.post(`${apiUrl}api/user-product/viewproduct`, {
        productid: id,
        userid: user?.userid,
      });

      const imagesWithFolder = res.data.product.images.map(
        (img: string) =>
          `uploads/product_images/${img.split("/").pop()?.replace(/\\/g, "/")}`
      );

      const productData = {
        ...res.data.product,
        images: imagesWithFolder,
        in_cart: res.data.product.in_cart || 0,
        in_liked: res.data.product.in_liked || 0,
      };
      setProduct(productData);
      console.log(productData);
      console.log(user?.userid);

      const sellerData = res.data.seller;
      setSeller({
        userid: sellerData.userid,
        avatar: `${sellerData.avatar}`,
        firstname: sellerData.firstname,
        lastname: sellerData.lastname,
        location: "Philippines",
        rating: 4.9,
        reviews: 120,
      });

      if (user?.userid !== sellerData.userid) {
        const followRes = await axios.post(`${apiUrl}api/user/follow-status`, {
          userid: user?.userid,
          followingid: sellerData.userid,
        });
        setIsFollowing(followRes.data.isFollowing);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Cart, Buy, Like, Follow actions
  const handleAddToCart = async () => {
    if (!user) {
      navigate("/auth/signin");
    }
    console.log(user);
    console.log(product.productid);
    try {
      const res = await axios.post(`${apiUrl}api/user-product/addtocart`, {
        productid: product.productid,
        userid: user?.userid,
      });
      setProduct((prev: any) => ({ ...prev, in_cart: res.data.in_cart }));
    } catch (error) {
      console.error(error);
    }
  };
  const handleBuyNow = () => {
    navigate(`/marketplace/checkout-order/${product.productid}`);
  };
  const handleLike = async () => {
    if (!user) {
      navigate("/auth/signin");
    }
    try {
      const res = await axios.post(`${apiUrl}api/user-product/likedproduct`, {
        productid: product.productid,
        userid: user?.userid,
      });
      setProduct((prev: any) => ({ ...prev, in_liked: res.data.in_liked }));
    } catch (error) {
      console.error(error);
    }
  };
  const toggleFollow = async () => {
    if (!user) {
      navigate("/auth/signin");
    }
    try {
      const res = await axios.post(`${apiUrl}api/user/toggle-follow`, {
        userid: user?.userid,
        followingid: seller.userid,
      });
      setIsFollowing(res.data.isFollowing);
    } catch (error) {
      console.error(error);
    }
  };

  // Check overflow for description
  useEffect(() => {
    if (descRef.current) {
      setIsOverflowing(
        descRef.current.scrollHeight > descRef.current.clientHeight
      );
    }
  }, [product, showFullDesc]);

  useEffect(() => {
    document.title = "Marketplace";
    fetchProduct();
    const refreshview = () => {
      fetchProduct();
    };
    if (!socket) return;
    socket.on("product_update", refreshview);
    return () => {
      socket.off("product_update");
    };
  }, [socket]);

  if (!product || !seller) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-700 text-xl">
        Loading product...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 p-4 pb-20 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-2 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="hover:underline flex items-center gap-1"
        >
          <FaArrowLeft /> Back
        </button>
        / <span className="text-gray-700 font-medium">{product.name}</span>
      </nav>

      {/* Product Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 flex flex-col lg:flex-row gap-6 relative">
        {/* 3-dot Report Button at top right */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowReportMenu((prev) => !prev)}
            className="px-3 py-1 rounded-full text-gray-500 hover:bg-gray-200 transition"
          >
            ⋮
          </button>
          {showReportMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-md border border-gray-200 z-10">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => alert("Reported")}
              >
                <FaFlag /> Report
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => alert("Inappropriate")}
              >
                <FaFlag /> Inappropriate
              </button>
            </div>
          )}
        </div>

        {/* Images */}
        <div className="w-full lg:w-1/2 space-y-3">
          <div
            className="bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer h-96"
            onClick={() => openModal(currentImage)}
          >
            <img
              src={`${apiUrl}${product.images[currentImage]}`}
              alt={`product-${currentImage}`}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {product.images.map((img: string, index: number) => (
              <img
                key={index}
                src={`${apiUrl}${img}`}
                onClick={() => setCurrentImage(index)}
                className={`w-20 h-20 rounded-lg object-cover cursor-pointer border ${
                  index === currentImage
                    ? "border-emerald-600"
                    : "border-gray-300"
                }`}
                alt={`thumb-${index}`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between relative">
          <div>
            <h1 className="text-3xl font-bold text-emerald-700">
              {product.name}
            </h1>
            <p className="text-emerald-700 font-bold text-2xl mt-2">
              ₱{product.price}
            </p>

            {/* Description */}
            <div
              ref={descRef}
              className={`mt-4 text-gray-600 overflow-hidden transition-all ${
                showFullDesc ? "max-h-full" : "max-h-24"
              }`}
            >
              {product.description}
            </div>
            {isOverflowing && (
              <button
                onClick={toggleDescription}
                className="mt-1 text-emerald-600 text-sm font-medium hover:underline flex items-center gap-1"
              >
                {showFullDesc ? "See Less" : "See More"}
              </button>
            )}
          </div>

          {/* Buttons fixed at bottom of card */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-gray-100 pt-4">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleAddToCart}
                className={`px-6 py-2 rounded-xl transition active:scale-95 flex items-center gap-2 ${
                  product.in_cart === 1
                    ? "bg-gray-400 text-white hover:bg-gray-500"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                <FaShoppingCart /> {product.in_cart === 1 ? "Remove" : "Add"}{" "}
                Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-xl hover:bg-gray-300 transition active:scale-95 flex items-center gap-2"
              >
                <FaCreditCard /> Buy Now
              </button>

              <button
                onClick={handleLike}
                className={`px-6 py-2 rounded-xl transition active:scale-95 flex items-center gap-2 ${
                  product.in_liked === 1
                    ? "bg-pink-500 text-white hover:bg-pink-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                <FaHeart /> {product.in_liked === 1 ? "Liked" : "Like"}
              </button>
            </div>
          </div>

          {/* Seller Info */}
          <div className="mt-6 flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-emerald-100">
            <img
              src={`${apiUrl}uploads/avatars/${seller.avatar}`}
              alt={`${seller.firstname} ${seller.lastname}`}
              className="w-16 h-16 rounded-full border-2 border-emerald-400"
            />
            <div>
              <p
                onClick={() => navigate(`/marketplace/store/${seller.userid}`)}
                className="font-bold text-emerald-700 cursor-pointer"
              >
                {seller.firstname} {seller.lastname}
              </p>
              <p className="text-gray-500 text-xs">{seller.location}</p>
              <p className="text-yellow-500 text-xs mt-1 flex items-center gap-1">
                <FaStar /> {seller.rating} ({seller.reviews} reviews)
              </p>
            </div>

            {/* Follow Button */}
            {user?.userid !== seller.userid && (
              <button
                onClick={toggleFollow}
                className={`ml-auto px-4 py-2 rounded-lg font-medium text-white transition flex items-center gap-1 ${
                  isFollowing
                    ? "bg-gray-400 hover:bg-gray-500"
                    : "bg-emerald-500 hover:bg-emerald-600"
                }`}
              >
                <FaUserPlus /> {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 space-y-4">
        <h2 className="text-2xl font-bold text-emerald-700 mb-2">
          Product Reviews
        </h2>

        {/* Sample Reviews */}
        {[
          {
            name: "John D.",
            rating: 5,
            comment: "Excellent product! Highly recommended.",
          },
          {
            name: "Mary S.",
            rating: 4,
            comment: "Good quality, fast delivery.",
          },
          {
            name: "Alex P.",
            rating: 5,
            comment: "Exactly as described. Will buy again!",
          },
        ].map((review, idx) => (
          <div key={idx} className="p-3 border rounded-lg bg-gray-50">
            <p className="font-bold text-emerald-700">{review.name}</p>
            <p className="text-yellow-500 text-sm">
              {"⭐".repeat(review.rating)}
            </p>
            <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
            src={`${apiUrl}${product.images[currentImage]}`}
            alt={`product-${currentImage}`}
            className="max-h-[80vh] max-w-[80vw] object-contain rounded-xl"
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
