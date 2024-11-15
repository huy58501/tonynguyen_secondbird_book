import React from 'react';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Book } from '../config/Book';
import { saveAs } from 'file-saver';
import autoTable from 'jspdf-autotable';
import 'xlsx';  // Ensure the library is loaded
import jsPDF from "jspdf";
declare module "file-saver";

interface ExportProps {
    books: Book[];
}

const Export = ({ books }: ExportProps) => {
    // Define the columns for export
    const cols = [
        { field: 'EntryID', header: 'ID' },
        { field: 'Title', header: 'Title' },
        { field: 'Author', header: 'Author' },
        { field: 'Genre', header: 'Genre' },
        { field: 'PublicationDate', header: 'Publication Date' },
        { field: 'ISBN', header: 'ISBN' }
    ];

    // Function to format the date in 'yyyy-mm-dd' format
    const formatDate = (date: string | Date): string => {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return String(date); // Return original value if the date is invalid
        }
        return dateObj.toLocaleDateString('en-CA'); // Format as yyyy-mm-dd
    };

    // Function to export books as CSV
    const exportCSV = () => {
        const csvContent =
            "data:text/csv;charset=utf-8," +
            cols.map((col) => col.header).join(",") + "\n" +
            books
                .map((item) =>
                    cols
                        .map((col) => {
                            const value = item[col.field as keyof Book];
                            return value instanceof Date || typeof value === 'string' 
                                ? formatDate(value) 
                                : String(value); // Convert value to string if it's not a date or string
                        })
                        .join(",")
                )
                .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "books.csv");
        document.body.appendChild(link);
        link.click();
    };

    // Function to export books as PDF
    const exportPdf = () => {
        const doc = new jsPDF();
        const formattedBooks = books.map(book =>
            cols.map(col => {
                const value = book[col.field as keyof Book];
                return value instanceof Date || typeof value === 'string' 
                    ? formatDate(value) 
                    : String(value); // Convert value to string if it's not a date or string
            })
        );

        autoTable(doc, {
            head: [cols.map(col => col.header)], // Column headers
            body: formattedBooks, // Row data
        });

        doc.save("books.pdf");
    };

    // Function to export books as Excel
    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const formattedBooks = books.map(book => ({
                ...book,
                // Format PublicationDate as string
                PublicationDate: book.PublicationDate instanceof Date
                    ? formatDate(book.PublicationDate)
                    : typeof book.PublicationDate === 'string'
                    ? formatDate(book.PublicationDate)
                    : String(book.PublicationDate)
            }));

            const worksheet = xlsx.utils.json_to_sheet(formattedBooks);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });
            saveAsExcelFile(excelBuffer, 'books');
        });
    };

    // Helper function to save the Excel file
    const saveAsExcelFile = (buffer: ArrayBuffer, fileName: string): void => {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(data, `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`);
    };

    // Function to export books as JSON
    const exportJSON = () => {
        // Format PublicationDate for each book
        const formattedBooks = books.map(book => ({
            ...book,
            PublicationDate: book.PublicationDate instanceof Date
                ? formatDate(book.PublicationDate)
                : typeof book.PublicationDate === 'string'
                ? formatDate(book.PublicationDate)
                : book.PublicationDate
        }));
    
        const jsonContent = JSON.stringify(formattedBooks, null, 2); // Pretty-print JSON
    
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
        saveAs(blob, 'books.json');
    };

    return (
        <div className="export-buttons">
            <Tooltip target=".export-buttons>button" position="bottom" />
            <Button
                type="button"
                icon="pi pi-file"
                rounded
                onClick={exportCSV}
                data-pr-tooltip="CSV"
            />
            <Button
                type="button"
                icon="pi pi-file-excel"
                severity="success"
                rounded
                onClick={exportExcel}
                data-pr-tooltip="XLS"
            />
            <Button
                type="button"
                icon="pi pi-file-pdf"
                severity="warning"
                rounded
                onClick={exportPdf}
                data-pr-tooltip="PDF"
            />
            <Button
                type="button"
                icon="pi pi-file-export"
                severity="info"
                rounded
                onClick={exportJSON}
                data-pr-tooltip="JSON"
            />
        </div>
    );
};

export default Export;
