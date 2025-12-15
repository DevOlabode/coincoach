const ChatSession = require('../models/chatSession');
const ChatMessage = require('../models/chatMessage');

module.exports.index = (req, res) => {
    res.render('chat/index');
};

module.exports.createSession = async (req, res) => {
    try {
        const session = new ChatSession({
            userId: req.user._id,
            title: "New Chat"
        });
        await session.save();
        res.status(201).json(session);
    } catch (error) {
        console.error("Create session error:", error);
        res.status(500).json({ error: "Failed to create session" });
    }
};

module.exports.getSessions = async (req, res) => {
    try {
        const sessions = await ChatSession.find({ userId: req.user._id })
            .sort({ updatedAt: -1 });
        res.status(200).json(sessions);
    } catch (error) {
        console.error("Get sessions error:", error);
        res.status(500).json({ error: "Failed to fetch sessions" });
    }
};

module.exports.getSessionById = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await ChatSession.findOne({ 
            _id: sessionId, 
            userId: req.user._id 
        }).populate('messages');
        
        if (!session) {
            return res.status(404).json({ message: "Chat session not found" });
        }
        res.status(200).json(session);
    } catch (error) {
        console.error("Get session error:", error);
        res.status(500).json({ error: "Failed to fetch session" });
    }
};

module.exports.updateSessionTitle = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { title } = req.body;
        
        const session = await ChatSession.findOneAndUpdate(
            { _id: sessionId, userId: req.user._id },
            { title },
            { new: true }
        );
        
        if (!session) {
            return res.status(404).json({ message: "Chat session not found" });
        }
        res.status(200).json(session);
    } catch (error) {
        console.error("Update session error:", error);
        res.status(500).json({ error: "Failed to update session" });
    }
};

module.exports.deleteSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        // Delete all messages in the session
        await ChatMessage.deleteMany({ sessionId });
        
        // Delete the session
        const session = await ChatSession.findOneAndDelete({ 
            _id: sessionId, 
            userId: req.user._id 
        });
        
        if (!session) {
            return res.status(404).json({ message: "Chat session not found" });
        }
        res.status(200).json({ message: "Chat session deleted successfully" });
    } catch (error) {
        console.error("Delete session error:", error);
        res.status(500).json({ error: "Failed to delete session" });
    }
};