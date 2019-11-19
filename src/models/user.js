const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true
  },
  lastName: {
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
    type: String,
  },
  vehicles: {
    type: String,
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
