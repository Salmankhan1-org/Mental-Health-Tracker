const express = require('express');
const { isAuthenticated } = require('../../middlewares/authToken');
const { Validate } = require('../../middlewares/validate.request');
const { CreateThreadValidator } = require('../../validators/community/create.new.thread.validator');
const { CreateNewThreadController } = require('../../controllers/Community/create.new.thread.controller');
const { GetFilteredThreadsController } = require('../../controllers/Community/get.filtered.threads.controller');
const { DeleteCommunityThreadController } = require('../../controllers/Community/delete.community.thread.controller');
const { UpdateCommunityThreadController } = require('../../controllers/Community/update.community.thread');
const { CreateNewReplyController } = require('../../controllers/Community/create.reply.controller');
const { GetThreadRepliesController } = require('../../controllers/Community/get.thread.replies.controller');
const { ReactOnThreadOrReplyController } = require('../../controllers/Community/create.thread.reaction.controller');
const { CreateReplyForThreadReplyController } = require('../../controllers/Community/create.reply.on.thread.reply.controller');
const { GetNestedRepliesController } = require('../../controllers/Community/get.nested.replies.controller');
const router = express.Router();


router.post('/thread/new',
    isAuthenticated,
    CreateThreadValidator,
    Validate,
    CreateNewThreadController
)

router.post('/threads/filter',
    isAuthenticated,
    GetFilteredThreadsController
);


router.post('/threads/react/:reactedId',
    isAuthenticated,
    ReactOnThreadOrReplyController
)

// create nested replies
router.post('/threads/reply/:replyId',
    isAuthenticated,
    CreateReplyForThreadReplyController
)

// Get nested replies
router.get('/threads/replies/:replyId/nested',
    isAuthenticated,
    GetNestedRepliesController
)

// Delete thread 
router.delete('/threads/:threadId/delete',
    isAuthenticated,
    DeleteCommunityThreadController
)

router.patch('/threads/:threadId/update',
    isAuthenticated,
    CreateThreadValidator,
    Validate,
    UpdateCommunityThreadController
)

router.post('/threads/:threadId/reply',
    isAuthenticated,
    CreateNewReplyController
)

router.get('/threads/:threadId/replies',
    isAuthenticated,
    GetThreadRepliesController
)


module.exports = router;