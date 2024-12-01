const Listing = require("../models/listing.js");

const Review = require("../models/review.js");


module.exports.createReview = async (req, res) => {
    // Using mergeParams: true in const router = express.Router({ mergeParams: true });
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New review created.");

    // console.log("New review saved");
    // res.send("New Review Saved");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted.");

    res.redirect(`/listings/${id}`);
}