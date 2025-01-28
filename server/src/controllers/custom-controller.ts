import type { Core } from '@strapi/strapi';

const customController = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('markers')
      .service('customService')
      .getWelcomeMessage();
  },
});

export default customController;
