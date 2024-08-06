import React, { useState, useEffect } from "react";
import axios from "axios";

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users");
        setUsers(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main>
      <div className="w-full mt-20 flex flex-col gap-14 justify-center items-center">
        <div className="w-full justify-center flex">
          <h1 className="font-bold text-blue-600 text-4xl">Team Members</h1>
        </div>

        <ul className="flex flex-col gap-4">
          {users.map((user) => (
            <div className="w-[200px] h-[90px] rounded-md bg-slate-700 flex justify-center items-center">
              <li key={user._id} className="text-white font-bold">
                {user.username}
              </li>
            </div>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default Team;
