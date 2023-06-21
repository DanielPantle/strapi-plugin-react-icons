"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        return await strapi.entityService.findMany('plugin::react-icons.iconlibrary', query);
    },
    async create(data) {
        return await strapi.entityService.create('plugin::react-icons.iconlibrary', data);
    },
    async update(id, data) {
        return await strapi.entityService.update('plugin::react-icons.iconlibrary', id, data);
    },
    async delete(id) {
        return await strapi.entityService.delete('plugin::react-icons.iconlibrary', id);
    },
});
