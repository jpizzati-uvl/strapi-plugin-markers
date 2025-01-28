import type { Core } from '@strapi/strapi';
declare const customController: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    index(ctx: any): void;
};
export default customController;
