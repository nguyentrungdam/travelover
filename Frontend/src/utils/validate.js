import { REUNICODE } from "../utils/config";

export function validateEmail(email) {
  if (email === "") {
    return false;
  }
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/i;
  return passwordRegex.test(password);
}

export function validateName(name) {
  const nameRegex = REUNICODE;
  return nameRegex.test(name);
}

export function validatePasswordMatch(password, confirmPassword) {
  return password === confirmPassword;
}

export function formatCurrencyWithoutD(amount) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const formattedAmount = formatter.format(amount);

  // Bỏ chữ "đ" ở cuối
  return formattedAmount.replace(/\s?₫$/, "");
}
