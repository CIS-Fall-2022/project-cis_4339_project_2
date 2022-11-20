const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const organization = process.env.ORGANIZATION; //added constraint 

//collection for intakeData
let primaryDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    firstName: {
        type: String,
        require: true
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    organization: {
        type: Number,
        default: organization, //when the user adds client, it will automically have the org that the env file is using
        ref: 'orgData'
    },
    phoneNumbers: {
        type: Array,
        required: true,
        unique: true //makes every client distinct
    },
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
            required: true
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
    }
}, {
    collection: 'primaryData',
    timestamps: true
});

let orgDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 }, //created unique id
    orgID: { type: Number}, //id use in the env file
    organization: {
        type: String,
        require: true
    }
}, {
    collection: 'orgData',
    timestamps: true
});

//collection for eventData
let eventDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    eventName: {
        type: String,
        require: true
    },
    organization: {
        type: Number,
        default: organization, //when the user adds client, it will automically have the org that the env file is using
        ref: 'orgData'
    },
    services: {
        type: Array
    },
    date: {
        type: Date,
        required: true
    },
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
    description: {
        type: String,
    },
    attendees: [{
        type: String
    }]
}, {
    collection: 'eventData'
});

// create models from mongoose schemas
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const eventdata = mongoose.model('eventData', eventDataSchema);
const orgData = mongoose.model('orgData', orgDataSchema);
// package the models in an object to export 
module.exports = { primarydata, eventdata, orgData }
