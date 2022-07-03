const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const Artisan = require("./models/Artisan");
const Client = require("./models/Client");
require("dotenv").config();

router.post("/auth/artisan", async (req, res) => {
  try {
    const { name, phoneNumber, password, city, address, image, skills } =
      req.body;
    console.log(req.body, typeof req.body.skills, ...req.body.skills);
    const user = await Artisan.findOne({ phoneNumber });
    console.log(user);
    if (user) {
      const match = bcrypt.compareSync(password, user.password);
      if (!match) {
        return res
          .status(500)
          .json({ message: "Phone Number or password incorrect" });
      }
      req.session.user = { ...user, status: "artisan" };
      req.session.save((err) => console.log(err));
      console.log("login", req.session);

      return res.status(200).json({ user });
    } else {
      if (!name) {
        return res
          .status(200)
          .json({ message: "New user, add name and stuff" });
      }
      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      const newArtisan = new Artisan({
        name,
        phoneNumber,
        password: hash,
        city,
        address,
        image,
      });
      newArtisan.skills.push(...skills);
      console.log(newArtisan);
      await newArtisan.save();
      req.session.user = { ...newArtisan._doc, status: "artisan" };
      req.session.save((err) => console.log(err));
      console.log("signup", req.session);
      return res.status(200).json({ user: newArtisan });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/auth/client", async (req, res) => {
  try {
    const { name, phoneNumber, password } = req.body;
    console.log(req.body);
    const user = await Client.findOne({ phoneNumber });
    console.log(user);
    if (user) {
      const match = bcrypt.compareSync(password, user.password);
      if (!match) {
        return res
          .status(500)
          .json({ message: "Phone Number or password incorrect" });
      }
      req.session.user = { ...user, status: "artisan" };
      req.session.save((err) => console.log(err));
      console.log("login", req.session);

      return res.status(200).json({ user });
    } else {
      if (!name) {
        return res.status(200).json({ message: "New user, add name " });
      }
      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      const newClient = new Client({
        name,
        phoneNumber,
        password: hash,
      });
      await newClient.save();
      req.session.user = { ...newClient._doc, status: "artisan" };
      req.session.save((err) => console.log(err));
      console.log("signup", req.session);
      return res.status(200).json({ user: newClient });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/search/:city", async (req, res) => {
  try {
    const { city } = req.params;
    const user = await Artisan.find({ city });
    console.log(req.session.user);
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/search/:skill", async (req, res) => {
  try {
    const { skill } = req.params;
    const users = await Artisan.find({ "skill.name": skill });
    console.log(req.session.user);
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/details/:person/:id", async (req, res) => {
  try {
    const { id, person } = req.params;
    console.log(id);
    let User = person === "artisan" ? Artisan : Client;
    const user = await User.findById(id);
    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.put("/update-profile/:person/:id", async (req, res) => {
  try {
    const { person, id } = req.params;
    let User = person === "artisan" ? Artisan : Client;
    if (req.body.skills) {
      const user = User.findById(id);
      user.skills.push(...skills);
      await user.save();
    }
    const user = await User.findByIdAndUpdate(id, { ...req.body });
    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User Updated Successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/delete-profile/:person/:id", async (req, res) => {
  try {
    const { person } = req.params;
    let User = person === "artisan" ? Artisan : Client;
    const user = await User.findByIdAndDelete({ id });
    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
