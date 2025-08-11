import { Toaster } from "@/components/ui/sonner";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Register from "./pages/Register";
import Login from "./pages/Login";
import { UserContext } from "./context/user-context";
import { useContext, useState, useEffect } from "react";

const App = () => {
  const { userInfo } = useContext(UserContext);
  const location = useLocation();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    setIsLoadingUser(false); // Resolve loading once userInfo is set
  }, [userInfo]);


  if (isLoadingUser) {
    return (
      <main className="flex flex-col px-5 items-center justify-center bg-[#C9CED6] dark:bg-[#0B101B] min-h-screen">
        <Navbar />
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
          <p>Loading user...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col px-5 items-center justify-center bg-[#C9CED6] dark:bg-[#0B101B] min-h-screen">
      <Navbar />
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            userInfo?.token ? (
              <Hero />
            ) : (
              <Navigate to="/login" state={{ from: location }} replace />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </main>
  );
};

export default App;