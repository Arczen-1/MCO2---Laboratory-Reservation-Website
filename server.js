const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const hbs = require("hbs");
const {Users, Seats} = require("./Model/mongodb");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const session = require("express-session");

const seats = [
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "A6",
  "A7",
  "A8",
  "A9",
  "A10",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "B9",
  "B10",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
  "C9",
  "C10",
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
  "D8",
  "D9",
  "D10",
];

// Set the views directory for your Handlebars templates
const templatePath = path.join(__dirname, "View", "public", "hbs");
app.set("views", templatePath);
app.set("view engine", "hbs");


// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const staticPath = path.join(__dirname, "View", "public");
app.use("/static", express.static(staticPath));
const controllerPath = path.join(__dirname, "Controller");
app.use("/static/Controller", express.static(controllerPath));

// Validation middleware for the /signup route
const validateSignup = [
  body("username")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one capital letter"),

  // Add more validation rules as needed
];


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname,  "View", "public")));

// Sample data for Users
const usersData = [
  { username: "Zen", email: "Zen@example.com", password: bcrypt.hashSync("password1", 10), course: "Information Technology", type: "Student" },
  { username: "Jacob", email: "Jacob@example.com", password: bcrypt.hashSync("password2", 10), course: "Information Technology", type: "Student" },
  { username: "Kerwin", email: "Kerwin@example.com", password: bcrypt.hashSync("password3", 10), course: "Computer Science", type: "Teacher" },
  { username: "Bryan", email: "Bryan@example.com", password: bcrypt.hashSync("password4", 10), course: "Information Technology", type: "Student" },
  { username: "Gabe", email: "Gabe@example.com", password: bcrypt.hashSync("password5", 10), course: "Information Technology", type: "Student" }
];

// Sample data for Seats
const seatsData = [
  { name: "Deez", seat: "A1", isAnonymous: false, reservationDate: new Date("2023-12-04"), reservationTime: "7:00", room: "AG1904" },
  { name: "Deez", seat: "B2", isAnonymous: true, reservationDate: new Date("2023-12-05"), reservationTime: "8:00", room: "AG1904"  },
  { name: "Zen", seat: "C1", isAnonymous: false, reservationDate: new Date("2023-12-04"), reservationTime: "9:00", room: "GK306A"  },
  { name: "Gabe", seat: "B2", isAnonymous: true, reservationDate: new Date("2023-12-05"), reservationTime: "10:00", room: "GK302B" },
  { name: "Jacob", seat: "D1", isAnonymous: false, reservationDate: new Date("2023-12-04"),  reservationTime: "11:00",room: "GK302B" }
];

Users.insertMany(usersData);
Seats.insertMany(seatsData);

// Favicon route
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { message: "Internal Server Error" });
});

// Default route to serve homie.hbs
app.get("/", (req, res) => {
  res.render("homie");
});


app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", validateSignup, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("signup", { errors: errors.array() });
  }

  var gotPassword = req.body.password;
  const hash = bcrypt.hashSync(gotPassword, 10);
  gotPassword = hash;

  const data = {
    username: req.body.username,
    password: gotPassword,
    email: req.body.email,
    course: req.body.course,
    type: req.body.type
  };

  try {
    await Users.insertMany([data]);
    res.render("login");
  } catch (error) {
    console.error("Error inserting data into MongoDB:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/logout", (req, res) => {
  req.session.user = null; 
  const username = "Guest";
  res.render("homie", { username });
});

app.get("/login", (req, res) => {
  const username = req.session.user?.username || "Guest";
  res.render("login", { username });
});



app.post("/login", async (req, res) => {
  const  username = req.body.username;
  var value = req.body.password;
  let isLoggedIn = false; 
  const errors = [];

  try {
    const user = await Users.findOne({ username });

    if (!user || !bcrypt.compareSync(value, user.password)) {
      errors.push({ msg: "Invalid username or password" });
      res.render("login", { errors });
      return;
    }

    isLoggedIn = true; 

    const loggedInUser = username ?? "Guest";
    req.session.user = user;
   

    res.render("homie", { username: req.session.user.username, isLoggedIn }); 
  } catch (error) {
    console.error("Error querying MongoDB:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});


app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  next();
});

app.get("/homie", (req, res) => {
  const username = req.session.user || "Guest";
  console.log(username);
  res.render("homie", { username });
});

app.get('/view_user', (req, res) => {
    console.log(res.locals.currentUser);
    
    const isLoggedIn = res.locals.currentUser ? true : false;
    const username = req.session.user || "Guest";

    res.render('view_user', { currentUser: username, isLoggedIn });
});
app.get('/edit_user', (req, res) => {
  res.render("edit_user");
});

app.post('/edit_user', async (req, res) => {
  const currentUser = req.session.user; 

  if (!currentUser) {
      return res.redirect('/login');
  }

  var gotPassword = req.body.password;
  const hash = bcrypt.hashSync(gotPassword, 10);
  gotPassword = hash;

  const updatedData = {
      username: req.body.username,
      password: gotPassword,
      email: currentUser.email, 
      course: req.body.course,
      type: req.body.type
  };

  try {
      await Users.updateOne({ _id: currentUser._id }, updatedData);

      req.session.user = { ...currentUser, ...updatedData };

      res.redirect('/homie'); 
  } catch (error) {
      console.error('Error updating data in MongoDB:', error);
      res.status(500).render('error', { message: 'Internal Server Error' });
  }
});

app.get("/delete_user", (req, res) => {
  res.render("delete_user");
});

app.post("/delete_user", async (req, res) => {
  const currentUser = req.session.user; 
  if (!currentUser) {
      return res.redirect('/login');
  }
  try {
    await Users.deleteOne({ _id: currentUser._id });
      req.session.user = null; 
      const username = "Guest";
      res.render("homie", { username }); 
} catch (error) {
    console.error('Error updating data in MongoDB:', error);
    res.status(500).render('error', { message: 'Internal Server Error' });
}
});

app.get("/reserve", (req, res) => {
  try {
    console.log("Seats:", seats);
    res.render("reserve_for_student", { seats });
  } catch (error) {
    console.error("Error rendering reserve page:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});
app.post("/reserve-seat", async (req, res) => {
  const currentUser = req.session.user;
  const { name, seat, selectedDate, selectedTime, isAnonymous, room } = req.body;

  if (!seat || !selectedDate) {
    return res.status(400).json({ error: 'Seat, selected date, and selected time information are required.' });
  }

  try {

    if ((isAnonymous)||currentUser.username == name) {
      await Seats.findOneAndUpdate(
        { seat, reservationDate: selectedDate, reservationTime: selectedTime},
        { name : currentUser.username, seat, reservationDate: selectedDate, reservationTime: selectedTime, isAnonymous, room},
        { upsert: true, new: true }
      );
      res.json({ message: 'Seat reserved successfully.' });
    } else if (currentUser.type == "Teacher") {
      await Seats.findOneAndUpdate(
        { seat, reservationDate: selectedDate},
        { name, seat, reservationDate: selectedDate, isAnonymous, room},
        { upsert: true, new: true }
      );
      res.json({ message: 'Seat reserved successfully.' });
    }else{
      return res.status(400).json({ error: 'You cannot reserve for this person' });
    }

  } catch (error) {
    console.error('Error reserving seat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/reserved-seats", async (req, res) => {
  const { date, room, time} = req.query;
  
  if (!date) {
    return res.status(400).json({ error: 'Date is required.' });
  }

  try {

    const reservedSeats = await Seats.find({
       reservationDate: new Date(date), 
       room, 
       reservationTime: time});

    res.json({ reservedSeats: reservedSeats.map(seat => seat.seat)});
  } catch (error) {
    console.error('Error fetching reserved seats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/edit_reservations", async (req, res) => {
  res.render("edit_reservations");
});

app.get("/remove", async (req, res) => {
  try {
    console.log("Seats:", seats);
  res.render("remove_reservation", { seats });
  }catch (error) {
    console.error("Error rendering reserve page:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});

app.post('/remove-seat', async (req, res) => {
  const currentUser = req.session.user;
  const { seat, selectedDate } = req.body;
  const currSeat = await Seats.findOne({seat, reservationDate: selectedDate});

  if (!seat || !selectedDate) {
    return res.status(400).json({ error: 'Seat and selected date information are required.' });
  }

  try {
    if (currentUser.username == currSeat.name || currentUser.type == "Teacher") {
      await Seats.deleteOne({ seat, reservationDate: selectedDate });
      res.json({ message: 'Seat reservation removed successfully.' });
    }else{
      res.status(400).json({ message: 'You are not allowed to remove this reservation.' });
    }
  } catch (error) {
    console.error('Error removing seat reservation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/view_reservations", async (req, res) => {

  try {
      const reservations = await Seats.find();
      res.render('view_reservations', { reservations });

  } catch (error) {

    console.error('Error fetching reservations:', error);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
});

app.get("/view_slot", async (req, res) => {
  try {
  console.log("Seats:", seats);
  res.render("view_slot", { seats });
  }catch (error) {
    console.error("Error rendering reserve page:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});



app.get("/306A", async (req, res) => {
  try {

    console.log("Seats:", seats);
    res.render("GK306A", { seats });
  } catch (error) {
    console.error("Error rendering reserve page:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});
app.get("/302B", async (req, res) => {
  try {
    console.log("Seats:", seats);
    res.render("GK302B", { seats });
  } catch (error) {
    console.error("Error rendering reserve page:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});

app.get("/about", async (req, res) => {
  res.render("about");
});

app.get("/view_slot_GK306A", async (req, res) => {
  try {
  console.log("Seats:", seats);
  res.render("view_slot_GK306A", { seats });
  }catch (error) {
    console.error("Error rendering reserve page:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});

app.get("/view_slot_GK302B", async (req, res) => {
  try {
  console.log("Seats:", seats);
  res.render("view_slot_GK302B", { seats });
  }catch (error) {
    console.error("Error rendering reserve page:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});
app.get("/view_slot_GK306A", async (req, res) => {
  res.render("view_slot_GK306A");
});

app.get("/view_slot_GK302B", async (req, res) => {
  res.render("view_slot_GK302B");
});

app.get("/remove_reservation_GK302B", async (req, res) => {
  try {
  console.log("Seats:", seats);
  res.render("remove_reservation_GK302B", { seats });
  }catch (error) {
    console.error("Error rendering reserve page:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});

app.get("/remove_reservation_GK306A", async (req, res) => {
  try {
  console.log("Seats:", seats);
  res.render("remove_reservation_GK306A", { seats });
  }catch (error) {
    console.error("Error rendering reserve page:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});

app.get("/remove_reservation_GK306A", async (req, res) => {
  res.render("remove_reservation_GK306A");
});

app.get("/remove_reservation_GK302B", async (req, res) => {
  res.render("remove_reservation_GK302B");
});

// Start the server
app.listen(port, () => {
  console.log("Server is running at http://localhost:${port}");
});

