import { Document, Schema } from "mongoose";

// type enum
export enum CitationType {
    Website,
    Article
}

// Base citation class
export class Citation {
    private _id: number;
    private cit_type: CitationType;
    private _title: string;
    private _authors?: string[];
    private _year?: number;

    constructor(id: number, cit_type: CitationType, title: string, authors?: string[], year?: number) {
        this._id = id;
        this.cit_type= cit_type;
        this._title = title;
        this._authors = authors;
        this._year = year;
    }
}

// Website citation class
export class WebsiteCitation extends Citation {
    private link: string;
    private date_accessed?: Date;

    constructor(id: number, title: string, link: string, authors?: string[], year?: number, date_accessed?: Date) {
        super(id, CitationType.Website, title, authors, year);
        this.link = link;
        this.date_accessed = date_accessed;
    }
}       

// Article citation class
export class ArticleCitation extends Citation {
    private doi?: string;
    private publisher?: string;
    private journal?: string;
    private volume?: number;
    private page_start?: number;
    private page_end?: number;


    constructor(id: number, title: string, authors?: string[], year?: number, doi?: string, publisher?: string, journal?: string, volume?: number, page_start?: number, page_end?: number) {
        super(id, CitationType.Article, title, authors, year);
        this.doi = doi;
        this.publisher = publisher;
        this.journal = journal;
        this.volume = volume;
        this.page_start = page_start;
        this.page_end = page_end;
    }

}




// Mongoose citation interface, all fields from Website or Article are optional
export interface ICitation extends Document{
    _id: number;

    cit_type: CitationType;
    title: string;
    authors?: string[];
    year?: number;

    // Article fields
    doi?: string;
    publisher?: string;
    journal?: string;
    volume?: number;
    page_start?: number;
    page_end?: number;

    // Website fields
    link?: string;
    date_accessed?: Date;
}


// Mongoose citation schema
export const CitationSchema = new Schema<ICitation>({
    _id: { type: Number, required: true },

    // cit_type: { type: CitationType, required: true },
    cit_type: { type: Number, required: true },
    title: { type: String, required: true },
    authors: { type: [String], required: false },
    year: { type: Number, required: false },

    // Article fields
    doi: { type: String, required: false },
    publisher: { type: String, required: false },
    journal: { type: String, required: false },
    volume: { type: Number, required: false },
    page_start: { type: Number, required: false },
    page_end: { type: Number, required: false },

    // Website fields
    link: { type: String, required: false },
    date_accessed: { type: Date, required: false }
});


