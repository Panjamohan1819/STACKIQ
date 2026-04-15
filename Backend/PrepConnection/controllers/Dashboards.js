import Attempts from "../models/Attempts.js";

export const getDashboard = async(req,res,next) => {
    try{
        const userID = req.user.id;
        
        const [totalMcq,totalCoding,totalCorrect,totalAttempt] = await Promise.all([
            Attempts.countDocuments({userId:userID,type:"mcq"}),
            Attempts.countDocuments({userId:userID,type:"coding"}),
            Attempts.countDocuments({userId:userID,isCorrect: true}),
            Attempts.countDocuments({userId:userID}),
        ]);
        //overall accuracy
         const overallAccuracy = totalAttempt === 0 ? 0 : Math.round((totalCorrect/totalAttempt) * 100);
         //Topic wise-accuracy
         const topicList = await Attempts.distinct("topic",{userId:userID})

         const topic = await Promise.all(
            topicList.map(async(topic) => {
                const [total,correct] = await Promise.all([
                    Attempts.countDocuments({userId:userID,topic}),
                    Attempts.countDocuments({userId:userID,topic,isCorrect: true})
                ]);  
                return{
                    topic,
                    total,
                    correct,
                    accuracy:
                    total == 0 ? 0 : Math.round((correct/total) * 100)
                };
            })
         );
        res.status(200).json({
            totalMCQ: totalMcq,
            totalCoding,
            totalCorrect,
            totalAttempt,
            overallAccuracy,
            topics: topic
        });
    }
    catch(err){
        next(err)
    }
}

export const getRecentAttempts = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const attempts = await Attempts.find({ userId })
            .populate('questionId', 'title topic type')
            .sort({ createdAt: -1 })
            .limit(15);
        res.status(200).json(attempts);
    } catch (err) {
        next(err);
    }
}