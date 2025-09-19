import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email address'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastLogin:{
    type: Date,
    default: Date.now
  },
  favorites: [{
    propertyId: {
      type: String,
      required: true
    },
    propertyType: {
      type: String,
      enum: ['database', 'simplyrets'],
      required: true
    },
    propertyData: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

export default mongoose.model('User', userSchema);
