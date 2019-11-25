const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String
  },
  passwordConfirmation: {
    type: String
  },
  uid: {
    type: String,
  },
  photo: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  address: {
    type: String,
  },
  destinationAddress: {
    address: { type: String },
    zipCode: { type: String },
    neib: { type: String }
  },
  vehicles: {
    name: { type: String },
    fuel: { type: String },
    brand: { type: String },
    km: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

},


);

//Aqui utiliza "UserSchema.pre" para criptografar a senha do usuário automaticamente toda vez que um novo usuário for criado ou alterado.
UserSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 8);
});

UserSchema.methods = {
  //faz a comparação da senha para validar se a senha digitada está correta
  compareHash(hash) {
    return bcrypt.compare(hash, this.password);
  },

  //Gera o token JWT
  generateToken() {
    return jwt.sign({ id: this.id }, "secret", {
      expiresIn: 86400
    });
  }
};

mongoose.model("User", UserSchema);
