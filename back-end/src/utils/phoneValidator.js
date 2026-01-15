import { parsePhoneNumberFromString } from "libphonenumber-js";

export const isValidPhoneNumber = (value) => {
  if (!value) return true; // optional field

  const phoneNumber = parsePhoneNumberFromString(value, "IN"); // default country (India)

  if (!phoneNumber || !phoneNumber.isValid()) {
    throw new Error("Invalid phone number");
  }

  return true;
};
