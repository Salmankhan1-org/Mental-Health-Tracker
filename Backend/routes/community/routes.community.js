const express = require('express');
const { isAuthenticated } = require('../../middlewares/authToken');
const { Validate } = require('../../middlewares/validate.request');
const { CreateThreadValidator } = require('../../validators/community/create.new.thread.validator');
const { CreateNewThreadController } = require('../../controllers/Community/create.new.thread.controller');
const { GetFilteredThreadsController } = require('../../controllers/Community/get.filtered.threads.controller');
const { DeleteCommunityThreadController } = require('../../controllers/Community/delete.community.thread.controller');
const { UpdateCommunityThreadController } = require('../../controllers/Community/update.community.thread');
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

module.exports = router;