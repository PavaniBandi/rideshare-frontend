import { useState, useEffect } from "react";
import { apiRequest } from "../api.jsx";

export default function RideStatus({ ride, onComplete }) {
  const [currentRide, setCurrentRide] = useState(ride);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setCurrentRide(ride);
    if (!ride) return;
    const fetchStatus = async () => {
      try {
        const data = await apiRequest(
          `/rides/status/${ride.id}`,
          "GET",
          null,
          token
        );
        console.log(
          "Polled ride status for ID:",
          ride.id,
          "Status:",
          data.status
        );
        setCurrentRide(data);
      } catch (err) {
        console.log("Error polling ride status:", err);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [ride]);

  useEffect(() => {
    if (currentRide && currentRide.status === "COMPLETED") {
      console.log("Ride completed, calling onComplete");
      onComplete && onComplete();
    }
  }, [currentRide, onComplete]);

  if (!currentRide) return null;
  // Ride status steps for progress bar
  const statusSteps = [
    { key: 'REQUESTED', label: 'Requested', icon: '📝' },
    { key: 'ACCEPTED', label: 'Accepted', icon: '✅' },
    { key: 'PICKED', label: 'Picked', icon: '🚗' },
    { key: 'COMPLETED', label: 'Completed', icon: '🏁' },
  ];
  const currentStepIdx = statusSteps.findIndex(s => s.key === currentRide.status);
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 mb-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-800">
        <span>🚕</span> Current Ride Status
      </h2>
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-6">
        {statusSteps.map((step, idx) => (
          <div key={step.key} className="flex-1 flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold border-2 ${
              idx < currentStepIdx ? 'bg-green-400 border-green-400 text-white' :
              idx === currentStepIdx ? 'bg-blue-600 border-blue-600 text-white animate-pulse' :
              'bg-gray-200 border-gray-300 text-gray-400'
            }`}>
              {step.icon}
            </div>
            <span className={`mt-2 text-xs font-semibold ${idx <= currentStepIdx ? 'text-blue-800' : 'text-gray-400'}`}>{step.label}</span>
            {idx < statusSteps.length - 1 && (
              <div className={`w-8 h-1 ${idx < currentStepIdx ? 'bg-green-400' : 'bg-gray-200'} mx-auto`}></div>
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-lg">
          <span className="text-blue-600">📍</span>
          <span>Pickup: <span className="font-semibold">{currentRide.pickupLocation}</span></span>
        </div>
        <div className="flex items-center gap-2 text-lg">
          <span className="text-green-600">🏁</span>
          <span>Drop: <span className="font-semibold">{currentRide.dropLocation}</span></span>
        </div>
        <div className="flex items-center gap-2 text-lg">
          <span className="text-yellow-600">💸</span>
          <span>Fare: <span className="font-semibold">₹{currentRide.fare}</span></span>
        </div>
        <div className="flex items-center gap-2 text-lg">
          <span className="text-purple-600">🔖</span>
          <span>Status: <span className={`font-semibold px-2 py-1 rounded-full ${
            currentRide.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
            currentRide.status === 'PICKED' ? 'bg-yellow-100 text-yellow-700' :
            currentRide.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-200 text-gray-700'
          }`}>{currentRide.status}</span></span>
        </div>
        {currentRide.driver && (
          <div className="flex items-center gap-2 text-lg col-span-2">
            <span className="text-pink-600">🧑‍✈️</span>
            <span>Driver: <span className="font-semibold">{currentRide.driver.name || 'Assigned'}</span></span>
          </div>
        )}
      </div>
    </div>
  );
}
