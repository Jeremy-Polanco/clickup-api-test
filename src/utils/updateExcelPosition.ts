import Excel from 'exceljs';

const updateExcelPosition = async (
  filePath: string,
  position: {
    row: number;
    col: number;
    value: string;
  }
) => {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(1);

  // Search for the defined position in the worksheet
  const row = worksheet.getRow(position.row);
  const cell = row.getCell(position.col);

  // Update the cell value
  cell.value = position.value;

  // Save the updated workbook
  await workbook.xlsx.writeFile(filePath);
};

export default updateExcelPosition;
