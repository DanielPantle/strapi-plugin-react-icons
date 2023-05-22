"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getService = (strapi) => strapi.plugin("react-icons").service("iconLibraryService");
exports.default = ({ strapi }) => ({
    async find(ctx) {
        try {
            ctx.body = await getService(strapi).find(ctx.query);
        }
        catch (error) {
            ctx.throw(500, error);
        }
    },
    async create(ctx) {
        try {
            await getService(strapi).create(ctx.request.body);
            ctx.body = await getService(strapi).find();
        }
        catch (error) {
            ctx.throw(500, error);
        }
    },
    async update(ctx) {
        try {
            await getService(strapi).update(ctx.params.id, ctx.request.body);
            ctx.body = await getService(strapi).find();
        }
        catch (error) {
            ctx.throw(500, error);
        }
    },
    async delete(ctx) {
        try {
            ctx.body = await getService(strapi).delete(ctx.params.id);
        }
        catch (error) {
            ctx.throw(500, error);
        }
    },
});
