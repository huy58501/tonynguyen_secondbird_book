import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Book } from '../config/Book';
import '../styles/Add.css';

const Add: React.FC = () => {
    const [visible, setVisible] = useState<boolean>(false); // Dialog visibility state
    const [newBook, setNewBook] = useState<Book>({
        EntryID: 1, // Start with EntryID 1 initially
        Title: '',
        Author: '',
        Genre: '',
        PublicationDate: new Date(),
        ISBN: 0,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [books, setBooks] = useState<Book[]>([]);
    const highestEntryID = useRef<number>(0); // Store highest EntryID for new entries

    // Fetch books from the API
    const fetchBooks = async () => {
        try {
            const response = await axios.get("https://tonynguyensecondbirddb-enfxgca0dkhjagb4.canadaeast-01.azurewebsites.net/api/data");
            if (response.data) {
                setBooks(response.data);
            } else {
                console.error("No books found.");
            }
        } catch (err) {
            console.error("Error fetching books:", err);
        }
    };

    useEffect(() => {
        fetchBooks(); // Fetch books when the component mounts
    }, []); // Empty dependency ensures this runs once after mount

    // Update highest EntryID after fetching books
    useEffect(() => {
        if (books.length > 0) {
            highestEntryID.current = Math.max(...books.map((book) => book.EntryID)) + 1;
            setNewBook((prevBook) => ({
                ...prevBook,
                EntryID: highestEntryID.current,
            }));
        }
    }, [books]);

    // Handle input changes for book details
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewBook({ ...newBook, [name]: value });
    };

    // Handle publication date changes
    const handleDateChange = (value: Date | null) => {
        setNewBook({
            ...newBook,
            PublicationDate: value ?? new Date(),
        });
    };

    // Validate form fields before saving
    const validate = () => {
        let validationErrors: { [key: string]: string } = {};
        if (!newBook.EntryID) validationErrors.EntryID = 'Entry ID is required.';
        if (!newBook.Title.trim()) validationErrors.Title = 'Title is required.';
        if (!newBook.Author.trim()) validationErrors.Author = 'Author is required.';
        if (!newBook.Genre.trim()) validationErrors.Genre = 'Genre is required.';
        if (!newBook.PublicationDate) validationErrors.PublicationDate = 'Publication Date is required.';
        if (!newBook.ISBN || newBook.ISBN <= 0) validationErrors.ISBN = 'Valid ISBN is required.';

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    // Show dialog for adding a new book
    const handleAdd = () => {
        setVisible(true);
    };

    // Handle saving the new book
    const handleSave = async () => {
        if (validate()) {
            try {
                const response = await axios.post(
                    "https://tonynguyensecondbirddb-enfxgca0dkhjagb4.canadaeast-01.azurewebsites.net/api/add",
                    newBook
                );
                console.log('New book added:', response.data);

                // Re-fetch books after adding the new one
                await fetchBooks(); 

                // Reset form fields and errors
                setNewBook({
                    EntryID: highestEntryID.current,
                    Title: '',
                    Author: '',
                    Genre: '',
                    PublicationDate: new Date(),
                    ISBN: 0,
                });

                setErrors({}); // Clear errors
                setVisible(false); // Close the dialog
                window.location.reload(); // Reload page to show the updated list
            } catch (err) {
                console.error("Error adding book:", err);
            }
        }
    };

    return (
        <div className="add-book-container">
            <Button onClick={handleAdd} icon="pi pi-plus" label="ADD" className="p-button-success" />
            <Dialog header="Add a New Book" visible={visible} onHide={() => setVisible(false)}>
                <div className="add-book-form">
                    {/* Entry ID (disabled) */}
                    <div className="field">
                        <p><label htmlFor="EntryID">Entry ID</label></p>
                        <InputText id="EntryID" name="EntryID" value={newBook.EntryID.toString()} disabled />
                    </div>
                    
                    {/* Title input */}
                    <div className="field">
                        <p><label htmlFor="Title">Title</label></p>
                        <InputText id="Title" name="Title" value={newBook.Title} onChange={handleInputChange} />
                        {errors.Title && <small className="p-error">{errors.Title}</small>}
                    </div>
                    
                    {/* Author input */}
                    <div className="field">
                        <p><label htmlFor="Author">Author</label></p>
                        <InputText id="Author" name="Author" value={newBook.Author} onChange={handleInputChange} />
                        {errors.Author && <small className="p-error">{errors.Author}</small>}
                    </div>
                    
                    {/* Genre input */}
                    <div className="field">
                        <p><label htmlFor="Genre">Genre</label></p>
                        <InputText id="Genre" name="Genre" value={newBook.Genre} onChange={handleInputChange} />
                        {errors.Genre && <small className="p-error">{errors.Genre}</small>}
                    </div>
                    
                    {/* Publication Date input */}
                    <div className="field">
                        <p><label htmlFor="PublicationDate">Publication Date</label></p>
                        <Calendar
                            id="PublicationDate"
                            value={newBook.PublicationDate}
                            onChange={(e) => handleDateChange(e.value as Date | null)}
                            dateFormat="yy/mm/dd"
                            showIcon
                        />
                    </div>
                    
                    {/* ISBN input */}
                    <div className="field">
                        <p><label htmlFor="ISBN">ISBN</label></p>
                        <InputText id="ISBN" name="ISBN" type="number" value={newBook.ISBN.toString()} onChange={handleInputChange} />
                        {errors.ISBN && <small className="p-error">{errors.ISBN}</small>}
                    </div>
                </div>
                
                {/* Dialog footer with Save and Cancel buttons */}
                <div className="dialog-footer">
                    <Button label="Save" icon="pi pi-check" onClick={handleSave} className="p-button-success" />
                    <Button label="Cancel" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-secondary" />
                </div>
            </Dialog>
        </div>
    );
};

export default Add;
