"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        method: 'GET',
        path: '/iconlibrary/find',
        handler: 'iconLibraryController.find',
    },
    {
        method: 'POST',
        path: '/iconlibrary/post',
        handler: 'iconLibraryController.create',
    },
    {
        method: 'PUT',
        path: '/iconlibrary/update/:id',
        handler: 'iconLibraryController.update',
    },
    {
        method: 'DELETE',
        path: '/iconlibrary/delete/:id',
        handler: 'iconLibraryController.delete',
    },
];
