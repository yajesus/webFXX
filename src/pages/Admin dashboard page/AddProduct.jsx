import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // Handle file upload
  const [price, setPrice] = useState("");
  const [profit, setProfit] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [visibleTo, setVisibleTo] = useState([]); // Adjusted to array
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const token = localStorage.getItem("adminToken");
  useEffect(() => {
    // Fetch all users on component mount
    const fetchUsers = async () => {
      try {
        const response = await axios
          .get("http://localhost:5000/users")
          .then((response) => setAllUsers(response.data));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleUserChange = (e) => {
    const { value, checked } = e.target;
    setSelectedUsers((prevSelected) =>
      checked
        ? [...prevSelected, value]
        : prevSelected.filter((id) => id !== value)
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("profit", profit);
    formData.append("isPremium", isPremium);
    const visibleTo = selectedUsers.includes("all")
      ? "all"
      : JSON.stringify(selectedUsers);
    formData.append("visibleTo", visibleTo); // Convert array to JSON string
    if (image) {
      formData.append("image", image); // Append image file
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/add-product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Product added successfully!");
      setError(""); // Clear error if any
      console.log(response.data);

      setTimeout(() => {
        setSuccess(""); // Clear success message after 5 seconds
      }, 5000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while adding the product."
      );
      setSuccess(""); // Clear success message if any
      console.error(err);

      setTimeout(() => {
        setError(""); // Clear error message after 5 seconds
      }, 5000);
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
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-2 border rounded"
            accept="image/*"
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
          <div className="flex flex-col gap-2">
            {allUsers.map((user) => (
              <label key={user._id} className="flex items-center">
                <input
                  type="checkbox"
                  value={user._id}
                  checked={selectedUsers.includes(user._id)}
                  onChange={handleUserChange}
                  className="mr-2"
                />
                {user.username} {/* Adjust field as per your User schema */}
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="checkbox"
                value="all"
                checked={selectedUsers.includes("all")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedUsers(["all"]);
                  } else {
                    setSelectedUsers([]);
                  }
                }}
                className="mr-2"
              />
              All Users
            </label>
          </div>
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
