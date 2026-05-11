import { useState } from "react";
import { EMPTY_ROBOT_FORM } from "../utils/Constant";
import { STATUS_OPTIONS } from "../utils/Constant";
import useCreateRobot from "../hooks/useCreateRobot.js";


const CreateRobotModal = ({ onClose, onCreated }) => {

  const createRobot = useCreateRobot();

  const [form, setForm] = useState(EMPTY_ROBOT_FORM);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "battery" || name === "uptime"
        ? Number(value)   
        : value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: name === "lat" || name === "lng"
          ? Number(value)
          : value,
      },
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const newRobot = await createRobot(form);

    onCreated(newRobot);
    onClose();
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
 
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
 
      <div
        className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-8 w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-bold">Add New Robot</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-xl transition-colors"
          >
            x
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs font-mono mb-1 block">
                ROBOT ID
              </label>
              <input
                name="id"
                value={form.id}
                onChange={handleChange}
                placeholder="RBT-011"
                required
                className="w-full bg-[#0f0f1a] border border-[#2a2a3e] text-white text-sm px-3 py-2.5 rounded-lg outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-700"
              />
            </div>
            <div>
              <label className="text-gray-500 text-xs font-mono mb-1 block">
                NAME
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Lambda-11"
                required
                className="w-full bg-[#0f0f1a] border border-[#2a2a3e] text-white text-sm px-3 py-2.5 rounded-lg outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs font-mono mb-1 block">
                STATUS
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-[#0f0f1a] border border-[#2a2a3e] text-white text-sm px-3 py-2.5 rounded-lg outline-none focus:border-indigo-500 transition-colors"
                >
                {STATUS_OPTIONS.map(option => (
                    <option
                    key={option.value}
                    value={option.value}
                    >
                    {option.label}
                    </option>
                ))}
                </select>
            </div>
            <div>
              <label className="text-gray-500 text-xs font-mono mb-1 block">
                BATTERY %
              </label>
              <input
                name="battery"
                type="number"
                min="0"
                max="100"
                value={form.battery}
                onChange={handleChange}
                required
                className="w-full bg-[#0f0f1a] border border-[#2a2a3e] text-white text-sm px-3 py-2.5 rounded-lg outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-500 text-xs font-mono mb-1 block">
              CURRENT TASK
            </label>
            <input
              name="task"
              value={form.task}
              onChange={handleChange}
              placeholder="Patrolling Zone B"
              required
              className="w-full bg-[#0f0f1a] border border-[#2a2a3e] text-white text-sm px-3 py-2.5 rounded-lg outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-700"
            />
          </div>

          <div>
            <label className="text-gray-500 text-xs font-mono mb-1 block">
              LOCATION LABEL
            </label>
            <input
              name="label"
              value={form.location.label}
              onChange={handleLocationChange}
              placeholder="Warehouse Delhi-C"
              required
              className="w-full bg-[#0f0f1a] border border-[#2a2a3e] text-white text-sm px-3 py-2.5 rounded-lg outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs font-mono mb-1 block">
                LATITUDE
              </label>
              <input
                name="lat"
                type="number"
                step="any"
                value={form.location.lat}
                onChange={handleLocationChange}
                required
                className="w-full bg-[#0f0f1a] border border-[#2a2a3e] text-white text-sm px-3 py-2.5 rounded-lg outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-gray-500 text-xs font-mono mb-1 block">
                LONGITUDE
              </label>
              <input
                name="lng"
                type="number"
                step="any"
                value={form.location.lng}
                onChange={handleLocationChange}
                required
                className="w-full bg-[#0f0f1a] border border-[#2a2a3e] text-white text-sm px-3 py-2.5 rounded-lg outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors duration-150 mt-2"
          >
            {loading ? "Creating..." : "Create Robot"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateRobotModal;
