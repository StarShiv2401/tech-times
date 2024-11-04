//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "";
const aboutContent = "";
const contactContent = "";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-shivansh:jaishreeram@cluster0.vq0xozk.mongodb.net/blogDB");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const Post = mongoose.model("post", postSchema);

app.get("/", function(req, res){
  Post.find({})
  .then((posts) => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/publish", function(req, res){
  res.render("publish");
});

app.post("/publish", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save().then(() => {res.redirect("/")});
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId})
  .then((post) => {
    res.render("post",{
      title: post.title,
      content: post.content
    });
  });

});
// Contact model
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model("Contact", contactSchema);

// Contact form submission route
app.post("/contact", function(req, res) {
  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message
  });

  contact.save()
    .then(() => {
      res.send(`
        <script>
          alert("Thank you for contacting us! We will get back to you soon.");
          window.location.href = "/";
        </script>
      `);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send(`
        <script>
          alert("There was an error submitting your message. Please try again later.");
          window.location.href = "/";
        </script>
      `);
    });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
