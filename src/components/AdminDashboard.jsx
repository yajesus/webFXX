import React from "react";
import { Link } from "react-router-dom";
const AdminDashboard = () => {
  return (
    <div>
      <div className="w-full flex justify-center">
        <p className="text-4xl text-blue-600 font-bold mt-6">Admin DashBoard</p>
      </div>
      <main>
        <div className="w-full  grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 mt-7 gap-y-10 items-center justify-center">
          <div className="w-[350px] h-[200px] divsize bg-blue-500 flex items-center justify-center">
            <Link
              class=" text-white hover:underline font-bold text-3xl"
              to="/admin/dashboard/addevent"
            >
              Add Event
            </Link>
          </div>
          <div className="w-[350px] h-[200px] divsize bg-blue-500 flex items-center justify-center">
            <Link
              class=" text-white hover:underline font-bold text-3xl"
              to="/admin/dashboard/addproduct"
            >
              Add Product
            </Link>
          </div>
          <div className="w-[350px] h-[200px] divsize bg-blue-500 flex items-center justify-center">
            <Link
              class=" text-white hover:underline font-bold text-3xl"
              to="/admin/dashboard/edituserbalance"
            >
              Edit User Balance
            </Link>
          </div>
          <div className="w-[350px] h-[200px] divsize bg-blue-500 flex items-center justify-center">
            <Link class=" text-white hover:underline font-bold text-3xl">
              Approve Withdrawal
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
