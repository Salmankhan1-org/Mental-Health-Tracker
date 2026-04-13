const ThreadReply = require("../../models/Community/thread.reply.model");
const Thread = require("../../models/Community/community.thread.model");
const { GetUserId } = require("../../utils/User/get.user.id");

exports.CreateReplyForThreadReplyController = async (request, response) => {
    try {
       
        const { replyId } = request.params;
        const userId = GetUserId(request);
        const { content, isAnonymous } = request.body;

       
        const parentReplyDoc = await ThreadReply.findById(replyId).select('_id thread');
        if (!parentReplyDoc) {
            return response.status(404).json({
                statusCode: 404,
                success: false,
                error: [
                    { 
                        field: 'threadReply', 
                        message: "The comment you are replying to does not exist." 
                    }
                ],
                message: ''
            });
        }

        // 2. Validate Content
        if (!content?.trim()) {
            return response.status(400).json({
                statusCode: 400,
                success: false,
                error: [
                    { 
                        field: 'content', 
                        message: "Reply content cannot be empty" 
                    }
                ],
                message: ''
            });
        }

        // 3. Identity Management (Consistency across this specific thread)
        let anonymousIdentity = null;
        if (isAnonymous) {
            const existingAnonymousReply = await ThreadReply.findOne({
                thread: parentReplyDoc.thread,
                user: userId,
                isAnonymous: true
            }).select('anonymousIdentity');

            if (existingAnonymousReply) {
                anonymousIdentity = existingAnonymousReply.anonymousIdentity;
            } else {
                const names = ["Quiet Willow", "Calm River", "Brave Soul", "Soft Breeze", "Gentle Mind", "Peaceful Heart"];
                anonymousIdentity = names[Math.floor(Math.random() * names.length)];
            }
        }

      
        const [reply] = await Promise.all([
            ThreadReply.create({
                user: userId,
                thread: parentReplyDoc.thread, 
                parentReply: replyId,         
                content: content.trim(),
                isAnonymous: !!isAnonymous,
                anonymousIdentity: isAnonymous ? anonymousIdentity : null,
                isEdited: false
            }),
            
            ThreadReply.findByIdAndUpdate(replyId, {
                $inc: { 'stats.replyCount': 1 }
            }),
            
            Thread.findByIdAndUpdate(parentReplyDoc.thread, {
                $inc: { 'stats.replyCount': 1 }
            })
        ]);

        return response.status(201).json({
            statusCode: 201,
            success: true,
            error: [],
            data: reply,
            message: 'Nested Reply Created Successfully'
        });

    } catch (error) {
        return response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                { 
                    field: 'server', 
                    message: error.message 
                }
            ],
            message: ''
        });
    }
}