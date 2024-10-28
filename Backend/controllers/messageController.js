import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
const sendMessage = async (req, res) => {
  try {
    const { recipientsId, message } = req.body;
    const senderId = req.user._id;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientsId] },
    });
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientsId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
    });
    // console.log(newMessage);

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);
    const recipientSocketId = getRecipientSocketId(recipientsId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessage = async (req, res) => {
  const { otherUserId } = req.params;
  const userId = req.user._id;
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });
    // console.log(conversation);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    const message = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });
    res.status(200).json(message);
    console.log();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getConversation = async (req, res) => {
  const userId = req.user._id;
  try {
    const conversation = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "username profilePic",
    });
    ///remove the current user from participants array
    conversation.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export { sendMessage, getMessage, getConversation };
