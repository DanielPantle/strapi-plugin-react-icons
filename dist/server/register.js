"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => {
    strapi.customFields.register({
        name: "icon",
        plugin: "react-icons",
        type: "string",
    });
};
