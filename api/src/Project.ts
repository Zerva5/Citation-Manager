//Project class, mongoose interface, and mongoose schema

import mongoose, { ObjectId, Schema } from "mongoose";
import { CitationType, ICitation } from "./citation";

export interface IProject {
    _id: ObjectId,
    name: string,
    description: string,
    citations: ICitation['_id'][],
}

const ProjectSchema = new Schema<IProject>({
    name: {type: String, required: true},
    description: {type: String, required: false},
});
