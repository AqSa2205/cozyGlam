const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
  headerLogo: { type: String },
  themeColor: { type: String },
  primaryColor: { type: String },
  secondaryColor: { type: String },
    fb_link: { type: String },
    twitter_link: { type: String },
    instagram_link: { type: String },
    snap_link: { type: String },
    tiktok_link: { type: String },
    YouTube_link: { type: String },
    LinkedIn_link: { type: String },
    whatsapp_link: { type: String },
    Telegram_link: { type: String },
    whatsapp: { type: String },
  
  footerLogo: { type: String },
  footerDescription: { type: String },

    phone: { type: String },
    phone1: { type: String },
    address: { type: String },
    address2: { type: String },
});

const Setting = mongoose.model('Setting', settingsSchema);

module.exports = Setting;
