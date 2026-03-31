export const formatContact = (contact: string): string => {
  // Remove spaces
  contact = contact.replace(/\s+/g, "");

  // Convert to international format
  if (contact.startsWith("0")) {
    contact = "+233" + contact.slice(1);
  } else if (contact.startsWith("233")) {
    contact = "+" + contact;
  } else if (contact.length === 9) {
    // e.g. 257266272 → assume Ghana number
    contact = "+233" + contact;
  }

  // Validate
  if (!contact.startsWith("+233") || contact.length !== 13) {
    return "Invalid phone number";
  }

  // Format
  return `+233 ${contact.slice(4, 6)} ${contact.slice(6, 9)} ${contact.slice(9)}`;
};