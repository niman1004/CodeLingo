import mongoose, {Schema} from 'mongoose'
const DailyLogSchema= new Schema(
    {
        questionsSolved:[{
            type: Schema.Types.ObjectId, 
            ref:"Question"
        }]

    } , {timestamps:true})

export const DailyLog= mongoose.model("DailyLog" , DailyLogSchema)
