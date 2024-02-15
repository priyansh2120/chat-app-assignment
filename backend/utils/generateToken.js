import jwt from "jsonwebtoken";

export const generateTokenandSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    httpOnly: true, //prevent cookie access from javascript which is known as XSS attack
    maxAge: 15 * 24 * 60 * 60 * 1000, //15 days
    semSite: "strict", //CRSF attacks cross site request forgery preventions by setting this
    secure: process.env.NODE_ENV === "production" ? true : false, //cookie will only be set in https in production
  });
}

export default generateTokenandSetCookie;