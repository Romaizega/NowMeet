const db = require("../../db/db");

const sendPrivateMessage = async (sender_user_id, recipient_user_id, text) => {
  const [privateMessage] = await db("private_messages")
    .insert({ sender_user_id, recipient_user_id, text })
    .returning("*");
  const fullMessage = await db("private_messages")
    .join("users", "private_messages.sender_user_id", "users.id")
    .select(
      "private_messages.id as id",
      "private_messages.*",
      "users.username",
      "users.photo",
    )
    .where("private_messages.id", privateMessage.id)
    .first();
  return fullMessage;
};

const getAllMessages = async (user_id_1, user_id_2) => {
  return db("private_messages")
    .join("users", "private_messages.sender_user_id", "users.id")
    .select("private_messages.*", "users.username", "users.photo")
    .where({ sender_user_id: user_id_1, recipient_user_id: user_id_2 })
    .orWhere({ sender_user_id: user_id_2, recipient_user_id: user_id_1 })
    .orderBy("created_at", "asc");
};

const getInbox = async (user_id) => {
  const result = await db.raw(
    `
    SELECT DISTINCT ON (other_user_id)
    m.id,
    m.text,
    m.created_at,
    u.username,
    u.photo,
    CASE 
      WHEN m.sender_user_id = ? THEN m.recipient_user_id
      ELSE m.sender_user_id
    END AS other_user_id
    FROM private_messages m
    JOIN users u ON u.id = CASE 
    WHEN m.sender_user_id = ? THEN m.recipient_user_id
   ELSE m.sender_user_id
  END
  WHERE m.sender_user_id = ? OR m.recipient_user_id = ?
  ORDER BY other_user_id, m.created_at DESC
    `,
    [user_id, user_id, user_id, user_id],
  );
  return result.rows;
};

module.exports = {
  sendPrivateMessage,
  getAllMessages,
  getInbox,
};
