const ChatSession = require('../models/ChatSession');

exports.saveChat = async (req, res) => {
  try {
    const {
      name, contactNo, email, organisation, address,
      category, sector, website, stage, otherSupport
    } = req.body;

    // (You may wish to add field validation here!)

    const chatSession = await ChatSession.create({
      name,
      contactNo,
      email,
      organisation,
      address,
      category,
      sector,
      website,
      stage,
      otherSupport
    });

    res.status(201).json({ message: 'Chat saved', id: chatSession.id });
  } catch (error) {
    console.error('Error saving chat:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get all chat sessions
exports.getAllChats = async (req, res) => {
  try {
    const chats = await ChatSession.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({ message: 'Server error fetching chat sessions' });
  }
};

// Get chat session by ID
exports.getChatById = async (req, res) => {
  const { id } = req.params;
  try {
    const chat = await ChatSession.findByPk(id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    res.json(chat);
  } catch (error) {
    console.error(`Error fetching chat session ${id}:`, error);
    res.status(500).json({ message: 'Server error fetching chat session' });
  }
};
