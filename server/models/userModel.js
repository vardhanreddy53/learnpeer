import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const certificationSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  issuedDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'expired'], default: 'active' }
});

const teacherCredentialsSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  graduationYear: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  documentUrls: [{ type: String }],
  validationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  validationDate: Date
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: String,
  bio: String,
  certifications: [certificationSchema],
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  teachingCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  isValidatedTeacher: { type: Boolean, default: false },
  teacherCredentials: teacherCredentialsSchema
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;