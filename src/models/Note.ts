import mongoose, {Schema, Document, Types, mongo} from "mongoose";

export type NoteType = Document & {
    content: string,
    createdBy: Types.ObjectId,
    task: Types.ObjectId
}

const NoteSchema : Schema = new Schema({
    content: {
        type: String,
        trim: true,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        requiered: true
    },
    task: {
        type: Types.ObjectId,
        ref: 'Task',
        requiered: true
    }
}, {timestamps: true});

const Note = mongoose.model<NoteType>('Note', NoteSchema);

export default Note;