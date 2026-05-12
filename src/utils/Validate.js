const Validate = (email, password, name) => {
  if (name !== null && !name.trim()) {
    return "Please enter your full name.";
  }

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isEmailValid) {
    return "Please enter a valid email address.";
  }

  if (!password || password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  return null;
};

export default Validate;
