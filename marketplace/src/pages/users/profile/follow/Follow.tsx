import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Follow() {
  const navigate = useNavigate();
  return (
    <div className="">
      <nav className="text-sm text-gray-500 mb-2 flex items-center gap-2">
        <button
          onClick={() => navigate("/")}
          className="hover:underline flex items-center gap-1"
        >
          <FaArrowLeft /> Back
        </button>
      </nav>
      <p>Hi</p>
    </div>
  );
}
