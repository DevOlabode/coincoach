const Groq = require('groq-sdk');

const goals = async(explanation) =>{
    const groq = new Groq({
        apiKey : process.env.GROQ_API_KEY
    });

    const prompt = `
    
    `;

    try{

    }catch(err){
        console.error('Groq goal planning Error: ', err);
        throw new Error('Failed to generate financial goal plan')
    }
}