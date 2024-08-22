import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Traningproduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // Change to null for file input
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Set the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const response = await axios.post(
        "https://backend-uhub.onrender.com/api/admin/traningproduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      setError("");
      setName("");
      setDescription("");
      setImage(null);
      setPrice("");
      // Set a timeout to clear the input fields and redirect after 5 seconds
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 3000);
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Training Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="image">
            Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="price">
            Price
          </label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default Traningproduct;
