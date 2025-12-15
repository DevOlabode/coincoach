const ChatSession  = require('../models/chatSession');

module.exports.index = (req, res) =>{
    res.render('chat/index');
}

module.exports.createSession = async (req, res )=>{
    const { userMessage } = req.body;
    
    const session = new ChatSession({
        userId : req.userId,
        title : "New Chat Session",
        messages : [userMessage]
    });

    await session.save();
    res.status(201).json(session);
};

module.exports.getSessions = async(req, res)=>{
    const sessions = await ChatSession.find({ userId : req.userId }).populate('messages');
    res.status(200).json(sessions);
};

module.exports.getSessionById = async(req, res)=>{
    const { sessionId } = req.params;
    const session = await ChatSession.findOne({ _id : sessionId, userId : req.userId }).populate('messages');   
    if(!session){
        return res.status(404).json({ message : "Chat session not found" });
    }
    res.status(200).json(session);
};

module.exports.updateSessionTitle = async(req, res) =>{
    const { sessionId } = req.params;
    const { title } = req.body; 
    const session = await ChatSession.findOneAndUpdate(
        { _id : sessionId, userId : req.userId },
        { title },  
        { new : true }
    );  
    if(!session){
        return res.status(404).json({ message : "Chat session not found" });
    }   
    res.status(200).json(session);
};

module.exports.deleteSession = async(req, res) =>{
    const { sessionId } = req.params;
    const session = await ChatSession.findOneAndDelete({ _id : sessionId, userId : req.userId });
    if(!session){
        return res.status(404).json({ message : "Chat session not found" });
    }
    res.status(200).json({ message : "Chat session deleted successfully" });
};