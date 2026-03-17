const Counsellor = require("../../../models/Counsellors/counsellor.model");
const CounsellorReview = require("../../../models/Counsellors/review.model");
const { GetCounsellorId } = require("../../../utils/Counsellors/get.counselor.id");
const { GetUserId } = require("../../../utils/User/get.user.id");

exports.CreateNewReviewForCounsellorController = async (request, response) => {
    try {

        const userId = GetUserId(request);
        const counsellorId = GetCounsellorId(request);
        let { rating, review } = request.body;

        rating = Number(rating);

        // Check if user already reviewed this counsellor
        const existingReview = await CounsellorReview.findOne({
            user: userId,
            counsellor: counsellorId
        });

        if (existingReview) {

            const oldRating = existingReview.rating;

            // Update review
            existingReview.rating = rating;
            existingReview.comment = review;
            await existingReview.save();

            // Update counsellor average
            const counsellor = await Counsellor.findById(counsellorId);

            const totalRating =
                counsellor.rating.average * counsellor.rating.count - oldRating + rating;

            const newAverage = totalRating / counsellor.rating.count;

            await Counsellor.findByIdAndUpdate(counsellorId, {
                "rating.average": newAverage
            });

            return response.status(200).json({
                statusCode: 200,
                success: true,
                error: [],
                message: "Review updated successfully"
            });
        }else{

             // Create new review
            const newReview = await CounsellorReview.create({
                rating,
                comment: review,
                user: userId,
                counsellor: counsellorId
            });

            const counsellor = await Counsellor.findById(counsellorId);

            const newCount = counsellor.rating.count + 1;

            const newAverage =
            ((counsellor.rating.average * counsellor.rating.count) + rating) / newCount;

            await Counsellor.findByIdAndUpdate(counsellorId, {
            "rating.average": newAverage,
            "rating.count": newCount
            });

            return response.status(201).json({
                statusCode: 201,
                success: true,
                error: [],
                message: "Review submitted successfully"
            });

        }

       

    } catch (error) {
        return response.status(500).json({
            statusCode: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: error?.message
                }
            ],
            message: ""
        });
    }
};