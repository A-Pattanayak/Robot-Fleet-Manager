import { useState } from "react";
import { CITY_OPTIONS, EMPTY_ROBOT_FORM } from "../utils/Constant";
import useCreateRobot from "../hooks/useCreateRobot";


const CreateRobotModal = ({ onClose, onCreated }) => {

  const createRobot = useCreateRobot();

  const [form, setForm] = useState(EMPTY_ROBOT_FORM);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 sm:p-4"
      onClick={onClose}
    >
 
      <div
        className="max-h-[calc(100vh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-xl sm:max-h-[calc(100vh-2rem)] sm:p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-orange-500">AUTOMATA Unit</p>
            <h2 className="text-lg font-bold text-white sm:text-xl">Add New Robot</h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-md px-2 py-1 text-xl text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            x
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-400">
                ROBOT ID
              </label>
              <input
                name="id"
                value={form.id}
                onChange={handleChange}
                placeholder="RBT-011"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-zinc-400">
                NAME
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Lambda-11"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-400">
              CURRENT TASK
            </label>
            <input
              name="task"
              value={form.task}
              onChange={handleChange}
              placeholder="Patrolling Zone B"
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-zinc-400">
              REGISTERED CITY
            </label>
            <select
              name="cityId"
              value={form.cityId}
              onChange={handleChange}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-orange-500"
              required
            >
              {CITY_OPTIONS.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-orange-600 py-3 font-semibold text-white transition-colors duration-150 hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            {loading ? "Creating..." : "Create Robot"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateRobotModal;
