export default [
  {
    method: 'GET',
    path: '/iconlibrary/find',
    handler: 'iconLibraryController.find',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'POST',
    path: '/iconlibrary/post',
    handler: 'iconLibraryController.create',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'PUT',
    path: '/iconlibrary/update/:id',
    handler: 'iconLibraryController.update',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'DELETE',
    path: '/iconlibrary/delete/:id',
    handler: 'iconLibraryController.delete',
    config: {
      policies: [],
      auth: false
    },
  },
];
