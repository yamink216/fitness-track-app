const Challenge = require("../models/Challenge");
const challengeDefinitions = require("../seed/challengesData");

const isUserParticipant = (participants = [], userId) => {
  if (!userId) return false;
  const normalizedUserId = userId.toString();

  return participants.some((participantId) => {
    if (!participantId) return false;
    return participantId.toString() === normalizedUserId;
  });
};

const serializeChallenge = (challenge, userId) => ({
  ...challenge.toObject(),
  isJoined: isUserParticipant(challenge.participants, userId),
  participantCount: challenge.participants?.length || 0,
});

const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ startDate: 1 });
    const challengeList = challenges.map((challenge) => serializeChallenge(challenge, req.userId));

    res.status(200).json({ count: challengeList.length, challenges: challengeList });
  } catch (error) {
    console.error("Get challenges error:", error);
    res.status(500).json({ message: "Server error fetching challenges" });
  }
};

const joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const userId = req.userId.toString();
    const alreadyJoined = isUserParticipant(challenge.participants, userId);

    if (!alreadyJoined) {
      challenge.participants.push(userId);
      await challenge.save();
    }

    const updatedChallenge = serializeChallenge(challenge, userId);

    res.status(200).json({
      message: alreadyJoined ? "You are already in this challenge" : "Joined challenge successfully",
      challenge: updatedChallenge,
    });
  } catch (error) {
    console.error("Join challenge error:", error);
    res.status(500).json({ message: "Server error joining challenge" });
  }
};

const leaveChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const userId = req.userId.toString();
    challenge.participants = challenge.participants.filter(
      (id) => id && id.toString() !== userId
    );
    await challenge.save();

    const updatedChallenge = serializeChallenge(challenge, userId);

    res.status(200).json({
      message: "Left challenge successfully",
      challenge: updatedChallenge,
    });
  } catch (error) {
    console.error("Leave challenge error:", error);
    res.status(500).json({ message: "Server error leaving challenge" });
  }
};

const seedChallenges = async () => {
  for (const config of challengeDefinitions) {
    const existing = await Challenge.findOne({ name: config.name });
    if (!existing) {
      await Challenge.create(config);
    } else {
      await Challenge.findByIdAndUpdate(existing._id, {
        $set: {
          ...config,
          startDate: config.startDate || existing.startDate,
          endDate: config.endDate || existing.endDate,
        },
      });
    }
  }
};

module.exports = {
  getChallenges,
  joinChallenge,
  leaveChallenge,
  seedChallenges,
};
