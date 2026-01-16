import { parsePhoneNumberFromString } from "libphonenumber-js";

export const isValidPhoneNumber = (value) => {
  // Handle optional field - empty, null, undefined are all valid
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return true;
  }

  try {
    const phoneNumber = parsePhoneNumberFromString(String(value), "IN"); // default country (India)

    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new Error("Invalid phone number format. Please enter a valid phone number.");
    }

    return true;
  } catch (error) {
    // If parsing fails, throw a user-friendly error
    throw new Error("Invalid phone number format. Please enter a valid phone number.");
  }
};
