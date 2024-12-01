if (process.env.NODE_ENV != "production") {
    require("dotenv").config(); 
} 
// console.log(process.env);

const express = require("express"); // Importing Express framework

const app = express(); // Creating an instance of Express

const path = require("path"); // Importing Node.js path module

const mongoose = require("mongoose"); // Importing mongoose library for MongoDB

// const Listing = require("./models/listing.js");

const methodOverride = require("method-override"); // Importing method-override module

const ejsMate = require("ejs-mate"); // Importing ejs module

app.set("view engine", "ejs"); // Setting the view engine to EJS
app.set("views", path.join(__dirname, "views")); // Setting views directory

app.use(express.static(path.join(__dirname, "public"))); // Serving static files from 'public' directory

app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded bodies

app.use(methodOverride("_method")); // Middleware for HTTP method override

app.engine('ejs', ejsMate);

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// const wrapAsync = require("./utils/wrapAsync.js");

const ExpressError = require("./utils/expressError.js");

// const { listingSchema, reviewSchema } = require("./schema.js");

// const Review = require("./models/review.js");

const listingsRouter = require("./routes/listing.js");

// we can do same for review.js... 
const reviewsRouter = require("./routes/review.js");

const session = require("express-session");

const flash = require("connect-flash");

const passport = require("passport");

const LocalStrategy = require("passport-local");

const User = require("./models/user.js");

const userRouter = require("./routes/user.js");


main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}


const sessionOption = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


app.use(session(sessionOption));

app.use(flash()); 


app.use(passport.initialize());

app.use(passport.session());
// A web app needsd the ability to identify users as they brows from page to page. This series of request and response, each associated with the same user, is known as a session.

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use( (req, res, next)=> {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demouser", async(req, res) =>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
    
//     res.send(registeredUser);
// });



// const validateListing = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };

// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// }; 


app.use("/listings", listingsRouter);


// // Index Route
// app.get("/listings", async (req, res) => {
    //     const allListings = await Listing.find({});
    //     res.render("listings/index.ejs", { allListings });
    // });
    
    
// //New Route
// app.get("/listings/new", (req, res) => {
    //     res.render("listings/new.ejs");
    // });
    // //Create Route
    // app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    
        //     const newListing = new Listing(req.body.listing);
        //     await newListing.save();
        //     res.redirect("/listings");
        // })
    // );
    
    
// //Show Route
// app.get("/listings/:id", wrapAsync(async (req, res) => {
    //     let { id } = req.params;
    //     const listing = await Listing.findById(id).populate("reviews");
    //     res.render("listings/show.ejs", { listing });
// })
// );


// //Edit Route
// app.get("/listings/:id/edit", async (req, res) => {
    
    //     let { id } = req.params;
    //     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
// });
// //Update Route
// app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {

//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
// })
// );


// //Delete Route
// app.delete("/listings/:id", wrapAsync(async (req, res) => {
    //     let { id } = req.params;
    //     let deletedListing = await Listing.findByIdAndDelete(id);
    //     console.log(deletedListing);
    //     res.redirect("/listings");
    // })
    // );

    
    app.use("/listings/:id/reviews", reviewsRouter);
    
    // Reviews Post route 
    // app.post("/listings/:id/reviews", validateReview , wrapAsync (async(req, res) => {
        //     let listing = await Listing.findById(req.params.id);
        //     let newReview = new Review(req.body.review);
        
        //     listing.reviews.push(newReview);
        
        //     await newReview.save();
        //     await listing.save();
        
        //     req.flash("success", "New review created.");
        
        //     // console.log("New review saved");
        //     // res.send("New Review Saved");
        //     res.redirect(`/listings/${listing._id }`);
        // }));

        // Delete Review Route
        // app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res) => { 
            //     let { id, reviewId } = req.params;
            
            //     await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
            
            //     await Review.findByIdAndDelete(reviewId);

//     req.flash("success", "Review Deleted.");

//     res.redirect(`/listings/${id}`); 
// }));



app.use("/", userRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong." } = err;
    // res.status(statusCode).send(message);

    res.status(statusCode).render("error.ejs", { err });
    console.log(statusCode, message);
});


const port = 8080; // Defining the port number
app.listen(port, () => {
    console.log(`Listening on port : ${port}`);
});

