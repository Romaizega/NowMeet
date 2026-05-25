import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getEventById } from "../features/events/eventThunk";
import { Calendar, Clock4, MapPin, Users } from "lucide-react";

export default function EventDetails() {
  const { id } = useParams();
  const { status, error, currentEvent } = useSelector((state) => state.event);
  const dispatch = useDispatch()

 useEffect (()=> {
  dispatch(getEventById(id))
 }, [dispatch, id])

  if (status === "loading")
    return <span className="loading loading-spinner"> Loading events...</span>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;
  if (!currentEvent) return null;

  return (
    <>
    <div className="relative z-10 flex w-full min-h-screen items-start pl-16 pt-24">
      <div className="w-full lg:w-3/4 text-left">
      <span className="badge border-orange-400 bg-black/50 text-orange-300 uppercase">{currentEvent.status}</span>
      <h2 className="text text-primary font-bold">{currentEvent.title}</h2>
      <p className="mt-4 max-w-2xl text-primary"> {currentEvent.description}</p>
      <div className="mt-6 flex flex-wrap gap-4 text-primary">
        <span className="flex items-center gap-2">
          <Calendar className="w-7 h-7"/>
          {currentEvent.event_start}
        </span>
        <span className="flex items-center gap-2"> 
          <Clock4 className="w-7 h-7"/>
          {currentEvent.duration}
        </span>
        <span className="flex items-center gap-2">
          <MapPin className="w-7 h-7"/>
          {currentEvent.place_name}
        </span>
        <span className="flex items-center gap-2">
          <Users className="w-7 h-7"/>
          {currentEvent.max_participants}
        </span>
      </div>
      </div>
    </div>
    </>
  )
}
