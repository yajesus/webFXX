const updateAdmins = async () => {
  const admins = await mongoose.connection
    .collection("admins")
    .find({})
    .toArray();
  for (let admin of admins) {
    if (admin.isAdmin === undefined) {
      await mongoose.connection.collection("admins").updateOne(
        { _id: admin._id },
        { $set: { isAdmin: false } } // Default value if missing
      );
    }
  }
};

updateAdmins();
