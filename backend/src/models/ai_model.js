const db = require("../../db/db");

const getUserInterests = async (user_id) => {
  return db("user_interests")
    .join("interests", "user_interests.interest_id", "=", "interests.id")
    .where({ user_id })
    .select("interests.id", "interests.name")
    .orderBy("name", "desc");
};

const getAllUsersWithInterests = async (user_id) => {
  return db("users")
    .join("user_interests", "users.id", "=", "user_interests.user_id")
    .join("interests", "user_interests.interest_id", "=", "interests.id")
    .whereNot("users.id", user_id)
    .select("interests.*", 'users.id', "users.username", "users.photo", "users.created_at")
};


const getActiveEventsWithInterests = async () => {
  return db('events')
  .join('event_interests', 'events.id', '=', 'event_interests.event_id')
  .join('interests', 'event_interests.interest_id', '=', 'interests.id')
  .where('status', 'open')
  .select('events.id as event_id','interests.id', 'interests.name', 'events.title', 'events.event_start', 'events.place_name')
  .orderBy('name', 'desc')
}

 module.exports = {
  getUserInterests,
  getAllUsersWithInterests,
  getActiveEventsWithInterests
 }