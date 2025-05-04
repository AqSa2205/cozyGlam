const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

// User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: { type: String, unique: true},
    phone_number: { type: String, unique: true},
    password: String,
    role: { type: String, enum: ['customer', 'admin', 'freelancer', 'seller'], default: 'customer' },
    profile_picture_url: String,
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    loyalty_balance: {
      points: { type: Number, default: 0 }
    },
    status: { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },
    isStoreCreated: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
}
);

UserSchema.pre('save', function(next) {
    if (this.role !== 'seller') {
      this.isStoreCreated = undefined; // Remove field for non-sellers
  }
  next();
  })
  
const User =  mongoose.model('User', UserSchema)
//export collection
module.exports =  User;