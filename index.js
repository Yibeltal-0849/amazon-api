const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables (only needed for local development)
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Correct way to use Stripe with Firebase
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Success",
  });
});

app.post("/payment/create", async (req, res) => {
  const total = parseInt(req.query.total);
  if (total > 0) {
    // console.log("payment received ", total);
    // res.send(total);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
    });
  } else {
    res.status(403).json({
      message: "the total must be greater than zero",
    });
  }
});

app.listen(2025, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(
      "The server is running on Port number:2025 ,http://localhost:2025"
    );
  }
});
