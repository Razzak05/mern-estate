import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signInSuccess,
} from "../redux/user/userSlice.js";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: "",
    avatar: currentUser.avatar,
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentUser.avatar);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      setUpdateSuccess(false);

      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }
      if (file) {
        formDataToSend.append("avatar", file);
      }

      const res = await axios.put("/api/user/update", formDataToSend, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data) {
        dispatch(updateUserSuccess(res.data));
        setFile(null);
        setUpdateSuccess(true);
        // Reset success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      }
    } catch (error) {
      dispatch(
        updateUserFailure(
          error.response?.data?.message || "Something went wrong"
        )
      );
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/user/delete`);
      dispatch(signInSuccess(null));
      navigate("/sign-in");
    } catch (error) {
      dispatch(updateUserFailure("Failed to delete account: " + error.message));
    }
  };

  const handleLogout = () => {
    dispatch(signInSuccess(null));
    navigate("/sign-in");
  };

  return (
    <div className="max-w-[500px] mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center">
          <label htmlFor="avatar" className="cursor-pointer">
            <img
              src={preview}
              alt="profile"
              className="rounded-full h-24 w-24 object-cover mt-2"
            />
          </label>
          {updateSuccess && (
            <p className="text-green-700 mt-2">Profile updated successfully!</p>
          )}
        </div>

        <input
          type="file"
          id="avatar"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
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
