const fs = require("fs");
const XLSX = require("xlsx");

// Зчитуємо JSON-файл
const rawData = fs.readFileSync("members-new.json", "utf-8");
const users = JSON.parse(rawData);

// Форматуємо для Excel
const dataForExcel = users.map((user) => ({
  ID: user.id,
  DisplayName: user.displayName,
  Username: user.username,
  JoinedAt: user.joinedAt,
  Roles: user.roles.join(", "), // об'єднуємо масив у рядок
  TimeoutUntil: user.timeoutUntil || "",
}));

// Створюємо Excel-таблицю
const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

// Зберігаємо у файл
XLSX.writeFile(workbook, "members.xlsx");

console.log('✅ Файл "members.xlsx" створено!');
