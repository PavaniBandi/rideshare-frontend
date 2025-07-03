import { useState, useEffect } from "react";
import "./index.css";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import RiderDashboard from "./pages/RiderDashboard.jsx";
import DriverDashboard from "./pages/DriverDashboard.jsx";
import rapido from './assets/rapido.png';
import img1 from './assets/1.png';
import img2 from './assets/2.png';

function App() {
  const [role, setRole] = useState(
    localStorage.getItem("role")?.toLowerCase() || "guest"
  ); // guest, rider, driver
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
  const [currentPage, setCurrentPage] = useState("home"); // 'home', 'rider', 'driver'

  // Handler for successful login
  const handleLogin = (data) => {
    setRole(data.role.toLowerCase());
    setShowAuth(false);
    setCurrentPage(data.role.toLowerCase());
  };

  // Handler for successful signup (optional: switch to login)
  const handleSignup = () => {
    setAuthMode("login");
  };

  // On role change, redirect to dashboard
  useEffect(() => {
    if (role === "rider") setCurrentPage("rider");
    else if (role === "driver") setCurrentPage("driver");
    else setCurrentPage("home");
  }, [role]);

  // Logout handler
  const handleLogout = () => {
    setRole("guest");
    setCurrentPage("home");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {/* <span role="img" aria-label="car"> */}
              🚗
              {/* </span> */}
            </span>
            <span className="font-bold text-xl">RideShare</span>
          </div>
          <div>
            {role === "guest" ? (
              <button
                className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-blue-100"
                onClick={() => setShowAuth(true)}
              >
                Login / Signup
              </button>
            ) : (
              <button
                className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-blue-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        {currentPage === "rider" ? (
          <RiderDashboard />
        ) : currentPage === "driver" ? (
          <DriverDashboard />
        ) : (
          <>
            {/* Home Section (now Quick Rides, Low Fares) */}
            <section className="py-16 w-full bg-gray-100 flex flex-col md:flex-row items-center justify-center gap-12">
              <div className="flex-1 flex flex-col justify-center items-start max-w-xl px-6">
                <h2 className="text-4xl font-bold mb-2 text-gray-900">
                  Get Quick Rides,<br />
                  <span className="inline-block border-b-4 border-yellow-400 pb-1">Low Fares</span>
                </h2>
                <p className="text-xl text-gray-700 mb-8 mt-4">
                  In Rapido we ensure our customers get rides quickly at the most affordable prices.
                </p>
                <button className="bg-gray-900 text-white text-lg font-semibold px-8 py-3 rounded-full flex items-center gap-2 shadow hover:bg-gray-800 transition">
                  Book a ride <span className="ml-2">&rarr;</span>
                </button>
              </div>
              <div className="flex-1 flex justify-center items-center max-w-lg px-6">
                <img src={img1} alt="Service Collage" className="rounded-2xl object-cover w-full h-80" />
              </div>
            </section>

            {/* About Section (now Safety for all) */}
            <section className="py-16 w-full bg-white flex flex-col md:flex-row items-center justify-center gap-12">
              <div className="flex-1 flex justify-center items-center max-w-lg px-6 order-1 md:order-none">
                <img src={img2} alt="Safety for all" className="rounded-2xl object-cover w-full h-80" />
              </div>
              <div className="flex-1 flex flex-col justify-center items-start max-w-xl px-6 order-2 md:order-none">
                <h1 className="text-4xl font-bold mb-4 text-gray-900">
                  Safety for all
                  <div className="w-16 h-1 bg-yellow-400 mt-2 mb-4"></div>
                </h1>
                <p className="text-xl text-gray-700 mb-8">
                  At Rapido, your safety is our priority. We're dedicated to making every ride safe and comfortable.
                </p>
                <a
                  href="#"
                  className="text-blue-700 text-lg font-semibold hover:underline flex items-center"
                >
                  Know More <span className="ml-1">&gt;</span>
                </a>
              </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-16 bg-gray-100 w-full">
              <h2 className="text-3xl font-bold text-center mb-10">
                Our Services
              </h2>
              <div className="flex flex-wrap justify-center gap-6 w-full">
                {[
                  {
                    title: "Economy",
                    desc: "Affordable rides for everyday travel",
                    features: [
                      "Up to 4 passengers",
                      "Standard vehicles",
                      "Best value",
                    ],
                    icon: "🚗",
                  },
                  {
                    title: "Comfort",
                    desc: "Enhanced comfort with premium vehicles",
                    features: [
                      "Up to 4 passengers",
                      "Premium vehicles",
                      "Extra legroom",
                    ],
                    icon: "🚙",
                  },
                  {
                    title: "Premium",
                    desc: "Luxury rides for special occasions",
                    features: [
                      "Up to 4 passengers",
                      "Luxury vehicles",
                      "Professional drivers",
                    ],
                    icon: "👑",
                  },
                  {
                    title: "XL",
                    desc: "Spacious rides for groups",
                    features: [
                      "Up to 6 passengers",
                      "Large vehicles",
                      "Perfect for groups",
                    ],
                    icon: "👥",
                  },
                ].map((s) => (
                  <div
                    key={s.title}
                    className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center"
                  >
                    <div className="text-4xl mb-2">{s.icon}</div>
                    <h3 className="font-bold text-xl mb-2">{s.title}</h3>
                    <p className="mb-2 text-center">{s.desc}</p>
                    <ul className="text-green-600 text-sm list-disc list-inside">
                      {s.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Download Now Section (replaces Contact) */}
            <section className="py-16 bg-black w-full">
              <h2 className="text-3xl font-bold text-center mb-8 text-white">
                Download Now
              </h2>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 w-full">
                <div className="flex flex-col items-center">
                  <img src={rapido} alt="Rapido App" className="w-20 h-20 mb-4 rounded-lg shadow" />
                  <div className="text-white text-center font-semibold">Rapido: Bike-Taxi,<br/>Auto & Cabs</div>
                </div>
                <div className="flex flex-col items-center">
                  <img src={rapido} alt="Rapido Captain" className="w-20 h-20 mb-4 rounded-lg shadow border border-gray-300" />
                  <div className="text-white text-center font-semibold">Rapido Captain:<br/>Drive & Earn</div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <h2 className="text-2xl font-bold mb-4">
              {authMode === "login" ? "Login" : "Sign Up"}
            </h2>
            <div className="flex gap-2 mb-4">
              <button
                className={`flex-1 py-2 rounded ${
                  authMode === "login"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
              <button
                className={`flex-1 py-2 rounded ${
                  authMode === "signup"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
                onClick={() => setAuthMode("signup")}
              >
                Sign Up
              </button>
            </div>
            {authMode === "login" ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Signup onSignup={handleSignup} />
            )}
            <button
              className="absolute top-2 right-2 text-gray-900 bg-white rounded-full w-8 h-8 flex items-center justify-center text-2xl"
              onClick={() => setShowAuth(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 text-center mt-auto">
        &copy; {new Date().getFullYear()} RideShare. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
