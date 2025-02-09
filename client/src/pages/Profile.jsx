import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { signInSuccess } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const res = await axios.put(
        `/api/user/update`,
        formData,
        { withCredentials: true } // Ensure cookies are sent
      );

      dispatch(signInSuccess(res.data)); // Update Redux state
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  // Handle Account Deletion
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/user/delete/${currentUser._id}`);
      navigate("/sign-in");
    } catch (error) {
      setError("Failed to delete account", error);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    dispatch(signInSuccess(null)); // Reset Redux State
    navigate("/sign-in");
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover self-start mt-2"
        />
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="New Password (Optional)"
          id="password"
          className="border p-3 rounded-lg"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDelete}>
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleLogout}>
          Sign Out
        </span>
      </div>
    </div>
  );
};

export default Profile;
