import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { createEvent } from "../features/events/eventThunk";
import { useNavigate, useParams } from "react-router-dom";
import heroCreateImage from "../assests/hero_createEvent.png";
import { getEventById, updateEvent } from "../features/events/eventThunk";
import {
  SquarePen,
  MapPinCheck,
  ContactRound,
  HeartHandshake,
  CalendarPlus2,
  NotebookPen,
  BookOpenText,
  CalendarClock,
  MapPinned,
  Clock,
  Users,
  ScanSearch,
  Star,
  ThumbsUp,
  Pin,
} from "lucide-react";

import {
  addEventInterest,
  deleteEventInterest,
  getAllInterests,
  getEventInterests,
} from "../features/interest/interestThunk";
import groupByCategory from "../utils/groupByCategory";
import EventMap from "../components/MapPicker";
import api from "../services/axios";

export default function CreateEvent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedInterestes, setSelectedInterestes] = useState([]);
  const [aiPrompt, setAiPrompt] = useState([]);
  const [aiSuggestion, setAiSugestion] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const { status, error, events, currentEvent } = useSelector(
    (state) => state.event,
  );
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

  const {
    status: interestStatus,
    error: interestError,
    allInterests,
    eventInterest,
  } = useSelector((state) => state.interest);
  const grouped = groupByCategory(allInterests);
  const { id } = useParams();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode && currentEvent) {
      setForm({
        title: currentEvent.title,
        description: currentEvent.description,
        event_start: currentEvent.event_start,
        duration: currentEvent.duration,
        max_participants: currentEvent.max_participants,
        place_name: currentEvent.place_name,
        latitude: currentEvent.latitude,
        longitude: currentEvent.longitude,
      });
    }
  }, [isEditMode, currentEvent]);

  useEffect(() => {
    if (isEditMode) {
      dispatch(getEventById(id));
    }
  }, [id, dispatch]);

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
      if (isEditMode) {
        await dispatch(updateEvent({ id, ...form })).unwrap();
        navigate(`/event/${id}`);
      } else {
        const result = await dispatch(createEvent(form)).unwrap();
        for (const interest_id of selectedInterestes) {
          await dispatch(
            addEventInterest({ id: result.event.id, interest_id }),
          );
        }
        navigate(`/event/${result.event.id}`);
      }
      setLocalError("");
    } catch (error) {
      setLocalError(error.message || "Failed to save event");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = ({ lat, lng }) => {
    setForm({ ...form, latitude: lat, longitude: lng });
  };

  useEffect(() => {
    if (!isEditMode) {
      navigator.geolocation.getCurrentPosition((position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      });
    }
  }, []);
  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => setLocalError(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  useEffect(() => {
    dispatch(getAllInterests());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleInterest = (interestId) => {
    setSelectedInterestes((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId],
    );
  };

  const handleSuggestAI = async () => {
    setAiLoading(true);
    try {
      const { data } = await api.post("/ai/suggest-location", {
        ...form,
        aiPrompt,
      });
      setAiSugestion(data.suggestions);
    } catch (error) {
      setLocalError(
        error.response?.data?.message || "Failed to get AI response",
      );
    } finally {
      setAiLoading(false);
    }
  };

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
            <label className="label grid">
              <span className="label-text text-primary mt-6">
                AI Suggestions
              </span>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="text-primary opacity-50 bordered"
                placeholder="Write where you want spend your time"
              ></textarea>
            </label>
            <div className="mt-4 pl-20">
              <button
                type="button"
                className="btn border-none bg-primary text-primary-content text-2xl font-bold py-6 px-7 rounded-xl shadow-xl shadow-primary/30 hover:shadow-primary/60 hover:scale-105 transition-all duration-300"
                onClick={handleSuggestAI}
              >
                {aiLoading ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "✨ AI Suggest Location"
                )}
              </button>
              {aiSuggestion?.map((suggestion) => {
                const lat = suggestion.googlePlace?.latitude;
                const lng = suggestion.googlePlace?.longitude;
                const mapUrl = suggestion.googlePlace?.place_id
                  ? `https://www.google.com/maps/place/?q=place_id:${suggestion.googlePlace.place_id}`
                  : lat && lng
                  ? `https://www.google.com/maps?q=${lat},${lng}`
                  : null

                return (
                  <div
                    key={suggestion.searchQuery}
                    className="card bg-base-200 mb-4 cursor-pointer border border-transparent hover:border-orange-400/40 transition-all"
                  >
                    <div className="card-body mt-2">
                      <div className="flex justify-between items-start gap-8">
                        <div className="flex-1">
                          <a
                            href={mapUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl font-bold text-primary hover:text-orange-400 transition-colors"
                          >
                            {suggestion.googlePlace?.name || suggestion.name}
                          </a>

                          <p className="text-primary/60 mt-1">
                            {suggestion.googlePlace?.formatted_address}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="flex items-center gap-2 text-orange-400">
                            <Star className="w-7 h-7" />
                            <span className="text-4xl font-bold">
                              {suggestion.googlePlace?.rating || "N/A"}
                            </span>
                          </div>

                          <p className="text-sm text-primary/50 mt-2">
                            AI Recommended
                          </p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="flex items-center gap-2 mb-2">
                          <ThumbsUp className="text-primary w-6 h-6" />
                          <span className="font-semibold text-primary">
                            Why this place fits
                          </span>
                        </div>

                        <p className="text-primary/70 leading-relaxed max-w-4xl">
                          {suggestion.whyFits}
                        </p>
                      </div>

                      <div className="mt-5">
                        <p className="text-lg font-semibold text-primary mb-2">
                          Highlights
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {suggestion.pros?.map((pro) => (
                            <span
                              key={pro}
                              className="badge bg-primary/10 text-primary border-none"
                            >
                              {pro}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2 flex-wrap text-primary">
                        <span className="badge badge-outline text-lg">
                          {suggestion.venueType}
                        </span>

                        <span className="badge badge-outline text-lg">
                          {suggestion.area}
                        </span>

                        <span className="badge badge-outline text-lg">
                          {suggestion.estimatedAverageCheck}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-3 text-sm text-primary/60">
                        <Pin className="text-primary w-5 h-5" />

                        {mapUrl ? (
                          <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-orange-400 transition-colors"
                          >
                            View on Google Maps
                          </a>
                        ) : (
                          <span>Location unavailable</span>
                        )}
                      </div>

                      <div className="card-actions justify-end mt-4">
                        <button
                        type="button"
                          className="btn bg-gradient-to-r from-primary to-primary/80 text-primary-content border-none rounded-xl hover:scale-105 transition-all"
                          onClick={() => {
                            if (suggestion.googlePlace) {
                              setForm({
                                ...form,
                                place_name: suggestion.googlePlace.name,
                                latitude: suggestion.googlePlace.latitude,
                                longitude: suggestion.googlePlace.longitude,
                              });
                            }
                          }}
                        >
                          Select This Venue
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

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
            <EventMap
              lat={parseFloat(form.latitude)}
              lng={parseFloat(form.longitude)}
              onLocationSelect={handleLocationSelect}
            ></EventMap>
            <p className="text text-primary opacity-50">
              Or search for a place on the map to get coordinates
            </p>
          </div>
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text text-primary">Interests</span>
            </label>

            {grouped &&
              Object.entries(grouped).map(([categoryName, interests]) => (
                <div
                  key={categoryName}
                  className="collapse collapse-arrow mb-2 border border-orange-400/20 bg-black/30"
                >
                  <input type="checkbox" />

                  <div className="collapse-title text-primary font-medium">
                    {categoryName}
                  </div>

                  <div className="collapse-content">
                    <div className="flex flex-wrap gap-2 pt-2">
                      {interests.map((interest) => (
                        <span
                          onClick={() => handleInterest(interest.id)}
                          key={interest.id}
                          className={
                            selectedInterestes.includes(interest.id)
                              ? "cursor-pointer rounded-full bg-orange-400 px-3 py-1 text-black font-medium transition-all"
                              : "cursor-pointer rounded-full border border-orange-400/30 px-3 py-1 text-orange-300 hover:bg-orange-400/10 transition-all"
                          }
                        >
                          {interest.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <button type="submit" className="btn btn-primary mt-4">
            Create Event
          </button>
        </form>
        <div className="flex flex-col gap-6">
          <div className="bg-base-200 rounded-xl p-8">
            <div className="text-2xl">
              <h1 className="text">Tips for a great event</h1>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 mt-4">
                <SquarePen className="w-8 h-8 text-primary mt-1" />
                <div className="text text-primary">
                  <p className="font-bold">Be clear and specific</p>
                  <p className="text-sm opacity-50">
                    A good title and description help the right people join
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 mt-4">
                <MapPinCheck className="w-8 h-8 text-primary mt-1" />
                <div className="text text-primary">
                  <p className="font-bold">Choose the right location</p>
                  <p className="text-sm opacity-50">
                    Pick a place that's easy to find and accessible
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 mt-4">
                <ContactRound className="w-8 h-8 text-primary mt-1" />
                <div className="text text-primary">
                  <p className="font-bold">Set expectations</p>
                  <p className="text-sm opacity-50">
                    Add duration, max people, and any important details
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 mt-4">
                <HeartHandshake className="w-8 h-8 text-primary mt-1" />
                <div className="text text-primary">
                  <p className="font-bold">Make it inviting</p>
                  <p className="text-sm opacity-50">
                    A warm description creates excitement and connection
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-base-200 rounded-xl p-8">
            <div className="text-2xl">
              <h1 className="text">Preview</h1>
            </div>
            {form.title ? (
              <div className="text text-primary">
                <div className="flex items-center gap-2 mt-4">
                  <NotebookPen className="w-5 h-5" />
                  <h3>{form.title}</h3>
                </div>
                {form.description && (
                  <div className="flex items-center gap-2 mt-4">
                    <BookOpenText className="w-5 h-5" />
                    <h3>{form.description}</h3>
                  </div>
                )}
                {form.event_start && (
                  <div className="flex items-center gap-2 mt-4">
                    <CalendarClock className=" w-5 h-5" />
                    {form.event_start && <p>{formatDate(form.event_start)}</p>}
                  </div>
                )}
                {form.place_name && (
                  <div className=" flex items-center gap-2 mt-4">
                    <MapPinned />
                    {form.place_name && <p>{form.place_name}</p>}
                  </div>
                )}
                {form.duration && (
                  <div className="flex items-center gap-2 mt-4">
                    <Clock />
                    {form.duration && <p>{form.duration} min</p>}
                  </div>
                )}
                {form.max_participants && (
                  <div className="flex items-center gap-2 mt-4">
                    <Users />
                    {form.max_participants && (
                      <p>Up to {form.max_participants} people</p>
                    )}
                  </div>
                )}
                {selectedInterestes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <ScanSearch />
                    {selectedInterestes.map((id) => {
                      const interest = allInterests.find((i) => i.id === id);
                      return interest ? (
                        <span
                          key={id}
                          className="rounded-full bg-orange-400 px-3 py-1 text-black text-sm"
                        >
                          {interest.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-base-300 rounded-xl p-8 ">
                <div className="flex flex-col items-center justify-center text-center">
                  <CalendarPlus2 className="text-primary w-10 h-10 mb-3" />
                  <p className="text-xl text-primary">Your event preview</p>
                  <p className="text-xl text-primary">will appear here</p>
                  <p className="text-sm text-primary opacity-50 mt-2">
                    Fill the details to see how
                  </p>
                  <p className="text-sm text-primary opacity-50">
                    your event will look
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
