import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = (setIsLoggedIn) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally verify token validity with API here
      setIsLoggedIn(true);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate, setIsLoggedIn]);
};

export default useAuth;
