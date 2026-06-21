import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    atsHistory: [{
        jobTitle: String,
        matchScore: Number,
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Hash the password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password on login
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// THIS IS THE CRUCIAL LINE!
export default mongoose.model('User', userSchema);