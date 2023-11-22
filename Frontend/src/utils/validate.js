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

export function validateOriginalDate(day) {
  const formattedDate = day
    ? new Date(day)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
        })
        .replace(/\//g, "-")
    : "";
  return formattedDate;
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
export function FormatLine({ text }) {
  // Tách chuỗi thành mảng các dòng
  const lines = text?.split("\n");
  // Render mỗi dòng trong mảng bằng thẻ <p>
  return lines?.map((line, index) => (
    <p className="mb-1" key={index}>
      {line}
    </p>
  ));
}
