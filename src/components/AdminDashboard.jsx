import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      <div className="w-full flex justify-center">
        <p className="text-4xl text-blue-600 font-bold mt-6">Admin Dashboard</p>
      </div>
      <main>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-7 justify-items-center md:justify-items-start md:ml-4">
          <div className="w-[300px] h-[150px] bg-blue-500 flex items-center justify-center rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
            <Link
              className="text-white hover:underline font-bold text-2xl"
              to="/admin/dashboard/addevent"
            >
              Add Event
            </Link>
          </div>
          <div className="w-[300px] h-[150px] bg-blue-500 flex items-center justify-center rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
            <Link
              className="text-white hover:underline font-bold text-2xl"
              to="/admin/dashboard/addproduct"
            >
              Add Product
            </Link>
          </div>
          <div className="w-[300px] h-[150px] bg-blue-500 flex items-center justify-center rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
            <Link
              className="text-white hover:underline font-bold text-2xl"
              to="/admin/dashboard/edituserbalance"
            >
              Edit User Balance
            </Link>
          </div>
          <div className="w-[300px] h-[150px] bg-blue-500 flex items-center justify-center rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
            <Link
              className="text-white hover:underline font-bold text-2xl"
              to="/admin/dashboard/Approvewithdrwal"
            >
              Approve Withdrawal
            </Link>
          </div>
          <div className="w-[300px] h-[150px] bg-blue-500 flex items-center justify-center rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
            <Link
              className="text-white hover:underline font-bold text-2xl"
              to="/admin/dashboard/generatecode"
            >
              Generate Invite Code
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
