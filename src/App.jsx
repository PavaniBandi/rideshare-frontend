import { useState, useEffect } from 'react'
import './index.css'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import RiderDashboard from './pages/RiderDashboard.jsx'
import DriverDashboard from './pages/DriverDashboard.jsx'

function App() {
  const [role, setRole] = useState(localStorage.getItem('role')?.toLowerCase() || 'guest') // guest, rider, driver
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'rider', 'driver'

  // Handler for successful login
  const handleLogin = (data) => {
    setRole(data.role.toLowerCase());
    setShowAuth(false);
    setCurrentPage(data.role.toLowerCase());
  }

  // Handler for successful signup (optional: switch to login)
  const handleSignup = () => {
    setAuthMode('login');
  }

  // On role change, redirect to dashboard
  useEffect(() => {
    if (role === 'rider') setCurrentPage('rider');
    else if (role === 'driver') setCurrentPage('driver');
    else setCurrentPage('home');
  }, [role]);

  // Logout handler
  const handleLogout = () => {
    setRole('guest');
    setCurrentPage('home');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl"><span role="img" aria-label="car">🚗</span></span>
            <span className="font-bold text-xl">RideShare</span>
          </div>
          <nav className="space-x-8 hidden md:block">
            <a href="#home" className="hover:underline" onClick={() => setCurrentPage('home')}>Home</a>
            <a href="#services" className="hover:underline">Services</a>
            <a href="#about" className="hover:underline">About</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
          <div>
            {role === 'guest' ? (
              <button className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-blue-100" onClick={() => setShowAuth(true)}>Login / Signup</button>
            ) : (
              <button className="bg-white text-blue-600 px-4 py-2 rounded shadow hover:bg-blue-100" onClick={handleLogout}>Logout</button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        {currentPage === 'rider' ? (
          <RiderDashboard />
        ) : currentPage === 'driver' ? (
          <DriverDashboard />
        ) : (
          <>
            {/* Home Section */}
            <section id="home" className="py-20 flex flex-col items-center justify-center min-h-[80vh] w-full">
              <h1 className="text-4xl font-bold mb-8">Book Your Ride</h1>
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto">
                <p className="text-center text-gray-500">Please login to book a ride.</p>
              </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-16 bg-gray-100 w-full">
              <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>
              <div className="flex flex-wrap justify-center gap-6 w-full">
                {[
                  { title: 'Economy', desc: 'Affordable rides for everyday travel', features: ['Up to 4 passengers', 'Standard vehicles', 'Best value'], icon: '🚗' },
                  { title: 'Comfort', desc: 'Enhanced comfort with premium vehicles', features: ['Up to 4 passengers', 'Premium vehicles', 'Extra legroom'], icon: '🚙' },
                  { title: 'Premium', desc: 'Luxury rides for special occasions', features: ['Up to 4 passengers', 'Luxury vehicles', 'Professional drivers'], icon: '👑' },
                  { title: 'XL', desc: 'Spacious rides for groups', features: ['Up to 6 passengers', 'Large vehicles', 'Perfect for groups'], icon: '👥' },
                ].map((s) => (
                  <div key={s.title} className="bg-white rounded-xl shadow-md p-6 w-64 flex flex-col items-center">
                    <div className="text-4xl mb-2">{s.icon}</div>
                    <h3 className="font-bold text-xl mb-2">{s.title}</h3>
                    <p className="mb-2 text-center">{s.desc}</p>
                    <ul className="text-green-600 text-sm list-disc list-inside">
                      {s.features.map(f => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-16 w-full">
              <h2 className="text-3xl font-bold text-center mb-8">Why Choose RideShare?</h2>
              <div className="flex flex-wrap justify-center gap-10 w-full">
                {[
                  { title: 'Safe & Secure', icon: '🛡️' },
                  { title: '24/7 Availability', icon: '⏰' },
                  { title: 'Transparent', icon: '💲' },
                  { title: 'Top Rated', icon: '⭐' },
                ].map((item) => (
                  <div key={item.title} className="flex flex-col items-center w-40">
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-center">{item.title}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-gray-100 w-full">
              <h2 className="text-3xl font-bold text-center mb-8">Contact</h2>
              <div className="flex justify-center w-full">
                <form className="bg-white rounded-xl shadow-md p-8 w-full max-w-md space-y-4 mx-auto text-gray-900">
                  <input type="text" className="w-full border rounded px-3 py-2 bg-white text-gray-900" placeholder="Your Name" />
                  <input type="email" className="w-full border rounded px-3 py-2 bg-white text-gray-900" placeholder="Your Email" />
                  <textarea className="w-full border rounded px-3 py-2 bg-white text-gray-900" placeholder="Your Message" rows={4}></textarea>
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Send</button>
                </form>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <h2 className="text-2xl font-bold mb-4">{authMode === 'login' ? 'Login' : 'Sign Up'}</h2>
            <div className="flex gap-2 mb-4">
              <button
                className={`flex-1 py-2 rounded ${authMode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button
                className={`flex-1 py-2 rounded ${authMode === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'}`}
                onClick={() => setAuthMode('signup')}
              >
                Sign Up
              </button>
            </div>
            {authMode === 'login' ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Signup onSignup={handleSignup} />
            )}
            <button className="absolute top-2 right-2 text-gray-900 bg-white rounded-full w-8 h-8 flex items-center justify-center text-2xl" onClick={() => setShowAuth(false)}>&times;</button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-4 text-center mt-auto">
        &copy; {new Date().getFullYear()} RideShare. All rights reserved.
      </footer>
    </div>
  )
}

export default App
