export default [
  {
    method: 'GET',
    path: '/',
    // name of the controller file & the method.
    handler: 'customController.index',
    config: {
      policies: [],
    },
  },
];
