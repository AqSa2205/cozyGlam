const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const homeSchema = new Schema({
        sec_1: ObjectId,
        sec_2: ObjectId,
        sec_3: ObjectId,
        sec_4: ObjectId,

        title_1: {
        type: String,
        required: true,
        },
        content_1: {
        type: String,
        required: true,
        },
        header_1: {
        type: String,
        required: true,
        },
        image_s1_1: {
        type: String,
        },
        image_s1_2: {
        type: String,
        },

        title_2: {
        type: String,
        required: true,
        },
        content_2: {
        type: String,
        required: true,
        },
        header_2: {
        type: String,
        required: true,
        },
        image_s2_1: {
        type: String,
        },

        title_3: {
        type: String,
        required: true,
        },
        content_3: {
        type: String,
        required: true,
        },
        header_3: {
        type: String,
        required: true,
        },
        image_s3_1: {
        type: String,
        },
        tech_sec3: [
        {
        type: String,
        },
        ],

        title_4: {
        type: String,
        required: true,
        },
        content_4: {
        type: String,
        required: true,
        },
        header_4: {
        type: String,
        required: true,
        },
        image_s4_1: {
        type: String,
        },

        created_at: {
        type: Date,
        default: Date.now,
        },
        updated_at: {
        type: Date,
        default: Date.now,
        },
});

const Home = mongoose.model("Home", homeSchema);

module.exports = Home;
