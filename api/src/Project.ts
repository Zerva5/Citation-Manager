//Project class, mongoose interface, and mongoose schema

import { ICitation } from "./citation";

export interface IProject {
    _id: number,
    name: string,
    description: string,
    citations: ICitation['_id'][],
}
