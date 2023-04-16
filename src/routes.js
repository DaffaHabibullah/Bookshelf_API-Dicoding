const { postBookHandler, getAllBooksHandler, getBookByIdHandler, putBookByIdHandler, deleteBookByIdHandler } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/books',
        handler: postBookHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookByIdHandler,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: putBookByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookByIdHandler,
    },
];



module.exports = routes;