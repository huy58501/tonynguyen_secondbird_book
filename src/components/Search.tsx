import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Book } from '../config/Book';
import '../styles/Search.css';

// Define the types for the component props and search option

type SearchProps = {
    books: Book[]; // Array of books passed as a prop
    onSearch: (filteredBooks: Book[]) => void; // Callback function to return the filtered books
};

type SearchOption = {
    name: string;
};

const Search: React.FC<SearchProps> = ({ books, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState<string>(""); // State for the search input value
    const [selectedSearch, setSelectedSearch] = useState<string>("All"); // State for the selected filter option
    const keyword = searchTerm.toLowerCase(); // Convert search term to lowercase for case-insensitive search

    // Options for the dropdown menu
    const searchMenu = [
        { name: 'All', code: 'All' },
        { name: 'ID', code: 'ID' },
        { name: 'Title', code: 'Title' },
        { name: 'Author', code: 'Author' },
        { name: 'Genre', code: 'Genre' },
        { name: 'Date', code: 'Date' },
        { name: 'ISBN', code: 'ISBN' },
    ];

    // Function to format a date to yyyy-mm-dd
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    // Function to filter the books based on the selected criteria and search term
    const handleSearch = () => {
        const filtered = books.filter((book) => {
            return (
                String(book.EntryID).toLowerCase().includes(keyword) ||
                book.Title.toLowerCase().includes(keyword) ||
                book.Author.toLowerCase().includes(keyword) ||
                book.Genre.toLowerCase().includes(keyword) ||
                String(book.ISBN).toLowerCase().includes(keyword) ||
                formatDate(book.PublicationDate.toString()).includes(keyword)
            );
        });

        // Filter based on the selected search field
        const selectedSearchName = (selectedSearch as unknown as SearchOption).name;

        if (selectedSearchName === 'ID') {
            onSearch(filtered.filter((book) => String(book.EntryID).toLowerCase().includes(keyword)));
        } else if (selectedSearchName === 'Title') {
            onSearch(filtered.filter((book) => book.Title.toLowerCase().includes(keyword)));
        } else if (selectedSearchName === 'Author') {
            onSearch(filtered.filter((book) => book.Author.toLowerCase().includes(keyword)));
        } else if (selectedSearchName === 'Genre') {
            onSearch(filtered.filter((book) => book.Genre.toLowerCase().includes(keyword)));
        } else if (selectedSearchName === 'Date') {
            onSearch(
                filtered.filter((book) => formatDate(book.PublicationDate.toString()).includes(keyword))
            );
        } else if (selectedSearchName === 'ISBN') {
            onSearch(filtered.filter((book) => String(book.ISBN).toLowerCase().includes(keyword)));
        } else {
            onSearch(filtered); // If 'All' is selected, return all matching results
        }
    };

    // Function to clear the search input
    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div className="search-bar">
            <div className="p-inputgroup flex-1 search-input-group">
                {/* Dropdown for selecting the search field */}
                <Dropdown 
                    value={selectedSearch} 
                    onChange={(e) => setSelectedSearch(e.value)} 
                    options={searchMenu} 
                    optionLabel="name" 
                    placeholder="ALL"
                    className="tiny-dropdown" 
                />
                {/* Input for entering the search term */}
                <InputText
                    placeholder="Enter search here"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Search button */}
                <Button icon="pi pi-search" className="p-button-search" onClick={handleSearch} />
                {/* Clear button */}
                <Button icon="pi pi-trash" className="p-button-cancel" onClick={clearSearch} />
            </div>
        </div>
    );
};

export default Search;
