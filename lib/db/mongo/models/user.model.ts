import bcrypt from "bcryptjs";
import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
  type: "shipping" | "billing" | "both";
}

export interface IUserPreferences {
  language: string;
  currency: string;
  newsletter: boolean;
  marketingEmails: boolean;
  orderUpdates: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "farmer" | "buyer" | "supplier";
  region?: string;
  specialty?: string;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  addresses: IAddress[];
  preferences?: IUserPreferences;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddress>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  postalCode: { type: String },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  type: {
    type: String,
    enum: ["shipping", "billing", "both"],
    default: "both",
  },
});

const UserPreferencesSchema = new Schema<IUserPreferences>({
  language: { type: String, default: "fr" },
  currency: { type: String, default: "MGA" },
  newsletter: { type: Boolean, default: true },
  marketingEmails: { type: Boolean, default: false },
  orderUpdates: { type: Boolean, default: true },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "farmer", "buyer", "supplier"],
      default: "buyer",
    },
    region: { type: String },
    specialty: { type: String },
    phone: { type: String },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    addresses: [AddressSchema],
    preferences: { type: UserPreferencesSchema, default: () => ({}) },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
