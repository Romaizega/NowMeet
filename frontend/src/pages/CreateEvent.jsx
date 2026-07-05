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
  Image,
} from "lucide-react";

import {
  addEventInterest,
  getAllInterests,
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
    city: "",
    country: "",
    cover_image: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [coverShow, setCoverShow] = useState(null);

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
        title: currentEvent.title || "",
        description: currentEvent.description || "",
        event_start: currentEvent.event_start || "",
        duration: currentEvent.duration || "",
        max_participants: currentEvent.max_participants || "",
        place_name: currentEvent.place_name || "",
        latitude: currentEvent.latitude || "",
        longitude: currentEvent.longitude || "",
        city: currentEvent.city || "",
        country: currentEvent.country || "",
        cover_image: currentEvent.cover_image || "",
        place_id: currentEvent.place_id || "",
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
    if (!form.city) {
      return setLocalError("You must fill city field");
    }
    if (!form.country) {
      return setLocalError("You must fill the country field");
    }
    if (!coverImage && !isEditMode) {
      return setLocalError("You should upload an image of event");
    }

    try {
      if (isEditMode) {
        const formDataPut = new FormData()
        formDataPut.append("title", form.title);
        formDataPut.append("description", form.description);
        formDataPut.append("event_start", form.event_start);
        formDataPut.append("duration", form.duration);
        formDataPut.append("max_participants", form.max_participants);
        formDataPut.append("place_name", form.place_name);
        formDataPut.append("latitude", form.latitude);
        formDataPut.append("longitude", form.longitude);
        formDataPut.append("city", form.city);
        formDataPut.append("country", form.country);
        formDataPut.append("cover_image", coverImage);
        formDataPut.append("place_id", form.place_id)
        await dispatch(updateEvent({id, formData: formDataPut})).unwrap();
        navigate(`/event/${id}`);
      } else {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("event_start", form.event_start);
        formData.append("duration", form.duration);
        formData.append("max_participants", form.max_participants);
        formData.append("place_name", form.place_name);
        formData.append("latitude", form.latitude);
        formData.append("longitude", form.longitude);
        formData.append("city", form.city);
        formData.append("country", form.country);
        formData.append("cover_image", coverImage);
        formData.append("place_id", form.place_id)
        const result = await dispatch(createEvent(formData)).unwrap();

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
    fetchGeoData(lat, lng);
  };

  useEffect(() => {
    if (!isEditMode) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        fetchGeoData(lat, lng);
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

  const fetchGeoData = async (latitude, longitude) => {
    try {
      const { data } = await api.post("/event/geocode", {
        latitude,
        longitude,
      });
      setForm((prev) => ({ ...prev, city: data.city, country: data.country }));
    } catch (error) {
      setLocalError(error.response?.data?.message || "Failed to get geo data");
    }
  };

  return (
    <>
      <div
        className="relative rounded-xl overflow-hidden mb-10 h-[260px] lg:h-[320px]"
        style={{
          backgroundImage: `url(${heroCreateImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent">
          <div className="relative z-10 flex h-full items-center px-5 lg:px-10">
            <div className="max-w-xl">
              <h2 className="text-3xl lg:text-5xl font-bold text-primary mb-10 ">
                Create Event
              </h2>
              <p className="text-base lg:text-2xl opacity-70 text-primary">
                Bring people together. Share your idea
                <br />
                and create a meetup that inspires
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="bg-base-200 rounded-xl p-4 sm:p-6 lg:p-8">
          {(localError || error) && (
            <div className="text-error text-sm text-center">
              <span>{localError || error}</span>
            </div>
          )}
          <div className="text">
            <h2 className="text-2xl">Event Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-primary font-semibold">
                      Event Image (Optional)
                    </span>
                  </label>

                  <label className="border-2 border-dashed border-primary/30 rounded-xl h-48 lg:h-56 cursor-pointer hover:border-primary transition-all flex flex-col items-center justify-center gap-3 bg-base-300">
                    <Image className="w-12 h-12 text-primary" />

                    <p className="text-lg lg:text-xl font-semibold text-primary">
                      Upload event image
                    </p>

                    <p className="text-sm text-primary/60">
                      PNG, JPG or WEBP (max. 5MB)
                    </p>

                    <p className="text-xs text-primary/40">
                      This image will be shown on your event page and preview sectiion with a title
                    </p>

                    <div className="btn btn-outline btn-primary mt-2">
                      Choose File
                    </div>

                    <input
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setCoverImage(file);
                        if (file) {
                          setCoverShow(URL.createObjectURL(file));
                        }
                      }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div>
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
                  <span className="label-text text-primary mt-6">
                    Description{" "}
                  </span>
                </label>
                <textarea
                  value={form.description}
                  name="description"
                  onChange={handleChange}
                  placeholder="Describe your event, what people can expect, and who it's fro"
                  className="textarea textarea-bordered w-full text-primary"
                />
                <p className="text text-primary opacity-50">
                  Share more details about your event. What's the vibe? What
                  will peole do?
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text text-primary mt-6">Country</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="e.g. Israel"
                  className="input input-bordered w-full text-primary"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-primary mt-6">City</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Tel Aviv"
                  className="input input-bordered w-full text-primary"
                />
              </div>
            </div>
            <label className="label grid">
              <span className="label-text text-primary mt-6">
                AI Suggestions
              </span>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="textarea textarea-bordered w-full text-primary"
                placeholder="e.g. cozy cafe in Haifa with a good enviroment"
              ></textarea>
              <p className="text text-primary opacity-50">
                {" "}
                Write where you want spend your time
              </p>
            </label>
            <div className="mt-4 flex justify-center lg:justify-start mt-6">
              <button
                type="button"
                className="btn border-none bg-primary text-primary-content text-lg lg:text-2xl font-bold py-6 px-7 rounded-xl shadow-xl shadow-primary/30 hover:shadow-primary/60 hover:scale-105 transition-all duration-300 w-full lg:w-auto"
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
                    : null;

                return (
                  <div
                    key={suggestion.searchQuery}
                    className="card bg-base-200 mb-4 cursor-pointer border border-transparent hover:border-orange-400/40 transition-all"
                  >
                    <div className="card-body mt-2">
                      <div className="flex flex-col lg:flex-row justify-between gap-6">
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

                        <div className="shrink-0 text-left lg:text-right">
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
                          className="btn bg-gradient-to-r from-primary to-primary/80 text-primary-content border-none rounded-xl hover:scale-105 transition-all w-full lg:w-auto"
                          onClick={() => {
                            if (suggestion.googlePlace) {
                              setForm({
                                ...form,
                                place_name: suggestion.googlePlace.name,
                                latitude: suggestion.googlePlace.latitude,
                                longitude: suggestion.googlePlace.longitude,
                                place_id: suggestion.googlePlace.place_id,
                                country: suggestion.googlePlace.country,
                                city: suggestion.googlePlace.city
                              });
                              fetchGeoData(suggestion.googlePlace.latitude, suggestion.googlePlace.longitude)
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <button type="submit" className="btn btn-primary mt-4 ">
            Create Event
          </button>
        </form>
        <div className="flex flex-col gap-6">
          <div className="bg-base-200 rounded-xl p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* LEFT */}
              <div className="border border-primary/20 rounded-xl p-6 bg-base-300">
                <div className="text-2xl font-bold">
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

              {/* RIGHT */}
              <div className="border border-primary/20 rounded-xl p-6 bg-base-300">
                <div className="flex items-center gap-3 mb-4">
                  {/* <Brain className="w-8 h-8 text-primary" /> */}
                  <h2 className="text-2xl font-bold ">AI Venue Assistant</h2>
                </div>

                <p className="text-primary mb-4">
                  Finding the right place can be difficult
                </p>

                <p className="text-primary/70">
                  Our AI analyzes your event and suggests real venues that match
                  your audience, group size and activity.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <span className="flex items-center gap-2 text-primary">
                    ✓ Smart recommendations
                  </span>
                  <span className="flex items-center gap-2 text-primary">
                    ✓ Real places
                  </span>
                  <span className="flex items-center gap-2 text-primary">
                    ✓ Google ratings
                  </span>
                  <span className="flex items-center gap-2 text-primary">
                    ✓ Maps and directions
                  </span>
                  <span className="flex items-center gap-2 text-primary">
                    ✓ One-click selection
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-base-200 rounded-xl p-8">
            <div className="text-2xl">
              <h1 className="text">Preview</h1>
            </div>

            {form.title ? (
              <div className="card bg-base-300 mt-4">
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {coverShow && (
                      <div className="relative w-full lg:w-70 h-64 lg:h-70 shrink-0 overflow-hidden rounded-xl">
                        <img
                          src={coverShow}
                          alt="Event preview"
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      </div>
                    )}

                    <div className="flex-1 text text-primary">
                      <div className="flex items-center gap-2">
                        <NotebookPen className="w-5 h-5" />
                        <h3 className="text-xl font-bold">{form.title}</h3>
                      </div>

                      {form.description && (
                        <div className="flex items-start gap-2 mt-4">
                          <BookOpenText className="w-5 h-5 mt-1 shrink-0" />
                          <h3>{form.description}</h3>
                        </div>
                      )}

                      {form.event_start && (
                        <div className="flex items-center gap-2 mt-4">
                          <CalendarClock className="w-5 h-5" />
                          <p>{formatDate(form.event_start)}</p>
                        </div>
                      )}

                      {form.place_name && (
                        <div className="flex items-center gap-2 mt-4">
                          <MapPinned />
                          <p>{form.place_name}</p>
                        </div>
                      )}

                      {form.duration && (
                        <div className="flex items-center gap-2 mt-4">
                          <Clock />
                          <p>{form.duration} min</p>
                        </div>
                      )}

                      {form.max_participants && (
                        <div className="flex items-center gap-2 mt-4">
                          <Users />
                          <p>Up to {form.max_participants} people</p>
                        </div>
                      )}

                      {selectedInterestes.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          <ScanSearch />
                          {selectedInterestes.map((id) => {
                            const interest = allInterests.find(
                              (i) => i.id === id,
                            );
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
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-base-300 rounded-xl p-8 mt-4">
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
