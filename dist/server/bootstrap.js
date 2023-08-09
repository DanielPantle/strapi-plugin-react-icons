"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async ({ strapi }) => {
    var _a;
    const actions = [
        {
            section: 'plugins',
            displayName: 'Access react-icons menu',
            uid: 'read',
            pluginName: 'react-icons',
        }
    ];
    await ((_a = strapi.admin) === null || _a === void 0 ? void 0 : _a.services.permission.actionProvider.registerMany(actions));
};
