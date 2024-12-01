const express = require("express"); 

const router = express.Router({ mergeParams : true});

const wrapAsync = require("../utils/wrapAsync");

const {validateReview, isLoggedIn, isReviewAuthor} = require("../middlewares/middleware.js");

const reviewController = require("../controllers/reviews.js");


// Reviews Post route 
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;