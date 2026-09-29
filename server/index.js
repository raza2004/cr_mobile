// API for the CR mobile app. Routes are ported from CR_Client/src/app/api/*,
// with next-auth sessions replaced by bearer tokens (see auth.js).
import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { Server } from "socket.io";

import { requireAuth, signToken } from "./auth.js";
import { sendEmail } from "./mailer.js";
import Client from "./models/clientModel.js";
import Item from "./models/itemsModel.js";
import Message from "./models/message.js";
import Moodboard from "./models/moodboardsModel.js";
import Presentation from "./models/presentationsModel.js";
import ShoppingList from "./models/shoppingListModel.js";
import StylistProfile from "./models/profileStylistModel.js";
import User from "./models/userModel.js";

const app = express();
app.use(cors());
// Items and moodboards are stored as base64 images, so allow large bodies.
app.use(express.json({ limit: "50mb" }));

// â”€â”€â”€ Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Replaces the next-auth credentials provider in CR_Client/src/libs/authOptions.ts
app.post("/api/mobile/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Client.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Email not registered" });
    }
    const passwordsMatch = await bcryptjs.compare(password, user.password || "");
    if (!passwordsMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    return res.json({
      token: signToken(user),
      user: { _id: user._id, email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// â”€â”€â”€ Items â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.get("/api/items", requireAuth, async (req, res) => {
  try {
    const items = await Item.find({ userEmail: req.user.email });
    return res.json({ success: true, data: items });
  } catch {
    return res.status(500).json({ error: "Error fetching items" });
  }
});

app.post("/api/items", requireAuth, async (req, res) => {
  try {
    const newItem = await Item.create({ userEmail: req.user.email, ...req.body });
    return res.status(201).json({ success: true, data: newItem });
  } catch {
    return res.status(500).json({ error: "Error creating item" });
  }
});

app.put("/api/items", requireAuth, async (req, res) => {
  try {
    const { _id, userEmail, ...updateData } = req.body;
    const updatedItem = await Item.findOneAndUpdate(
      { _id, userEmail: req.user.email },
      updateData,
      { returnDocument: "after", runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    return res.json({ success: true, data: updatedItem });
  } catch {
    return res.status(500).json({ error: "Error updating item" });
  }
});

app.delete("/api/items", requireAuth, async (req, res) => {
  try {
    const result = await Item.deleteOne({ _id: req.query.id, userEmail: req.user.email });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    return res.json({ success: true, data: {} });
  } catch {
    return res.status(500).json({ error: "Error deleting item" });
  }
});

// â”€â”€â”€ Profile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.get("/api/profile", requireAuth, async (req, res) => {
  try {
    const clientData = await Client.findOne({ email: req.user.email }).select("-password");
    if (!clientData) {
      return res.status(404).json({ error: "User profile not found" });
    }
    return res.json(clientData);
  } catch {
    return res.status(500).json({ error: "Error fetching user profile data" });
  }
});

app.post("/api/profile", requireAuth, async (req, res) => {
  try {
    // email is the account key, so it is never updated from the body.
    const { password, image, email, _id, ...updateData } = req.body;
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      updateData.password = await bcryptjs.hash(password, salt);
    }
    if (image) {
      updateData.image = image;
    }
    const updatedClient = await Client.findOneAndUpdate(
      { email: req.user.email },
      updateData,
      { returnDocument: "after" }
    ).select("-password");
    if (!updatedClient) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(updatedClient);
  } catch {
    return res.status(500).json({ error: "Error updating user profile data" });
  }
});

// â”€â”€â”€ Moodboards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.get("/api/moodboards", requireAuth, async (req, res) => {
  try {
    const moodboards = await Moodboard.find({ userEmail: req.user.email });
    return res.json({ success: true, data: moodboards });
  } catch {
    return res.status(500).json({ error: "Error fetching moodboards" });
  }
});

app.post("/api/moodboards", requireAuth, async (req, res) => {
  try {
    const newMoodboard = await Moodboard.create({
      userEmail: req.user.email,
      name: req.body.name,
      images: req.body.images,
    });
    return res.status(201).json({ success: true, data: newMoodboard });
  } catch {
    return res.status(500).json({ error: "Error creating moodboard" });
  }
});

app.put("/api/moodboards", requireAuth, async (req, res) => {
  try {
    const { _id, userEmail, ...updateData } = req.body;
    const updatedMoodboard = await Moodboard.findOneAndUpdate(
      { _id, userEmail: req.user.email },
      updateData,
      { returnDocument: "after", runValidators: true }
    );
    if (!updatedMoodboard) {
      return res.status(404).json({ error: "Moodboard not found" });
    }
    return res.json({ success: true, data: updatedMoodboard });
  } catch {
    return res.status(500).json({ error: "Error updating moodboard" });
  }
});

app.delete("/api/moodboards", requireAuth, async (req, res) => {
  try {
    const result = await Moodboard.deleteOne({ _id: req.query.id, userEmail: req.user.email });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Moodboard not found" });
    }
    return res.json({ success: true, data: {} });
  } catch {
    return res.status(500).json({ error: "Error deleting moodboard" });
  }
});

// â”€â”€â”€ Messages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.get("/api/messages", requireAuth, async (req, res) => {
  const { senderId, receiverId } = req.query;
  if (!senderId || !receiverId) {
    return res.status(400).json({ success: false, error: "Missing senderId or receiverId" });
  }
  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });
    return res.json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/messages", requireAuth, async (req, res) => {
  const { sender, receiver, content } = req.body;
  if (!sender || !receiver || !content) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }
  try {
    const message = await Message.create({ sender, receiver, content, timestamp: new Date() });
    return res.json({ success: true, message });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.patch("/api/messages", requireAuth, async (req, res) => {
  const { messageId } = req.query;
  const { status } = req.body;
  if (!messageId || !status) {
    return res.status(400).json({ success: false, error: "Missing messageId or status" });
  }
  try {
    const message = await Message.findByIdAndUpdate(messageId, { status }, { returnDocument: "after" });
    if (!message) {
      return res.status(404).json({ success: false, error: "Message not found" });
    }
    return res.json({ success: true, message });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// â”€â”€â”€ Presentations / Shopping lists / Stylist â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.get("/api/presentations", requireAuth, async (req, res) => {
  try {
    const presentations = await Presentation.find({ clientEmail: req.user.email });
    return res.json({ presentations });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/shopping-list", requireAuth, async (req, res) => {
  try {
    const shoppingLists = await ShoppingList.find({ clientEmail: req.user.email });
    return res.json({ shoppingLists });
  } catch {
    return res.status(500).json({ error: "Error fetching shopping lists" });
  }
});

app.get("/api/stylist", requireAuth, async (req, res) => {
  try {
    const clientData = await Client.findOne({ email: req.user.email });
    if (!clientData) {
      return res.status(404).json({ error: "Client not found" });
    }
    const stylistEmail = clientData.stylist;
    const stylistProfile = await StylistProfile.findOne({ user_email: stylistEmail });
    const userProfile = await User.findOne({ email: stylistEmail }).select("-password");
    if (!userProfile) {
      return res.status(404).json({ error: "Stylist's full name not found" });
    }
    return res.json({ userProfile, stylistProfile, clientId: clientData._id });
  } catch {
    return res.status(500).json({ error: "Error fetching stylist profile" });
  }
});

// â”€â”€â”€ Signup / password flows â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.post("/api/users/client-signup", async (req, res) => {
  try {
    const { email, password, ...profile } = req.body;
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const allowed = [
      "stylist", "fullName", "age", "image", "height", "footSize", "shoulders",
      "waist", "breast", "hips", "favoriteColors", "tabooColors", "neverWear",
      "rhythmOfLife", "preferredShoes", "dreamOutfit", "needWeekendItems",
      "influencersStyle", "favoriteBrands", "priceSegment", "expectations",
    ];
    const update = { password: hashedPassword, isVerifiedemail: true };
    for (const key of allowed) {
      if (profile[key] !== undefined && profile[key] !== "") update[key] = profile[key];
    }

    const updatedClient = await Client.findOneAndUpdate({ email }, update, { returnDocument: "after" });
    if (!updatedClient) {
      return res.status(404).json({ error: "No invitation found for this email" });
    }
    return res.json({ message: "User profile updated successfully", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/users/forgetPassword", async (req, res) => {
  try {
    const user = await Client.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await sendEmail({ email: user.email, emailType: "RESET", userId: user._id });
    return res.json({ message: "Password reset link sent to email", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/users/setPassword", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await Client.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(newPassword, salt);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();
    return res.json({ message: "Password reset successful", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/users/verifyEmail", async (req, res) => {
  try {
    const user = await Client.findOne({
      verifyEmailToken: req.body.token,
      verifyEmailTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    }
    user.isVerifiedemail = true;
    user.verifyEmailToken = undefined;
    user.verifyEmailTokenExpiry = undefined;
    await user.save();
    return res.json({ message: "Email verified successfully", success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// â”€â”€â”€ Socket.IO (ported from CR_Client/server.cjs) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("join", ({ role, userId }) => {
    socket.join(role);
    socket.join(userId);
  });
  socket.on("private_message", ({ content, to, from }) => {
    io.to(to).emit("private_message", { content, from, sender: from, receiver: to, timestamp: new Date() });
  });
});

const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    server.listen(PORT, () => console.log(`CR mobile API listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
