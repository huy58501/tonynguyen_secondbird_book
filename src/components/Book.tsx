import React, { useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Book } from "../config/Book";
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from "axios";
import Navbar from "./Navbar";
import Add from "./Add";
import Search from "./Search";
import Export from "./Export";
import '../styles/Book.css';

const Books: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch books data on component mount
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get("https://tonynguyensecondbirddb-enfxgca0dkhjagb4.canadaeast-01.azurewebsites.net/api/data");
                setBooks(response.data);
                setFilteredBooks(response.data);
            } catch (err) {
                setError("Error fetching Books because the server is not running yet ... please reload a few times until the server is up");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Loading state while fetching data
    if (loading) {
        return (
            <div className="card" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
            </div>
        );
    }

    // Error state if fetching fails
    if (error) {
        return (
            <div className="card" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                {error}
            </div>
        );
    }

    // Format date in 'yyyy-mm-dd' format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // Format as yyyy-mm-dd
    };

    return (
        <div className="book-container">
            <Navbar />
            <div className="header-bar">
                <div className="add-export-button">
                    <Add />
                    <Export books={books} />
                </div>
                <Search books={books} onSearch={setFilteredBooks} />
            </div>
            <div className="book-grid">
                <DataTable value={filteredBooks} stripedRows tableStyle={{ minWidth: '50rem' }}>
                    {/* Table columns definition */}
                    <Column field="EntryID" header="ID" sortable style={{ width: 'auto' }}></Column>
                    <Column field="Title" header="Title" sortable style={{ width: 'auto' }}></Column>
                    <Column field="Author" header="Author" sortable style={{ width: 'auto' }}></Column>
                    <Column field="Genre" header="Genre" sortable style={{ width: 'auto' }}></Column>
                    <Column field="PublicationDate" header="Date" sortable style={{ width: 'auto' }} body={(rowData) => formatDate(rowData.PublicationDate)}></Column>
                    <Column field="ISBN" header="ISBN" sortable style={{ width: 'auto' }}></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Books;
