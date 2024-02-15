import Conversation from "../models/conversation.model.js";
import Message from "../models/message.models.js";

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    // await conversation.save();
    // await newMessage.save();
    // this will run in parallel rather than one by one
    await Promise.all([conversation.save(), newMessage.save()]);

    //socket io functionality
    res.status(201).json({ message: "Message sent" });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");
    //populate is used to get the messages in the conversation instead of id
    if (!conversation) {
      return res.status(200).json([]);
    }
    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal Server error" });
  }
};
