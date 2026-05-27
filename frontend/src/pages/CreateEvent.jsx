import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { createEvent } from "../features/events/eventThunk";
import { useNavigate } from "react-router-dom";
import heroCreateImage from "../assests/hero_createEvent.png";
import { SquarePen } from "lucide-react";

export default function CreateEvent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, events } = useSelector((state) => state.event);
  const [localError, setLocalError] = useState();
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_start: "",
    duration: "",
    max_participants: "",
    place_name: "",
    latitude: "",
    longitude: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    const now = new Date();
    const event_start = new Date(form.event_start);

    if (!form.event_start) {
      return setLocalError("You must fill in start date");
    }
    if (event_start < now) {
      return setLocalError("Start date of event cannot be in the past");
    }
    if (!form.title) {
      return setLocalError("You must fill in title");
    }
    if (!form.description) {
      return setLocalError("You must fill in description");
    }
    if (!form.duration) {
      return setLocalError("You must fill in duration");
    }
    if (!form.max_participants) {
      return setLocalError("You must set limit of participant");
    }

    if (form.max_participants <= 0) {
      return setLocalError("The number of people cannot be a nagative");
    }
    if (!form.place_name) {
      return setLocalError("You must fill in location name");
    }

    try {
      const result = await dispatch(createEvent(form)).unwrap();
      navigate(`/event/${result.event.id}`);
      setLocalError("");
    } catch (error) {
      setLocalError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create event",
      );
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => setLocalError(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [localError]);
  return (
    <>
      <div
        className="relative rounded-xl overflow-hidden mb-10 h-[320px]"
        style={{
          backgroundImage: `url(${heroCreateImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent">
          <div className="relative z-10 flex h-full items-center px-10">
            <div className="max-w-xl">
              <h2 className="text-5xl font-bold text-primary mb-10 ">
                Create Event
              </h2>
              <p className="text-2xl opacity-70 text-primary">
                Bring people together. Share your idea
                <br />
                and create a meetup that inspires
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="bg-base-200 rounded-xl p-8">
          {(localError || error) && (
            <div className="text-error text-sm text-center">
              <span>{localError || error}</span>
            </div>
          )}
          <div className="text">
            <h2 className="text-2xl">Event Details</h2>
            <label className="label">
              <span className="label-text text-primary">Title</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter event title"
              className="input input-bordered w-full text-primary"
            />
            <p className="text text-primary opacity-50">
              A clear and catchy title helps people notice your event
            </p>

            <label className="label">
              <span className="label-text text-primary mt-6">Description </span>
            </label>
            <textarea
              value={form.description}
              name="description"
              onChange={handleChange}
              placeholder="Describe your event, what people can expect, and who it's fro"
              className="textarea textarea-bordered w-full text-primary"
            />
            <p className="text text-primary opacity-50">
              Share more details about your event. What's the vibe? What will
              peole do?
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text text-primary mt-6">
                    Start Date & Time{" "}
                  </span>
                </label>
                <input
                  type="datetime-local"
                  value={form.event_start}
                  name="event_start"
                  onChange={handleChange}
                  placeholder="Select date and time"
                  className=" input input-bordered w-full text-primary"
                />
                <p className="text text-primary opacity-50">
                  When does your event start?
                </p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text text-primary mt-6">
                    Duration{" "}
                  </span>
                </label>
                <select
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className="select select-bordered w-full text-primary"
                >
                  <option value="">Select duration</option>
                  <option value="30">less 30 min</option>
                  <option value="30">30 min</option>
                  <option value="60">60 min</option>
                  <option value="90">90 min</option>
                  <option value="120">120 min</option>
                  <option value="120">more 120 min</option>
                </select>
                <p className="text text-primary opacity-50">
                  How long will it last?
                </p>
              </div>
            </div>
            <label className="label">
              <span className="label-text text-primary mt-6">
                Max Participants
              </span>
            </label>
            <input
              type="number"
              name="max_participants"
              value={form.max_participants}
              onChange={handleChange}
              placeholder="e.g. 20"
              className="input input-bordered w-full text-primary"
            />
            <p className="text text-primary opacity-50">
              Set a limit for the number of people
            </p>
            <label className="label">
              <span className="label-text text-primary mt-6">
                Location Name
              </span>
            </label>
            <input
              type="text"
              name="place_name"
              value={form.place_name}
              onChange={handleChange}
              placeholder="e.g. Central Park, Coffee Shop"
              className="input input-bordered w-full text-primary"
            />
            <p className="text text-primary opacity-50">
              Where will event take place?
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text text-primary mt-6">Latitude</span>
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  placeholder="e.g. 32.08"
                  step="any"
                  className="input input-bordered w-full text-primary"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-primary mt-6">
                    Longitude
                  </span>
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  placeholder="e.g. 34.78"
                  step="any"
                  className="input input-bordered w-full text-primary"
                />
              </div>
            </div>
            <p className="text text-primary opacity-50">
              Or search for a place on the map to get coordinates
            </p>
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            Create Event
          </button>
        </form>
        <div className="bg-base-200 rounded-xl p-8">
          <div className="text-2xl">
            <h1 className="text">Tips for a great event</h1>
          </div>
          <div className="flex items-start gap-3">
            <SquarePen className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="font-bold"> Be clear and specific</p>
              <p className="text-sm opacity-50">
                {" "}
                A good title and description help the right people join
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
