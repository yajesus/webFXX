import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  // State for form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // Changed to handle file
  const [price, setPrice] = useState("");
  const [profit, setProfit] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [visibleTo, setVisibleTo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("adminToken");
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("profit", profit);
    formData.append("isPremium", isPremium);
    formData.append("visibleTo", visibleTo);
    if (image) {
      formData.append("image", image); // Append image file
    }

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.log("there is no token");
      } else {
        console.log("there is token");
      }
      const response = await axios.post(
        "http://localhost:5000/api/admin/add-product", // Replace with your API endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`, // Set header for file upload
          },
        }
      );

      // Handle success
      setSuccess("Product added successfully!");
      setError(""); // Clear error if any
      console.log(response.data);
    } catch (err) {
      // Handle error
      setError("An error occurred while adding the product.");
      setSuccess(""); // Clear success message if any
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <div>
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])} // Update image state
            className="w-full p-2 border rounded"
            accept="image/*" // Accept only image files
            required
          />
        </div>

        <div>
          <label className="block mb-2">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Profit:</label>
          <input
            type="number"
            value={profit}
            onChange={(e) => setProfit(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Is Premium:</label>
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="mr-2"
          />
        </div>

        <div>
          <label className="block mb-2">Visible To:</label>
          <select
            value={visibleTo}
            onChange={(e) => setVisibleTo(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select user group</option>
            <option value="all">All Users</option>
            <option value="registered">Registered Users</option>
            <option value="premium">Premium Users</option>
            {/* Add more options as needed */}
          </select>
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
