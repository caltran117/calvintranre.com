import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
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
  consent: {
    type: Boolean,
    required: true,
    default: true
  },
  numberOfEmails: {
    type: Number,
    default: 0,
    min: 0
  },
  isSubscribed: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date,
    default: null
  },
  lastEmailSent: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

newsletterSchema.index({ isSubscribed: 1 });
newsletterSchema.index({ consent: 1 });
newsletterSchema.index({ subscribedAt: -1 });

newsletterSchema.pre('save', function(next) {
  if (this.isModified('isSubscribed')) {
    if (!this.isSubscribed && !this.unsubscribedAt) {
      this.unsubscribedAt = new Date();
    } else if (this.isSubscribed) {
      this.unsubscribedAt = null;
      if (!this.subscribedAt) {
        this.subscribedAt = new Date();
      }
    }
  }
  next();
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;