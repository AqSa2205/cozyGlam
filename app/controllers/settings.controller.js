const Setting = require("../models/settings");
const response = require("../utils/responseHelpers");

exports.updateSettings = async (req, res) => {
  try {
    const {
      headerLogo,
      themeColor,
      primaryColor,
      secondaryColor,
      fb_link,
      twitter_link,
      instagram_link,
      snap_link,
      tiktok_link,
      YouTube_link,
      LinkedIn_link,
      whatsapp_link,
      Telegram_link,
      footerLogo,
      footerDescription,
      phone,
      phone1,
      whatsapp,
      address,
      address2,
    } = req.body;

    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    if (headerLogo !== undefined) settings.headerLogo = headerLogo;
    if (themeColor !== undefined) settings.themeColor = themeColor;
    if (primaryColor !== undefined) settings.primaryColor = primaryColor;
    if (secondaryColor !== undefined) settings.secondaryColor = secondaryColor;

    if (fb_link !== undefined) settings.fb_link = fb_link;
    if (twitter_link !== undefined) settings.twitter_link = twitter_link;
    if (instagram_link !== undefined) settings.instagram_link = instagram_link;
    if (snap_link !== undefined) settings.snap_link = snap_link;
    if (tiktok_link !== undefined) settings.tiktok_link = tiktok_link;
    if (YouTube_link !== undefined) settings.YouTube_link = YouTube_link;
    if (LinkedIn_link !== undefined) settings.LinkedIn_link = LinkedIn_link;
    if (whatsapp_link !== undefined) settings.whatsapp_link = whatsapp_link;
    if (Telegram_link !== undefined) settings.Telegram_link = Telegram_link;

    if (footerLogo !== undefined) settings.footerLogo = footerLogo;
    if (footerDescription !== undefined) settings.footerDescription = footerDescription;

    if (phone !== undefined) settings.phone = phone;
    if (phone1 !== undefined) settings.phone1 = phone1;
    if (whatsapp !== undefined) settings.whatsapp = whatsapp;
    if (address !== undefined) settings.address = address;
    if (address2 !== undefined) settings.address2 = address2;

    await settings.save();

    return response.success(res, "Settings updated successfully", { settings });
  } catch (error) {
    return response.serverError(res, "Error updating settings", error);
  }
};


//get settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne();
    return response.success(res, "Settings fetched successfully", { settings });
  } catch (error) {
    return response.serverError(res, "An error occurred", error);
  }
};
