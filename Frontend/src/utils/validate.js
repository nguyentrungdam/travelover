import { format } from "date-fns";
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
export const validateVietnameseName = (name) => {
  const regex = /^[a-zA-Z\sÀ-ỹ]+$/;
  return regex.test(name);
};
export const validateVietnamesePhoneNumber = (phoneNumber) => {
  const regex = /^\d{1,10}$/;
  return regex.test(phoneNumber);
};
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
export function formatDate(inputDate) {
  // Tạo đối tượng Date từ chuỗi ngày đầu vào
  const dateObject = new Date(inputDate);
  if (isNaN(dateObject.getTime())) {
    // Nếu không hợp lệ, trả về một giá trị mặc định hoặc thông báo lỗi
    return inputDate;
  }
  // Sử dụng hàm format từ thư viện date-fns để định dạng lại chuỗi ngày
  const formattedDate = format(dateObject, "dd-MM-yyyy");
  return formattedDate;
}
export function formatDateAndHour(inputDateTime) {
  const originalDate = new Date(inputDateTime);
  // Định dạng ngày tháng
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDateTime = new Intl.DateTimeFormat("en-US", options).format(
    originalDate
  );

  // Tạo định dạng cuối cùng
  const [datePart, timePart] = formattedDateTime.split(", ");
  const [month, day, year] = datePart.split("/");
  const formattedDateTimeFinal = `${day}-${month}-${year}, ${timePart}`;

  return formattedDateTimeFinal;
}

export function formatDateToVietnamese(dateString) {
  const daysOfWeek = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];

  const date = new Date(dateString);
  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${dayOfWeek}, ${day} tháng ${month}, ${year}`;
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
// Lưu giá trị vào localStorage
export const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Đọc giá trị từ localStorage
export const getFromLocalStorage = (key) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
};

// việt hóa tiến trình đặt tour
export const getVietNameseNameOfProcess = (value) => {
  if (value === "canceled") return "Đã hủy"; //đỏ
  else if (value === "pending") return "Đang xử lý"; //xanh biển
  else if (value === "confirmed") return "Đã xác nhận"; //xanh biển
  else if (value === "underway") return "Trong chuyến đi"; //xanh lá
  else return "Hoàn thành"; //mờ
};
