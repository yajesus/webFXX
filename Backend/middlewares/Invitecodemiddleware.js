const crypto = require("crypto");
const InviteCode = require("../models/Invitecode"); // Import the schema

const generateInviteCode = async () => {
  try {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();

    // Check if the code is unique
    const existingCode = await InviteCode.findOne({ code });
    if (existingCode) {
      return generateInviteCode(); // Retry if the code is not unique
    }

    const inviteCode = new InviteCode({ code });
    await inviteCode.save();

    return code;
  } catch (error) {
    console.error("Error generating invite code:", error);
  }
};

module.exports = generateInviteCode;
