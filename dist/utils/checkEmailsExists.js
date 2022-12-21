"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceljs_1 = __importDefault(require("exceljs"));
const updateExcelPosition = async (filePath, position) => {
    const workbook = new exceljs_1.default.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);
    // Search for the defined position in the worksheet
    const row = worksheet.getRow(position.row);
    const cell = row.getCell(position.col);
    // Update the cell value
    cell.value = position?.value;
    // Save the updated workbook
    await workbook.xlsx.writeFile(filePath);
};
// Example usage: update the cell at row 1, column 1 with the value "new value"
//# sourceMappingURL=checkEmailsExists.js.map