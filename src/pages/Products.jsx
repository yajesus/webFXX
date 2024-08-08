import React, { useState, useEffect } from "react";
import axios from "axios";
const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("your token", token);
        const response = await axios
          .get("http://localhost:5000/api/products", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            console.log(response);
            setProducts(response.data);
          });
      } catch (err) {
        setError("Error fetching products");
        console.error(err);
      }
    };

    fetchProducts();
  }, []);
  return (
    <div>
      <div className="w-full flex  mt-20">
        <p className="text-4xl text-blue-600 font-bold ml-8">Boost Mission</p>
      </div>
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded">
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p>{product.description}</p>
            {product.image && (
              <img
                src={`http://localhost:5000/${product.image}`}
                alt={product.name}
              />
            )}
            <p>Price: ${product.price}</p>
            <p>Profit: ${product.profit}</p>
            <p>Premium: {product.isPremium ? "Yes" : "No"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
