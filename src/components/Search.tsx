import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Book } from '../config/Book';
import '../styles/Search.css';

type SearchProps = {
    books: Book[];
    onSearch: (filteredBooks: Book[]) => void;
};

type SearchOption = {
    name: string;
};

const Search: React.FC<SearchProps> = ({ books, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedSearch, setSelectedSearch] = useState<string>("All");
    const keyword = searchTerm.toLowerCase();

    const searchMenu = [
        { name: 'All', code: 'All' },
        { name: 'ID', code: 'ID' },
        { name: 'Title', code: 'Title' },
        { name: 'Author', code: 'Author' },
        { name: 'Genre', code: 'Genre' },
        { name: 'Date', code: 'Date' },
        { name: 'ISBN', code: 'ISBN' },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format as yyyy-mm-dd
    };

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
            onSearch(filtered);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
    }

    return (
        <div className="search-bar">
            <div className="p-inputgroup flex-1 search-input-group">
                <Dropdown 
                    value={selectedSearch} 
                    onChange={(e) => setSelectedSearch(e.value)} 
                    options={searchMenu} 
                    optionLabel="name" 
                    placeholder="ALL"
                    className="tiny-dropdown" 
                />
                <InputText
                    placeholder="Enter search here"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button icon="pi pi-search" className="p-button-search" onClick={handleSearch} />
                <Button icon="pi pi-trash" className="p-button-cancel" onClick={clearSearch} />
            </div>
        </div>
    );
};

export default Search;