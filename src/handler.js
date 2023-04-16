const { nanoid } = require('nanoid');
const books = require('./books');

// API dapat menyimpan buku
const postBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;


    // Client tidak melampirkan properti namepada request body.
    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount.
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    // Bila buku berhasil dimasukkan.
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };
    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    // Bila keseluruhan proses gagal.
    const response = h.response({
        status: 'error',
        message: 'Buku gagal untuk ditambahkan',
    });
    response.code(500);
    return response;
};



// API dapat menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if (name !== undefined) {
        const bookName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
        const dataBook = bookName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }));

        const response = h.response({
            status: 'success',
            data: {
                books: dataBook,
            },
        });
        response.code(200);
        return response;
    }

    if (reading !== undefined) {
        const bookReading = books.filter((book) => book.reading === (reading === '1'));
        const dataBook = bookReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }));

        const response = h.response({
            status: 'success',
            data: {
                books: dataBook,
            },
        });
        response.code(200);
        return response;
    }

    if (finished !== undefined) {
        const bookFinished = books.filter((book) => book.finished === (finished === '1'));
        const dataBook = bookFinished.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }));

        const response = h.response({
            status: 'success',
            data: {
                books: dataBook,
            },
        });
        response.code(200);
        return response;
    }

    const dataBook = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    const response = h.response({
        status: 'success',
        data: {
            books: dataBook,
        },
    });
    response.code(200);
    return response;
};



// API dapat menampilkan detail buku
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.find((b) => b.id === bookId);

    // ila buku dengan id yang dilampirkan ditemukan.
    if (book) {
        const response = h.response({
            status: 'success',
            data: {
                book: {
                    id: book.id,
                    name: book.name,
                    year: book.year,
                    author: book.author,
                    summary: book.summary,
                    publisher: book.publisher,
                    pageCount: book.pageCount,
                    readPage: book.readPage,
                    finished: book.finished,
                    reading: book.reading,
                    insertedAt: book.insertedAt,
                    updatedAt: book.updatedAt,
                },
            },
        });
        response.code(200);
        return response;
    }

    // Bila buku dengan id yang dilampirkan oleh client tidak ditemukan.
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};



// API dapat mengubah data buku
const putBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        // Client tidak melampirkan properti name pada request body.
        if (name === undefined) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        }

        // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount.
        if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }

        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        // Bila buku berhasil diperbarui.
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    // Id yang dilampirkan oleh client tidak ditemukkan oleh server.
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};



// API dapat menghapus buku
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    // Bila id dimiliki oleh salah satu buku.
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    // Bila id yang dilampirkan tidak dimiliki oleh buku manapun.
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};



module.exports = { postBookHandler, getAllBooksHandler, getBookByIdHandler, putBookByIdHandler, deleteBookByIdHandler };