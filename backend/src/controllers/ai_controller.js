const aiModel = require("../models/ai_model");
const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPEN_API_KEY });

const getAiMatch = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    if (!user_id) {
      return res.status(404).json({ message: "Not found an user" });
    }
    const getUserInterests = await aiModel.getUserInterests(user_id);

    if (!getUserInterests) {
      return res.status(404).json({ message: "Not found users interests" });
    }
    const getAllUsersWithInterests =
      await aiModel.getAllUsersWithInterests(user_id);

    const groupByInterestUsers = getAllUsersWithInterests.reduce(
      (accum, curentInt) => {
        const newInt = curentInt.id;
        if (!accum[newInt]) {
          accum[newInt] = {
            id: curentInt.id,
            username: curentInt.username,
            photo: curentInt.photo,
            interests: [],
          };
        }
        accum[newInt].interests.push(curentInt.name);
        return accum;
      },
      {},
    );
    const userArray = Object.values(groupByInterestUsers);
    if (!getAllUsersWithInterests) {
      return res
        .status(404)
        .json({ message: "There are no any users with interests" });
    }
    const getActiveEventsWithInterests =
      await aiModel.getActiveEventsWithInterests();
    const groupByInterestEVents = getActiveEventsWithInterests.reduce(
      (accum, curentInt) => {
        const newInt = curentInt.event_id;
        if (!accum[newInt]) {
          accum[newInt] = {
            id: curentInt.event_id,
            title: curentInt.title,
            place_name: curentInt.place_name,
            event_start: curentInt.event_start,
            interests: [],
          };
        }
        accum[newInt].interests.push(curentInt.name);
        return accum;
      },
      {},
    );
    const eventArray = Object.values(groupByInterestEVents);
    if (!getActiveEventsWithInterests) {
      return res.status(404).json({ message: "No events" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI recommendation assistant for a social meetup platform.

                Your task:

                1. Analyze the current user's interests.
                2. Find the most compatible users.
                3. Find the most relevant events.
                4. Explain WHY each recommendation is relevant.
                5. Score compatibility from 0 to 100.

                Rules:
                - Prioritize shared interests.
                - Prefer users with multiple overlapping interests.
                - Prefer events that match multiple interests.
                - Do not recommend the current user.
                - Return only JSON.
                - Also display title of event and event start
                - Each event must appear only once by eventId.
                - If the same event matches multiple interests, put all matched interests into matchedInterests array.
                - recommendedEvents must be grouped by eventId.
                - Always return both recommendedUsers and recommendedEvents arrays, even if empty.

                Return exactly:
                {
                  "recommendedEvents": [
                    {
                      "eventId": 17,
                      "title": "Tech talk and coffee",
                      "matchScore": 90,
                      "matchedInterests": ["Programming", "AI Tools", "Web Development"],
                      "reason": "This event matches several of your tech interests..."
                    }
                  ]
                }
                `,
        },
        {
          role: "user",
          content: `
          Current user interests:
          ${JSON.stringify(getUserInterests)}

          Users:
          ${JSON.stringify(userArray)}

          Events:
          ${JSON.stringify(eventArray)}

          Return:

          {
            "recommendedUsers": [
              {
                "userId": number,
                "matchScore": number,
                "username": string,
                "photo": string
                "sharedInterests": [],
                "reason": ""
              }
            ],
            "recommendedEvents": [
              {
                "eventId": number,
                "matchScore": number,
                "matchedInterests": [],
                "title": string,
                "event_start": string,
                "place_name": string
                "reason": ""
              }
            ]
          }
      `,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);

    return res.status(201).json({
      message: "Match ok",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const suggestLocation = async (req, res) => {
  try {
    const {
      title,
      description,
      event_start,
      duration,
      max_participants,
      city,
      area,
      interests,
      aiPrompt,
    } = req.body;

    if (
      !title ||
      !description ||
      !event_start ||
      !duration ||
      !max_participants
    ) {
      return res.status(400).json({
        message:
          "Title, description, date, duration and max participants are required for AI",
      });
    }

    const responseAI = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
              You are an AI venue recommendation assistant for a social meetup platform called NowMeet.

              Your task:
              Analyze the event details and suggest 3 to 5 suitable venue ideas.

              Important:
              - Do not invent exact ratings, opening hours, phone numbers, or real-time availability.
              - If you mention rating or average check, mark them as estimated.
              - Prefer places that fit the event type, group size, time, and social vibe.
              - Return only JSON.

              Return exactly this structure:
              {
                "suggestions": [
                  {
                    "name": "string",
                    "venueType": "cafe | park | bar | coworking | restaurant | public_space | other",
                    "area": "string",
                    "bestFor": "string",
                    "estimatedAverageCheck": "string",
                    "estimatedRating": "string",
                    "whyFits": "string",
                    "pros": ["string"],
                    "cons": ["string"],
                    "searchQuery": "string"
                  }
                ]
              }
                        `,
        },
        {
          role: "user",
          content: `
              Event details:

              Title:
              ${title}

              Description:
              ${description}

              Start:
              ${event_start}

              Duration:
              ${duration} minutes

              Max participants:
              ${max_participants}

              City:
              ${city || "Not specified"}

              Area:
              ${area || "Not specified"}

              Interests:
              ${JSON.stringify(interests || [])}

              Additional request from user:
              ${aiPrompt || "No additional request"}

              Suggest 3 to 5 venues or venue types that would fit this meetup.
                        `,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(responseAI.choices[0].message.content);
    const suggestions = result.suggestions || [];
    const suggestionsWithPlace = await Promise.all(
      suggestions.map(async (suggestion) => {
        const query = encodeURIComponent(suggestion.searchQuery);

        const googleResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_MAPS_API_KEY_BACKEND}`,
        );
        const googleData = await googleResponse.json();
        console.log('Google status:', googleData.status)
        console.log('Google results:', googleData.results?.length)
        const place = googleData.results?.[0];
        return {
          ...suggestion,

          googlePlace: place
            ? {
                name: place.name,
                formatted_address: place.formatted_address,
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
                rating: place.rating || null,
                place_id: place.place_id,
              }
            : null,
        };
      }),
    );

    return res.status(200).json({
      message: "AI venue suggestions ok",
      suggestions: suggestionsWithPlace,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to suggest venues",
      error: error.message,
    });
  }
};

module.exports = {
  getAiMatch,
  suggestLocation,
};
