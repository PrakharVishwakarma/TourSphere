const express = require("express");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn } = require("../middlewares/middleware.js");

const { isOwner } = require("../middlewares/middleware.js");

const { validateListing } = require("../middlewares/middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");

const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

 
router
  .route("/").get(wrapAsync(listingController.index)).post(isLoggedIn ,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing)); 


  // .post( upload.single('listing[image]'), (req, res) => {
  //   res.send(req.file);
  // });
  // multer will create a upload folder and store the file in upload folder local storage  

//New Listing Form Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router 
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


//Edit Listing form Route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);



// Index Route for show all Listings
// router.get("/", wrapAsync(listingController.index));


//New Listing Form Route
// router.get("/new", isLoggedIn, listingController.renderNewForm);

//Create New Listing Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));


//Show Listing Route
// router.get("/:id", wrapAsync(listingController.showListing));


//Edit Listing form Route
// router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

//Update Listing Route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.updateListing)
// );


//Delete Listing Route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.destroyListing)
// );

module.exports = router;
