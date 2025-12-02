import React, { useState, useEffect } from "react";
import * as Facade from "../Facade.js"; // adjust path if needed

export default function Budget({ username, accountName, spent }) {
  const [currentBudget, setCurrentBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [tempBudget, setTempBudget] = useState("");

  // ------------------------------
  // 1. Fetch budget from server
  // ------------------------------
  useEffect(() => {
    async function fetchBudget() {
      try {
        const response = await Facade.getBudget(username, null, accountName);

        if (response && response.budget !== undefined) {
          setCurrentBudget(Number(response.budget));
          setTempBudget(Number(response.budget));
        }
      } catch (err) {
        console.error("Error fetching budget:", err);
      }
      setLoading(false);
    }

    fetchBudget();
  }, [username, accountName]);

  // ------------------------------
  // 2. Save budget to server
  // ------------------------------
  async function handleSave() {
    if (isNaN(tempBudget) || Number(tempBudget) <= 0) return;

    try {
      const response = await Facade.setBudget(username, accountName, Number(tempBudget));

      if (response.status === 1) {
        setCurrentBudget(Number(tempBudget));
        setShowModal(false);
      } else {
        alert("Error saving budget.");
      }
    } catch (err) {
      console.error("Budget save error:", err);
    }
  }

  // ------------------------------
  // 3. Styling & Conditional Colors
  // ------------------------------
  let bgColor = "border-green-400";
  const percent = currentBudget > 0 ? spent / currentBudget : 0;

  if (percent >= 1) bgColor = "border-red-400";
  else if (percent >= 0.75) bgColor = "border-yellow-400";

  if (loading) {
    return (
      <div className="p-4 rounded-xl border shadow-md">
        <p>Loading budget...</p>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-xl border ${bgColor} shadow-md`}
      style={{ backgroundColor: "rgba(255,255,255,0.4)", backdropFilter: "blur(8px)" }}
    >
      <h2 className="text-lg font-semibold mb-2 text-gray-800">
        Monthly Budget — {accountName}
      </h2>

      <p className="text-2xl font-bold text-gray-900">
        ${spent.toLocaleString()}
      </p>
      <p className="text-sm text-gray-700 mb-4">
        of ${currentBudget.toLocaleString()} budget
      </p>

      <button onClick={() => setShowModal(true)} className="btn-green">
        Change Budget Amount
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Change Budget</h3>
            <input
              type="number"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              className="input-field w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="btn-purple">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-green">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
