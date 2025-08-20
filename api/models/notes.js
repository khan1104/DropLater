import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
    at: { type: Date, required: true },
    statusCode: Number,
    ok: Boolean,
    error: String,
});

const noteSchema= new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    releaseAt:{
        type: Date,
        required : true
    },
    webhookUrl:{
        type: String,
        required : true
    },
    status:{
        type : String,
        enum: ["pending", "delivered", "failed", "dead"],
        default: "pending"
    },
    attempts:[attemptSchema],
    deliveredAt:{
        type : Date,
        default: null
    }
});

noteSchema.index({ releaseAt: 1 });
noteSchema.index({ status: 1 });

export const Note = mongoose.model("Note", noteSchema);