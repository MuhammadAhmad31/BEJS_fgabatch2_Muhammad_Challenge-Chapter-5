const validateData = (data, schema) => {
  for (let key in schema) {
    if (typeof schema[key] === "object") {
      if (!validateData(data[key], schema[key]).isValid) {
        return { isValid: false, message: `Invalid data type for ${key}` };
      }
    } else if (typeof data[key] !== schema[key]) {
      return { isValid: false, message: `Invalid data type for ${key}` };
    }
    
    if (key === "balance" && data[key] < 0) {
      return { isValid: false, message: "Balance must be 0 or greater" };
    }

  }
  return { isValid: true, message: "Valid data" };
};

module.exports = validateData;
