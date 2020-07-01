const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const router = express.Router();
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

// let data = [];
// db.collection("collections")
//   .where("items", "array-contains", "1")
//   .get()
//   .then((snapshot) => {
//     snapshot.forEach((doc) => {
//       console.log(doc.data()["items"][0]["id"]);
//     });
//   })
//   .catch((err) => console.log(err));

// db.collectionGroup('items')
//   .where('id', '==', '1')
//   .get()
//   .then((docs) => {
//     docs.forEach((doc) => {
//       console.log(doc.data());
//     });
//   })
//   .catch((err) => console.log(err));

// var collectionsRef = db.collectionGroup("collections");
// collectionsRef.get().then(function (querySnapshot) {
//   var idArray = [];
//   querySnapshot.forEach(function (docs) {
//     idArray.push(docs.data().items);
//   });
//   var i = 0;
//   idArray.forEach((element) => {
//     console.log("items are ", element.length);
//     element.forEach((subElement) => {
//       console.log("subelements are ", subElement.barcode);
//     });
//   });
// });

// db.collection("collections")
//   .doc("EVxsy3XKO4U9ZJQMJPwy")
//   .get()
//   .then((docs) => console.log(docs.data()))
//   .catch((err) => console.log(err));

app.listen(port, (error) => {
  if (error) throw error;
  console.log("Server running on port " + port);
});

const getProduct = (req, res, next) => {
  const barcodeId = req.params.barcodeId;
  console.log("barcode scanned is " + barcodeId);
  db.collection("collections")
    //.where("items.id", "==", 1)
    .get()
    .then((snapshot) => {
      // if (snapshot.empty) {
      //   console.log("No matching documents.");
      //   res.status(404).json({ message: "No matching documents.", data: null });
      //   return;
      // }
      //   snapshot.forEach((doc) => {
      //     console.log(doc.id, "=>", doc.data());
      //     res.status(200).json({ message: "Barcode fetched.", data: doc.data() });
      //   });
      // })
      var items = [];
      snapshot.forEach(function (doc) {
        items.push(doc.data().items);
      });
      items.forEach((element) => {
        element.forEach((subElement) => {
          //console.log("got element ", subElement);
          if (subElement.barcode == barcodeId) {
            console.log("item is ", subElement);
            res
              .status(200)
              .json({ message: "Barcode fetched.", data: subElement });
          }
        });
      });
    })
    .catch((err) => {
      console.log("Error getting documents", err);
      res.status(500).json({ message: "Error getting documents", data: err });
    });
  //console.log(barcodeId);
};

app.get("/scan/:barcodeId", getProduct);

app.post("/payment", (req, res) => {
  const body = {
    source: req.body.token.id,
    amount: req.body.amount,
    description: "payments for shopfree.club",
    currency: "inr",
  };

  stripe.charges.create(body, (stripeErr, stripeRes) => {
    if (stripeErr) {
      res.status(500).send({ error: stripeErr });
    } else {
      res.status(200).send({ success: stripeRes });
    }
  });
});
