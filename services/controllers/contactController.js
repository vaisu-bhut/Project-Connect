const Contact = require("../models/Contact");

// Get all contacts
exports.getAllContacts = async (req, res) => {
  try {
    const userId = req.userId;

    const contacts = await Contact.find({
      userId: userId,
    }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single contact
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not" });
    }
    res.json(contact);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Contact not" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Create a new contact
exports.createContact = async (req, res) => {
  try {
    const userId = req.userId;
    const interaction = new Contact({
      ...req.body,
      userId,
    });
    const contact = new Contact(interaction);
    const savedContact = await contact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a contact
exports.updateContact = async (req, res) => {
  try {
    const userId = req.userId;

    const contact = await Contact.findByIdAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};