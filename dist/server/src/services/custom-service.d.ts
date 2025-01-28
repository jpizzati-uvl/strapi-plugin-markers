import type { Core } from '@strapi/strapi';
declare const customService: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    getWelcomeMessage(): string;
};
export default customService;
