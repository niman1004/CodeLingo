import mongoose , {Schema} from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const UserSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true, 
        lowercase: true,
        trim:true
    },
    email:{
        type: String, 
        required: true , 
        unique: true, 
        lowercase: true,
        trim:true
    },
    password:{
        type: String, 
        required: true
    },
    dailyGoal:{
        type: Number,
        default:1
    },
    maxStreak:{
        type: Number,
        default:0
    },
    lastSubmitted:{
        type: Date
    },
    currStreak:{
        type: Number,
        default:0
    },
    refreshToken:{
        type: String
    }
})

UserSchema.pre("save" , async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password , 10)
        next()
    }
   else return next()
} )

UserSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password , this.password)
}

UserSchema.methods.generateAccessToken= function(){
   return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username
    //     dailyGoal: this.dailyGoal,
    //    maxStreak:this.maxStreak,
    //    currStreak:this.currStreak
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
UserSchema.methods.generateRefreshToken= function(){
    return jwt.sign({
        _id: this._id,
      },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User= mongoose.model("User" , UserSchema)