import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcrypt';

export type UserType = Document & {
    email: string,
    password: string,
    name: string,
    confirmed: boolean,
    verifyPassword(passwordForm: string): Promise<boolean>
}

const UserSchema : Schema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    confirmed: {
        type: Boolean,
        default: false
    }
});

//Validar Passowrd
UserSchema.methods.verifyPassword = async function(passwordForm) {
    return bcrypt.compare(passwordForm, this.password);
}

const User = mongoose.model<UserType>('User', UserSchema);

export default User;