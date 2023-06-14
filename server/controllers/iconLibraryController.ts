import { Strapi } from "@strapi/strapi";

const getService = (strapi) =>
	strapi.plugin("strapi-react-icons").service("iconLibraryService");

export default ({ strapi }: { strapi: Strapi }) => ({
	async find(ctx: any) {
		try {
			ctx.body = await getService(strapi).find(ctx.query);
		} catch (error) {
			ctx.throw(500, error);
		}
	},
	async create(ctx: any) {
		try {
			await getService(strapi).create(ctx.request.body);
			ctx.body = await getService(strapi).find();
		} catch (error) {
			ctx.throw(500, error);
		}
	},
	async update(ctx: any) {
		try {
			await getService(strapi).update(ctx.params.id, ctx.request.body);
			ctx.body = await getService(strapi).find();
		} catch (error) {
			ctx.throw(500, error);
		}
	},
	async delete(ctx: any) {
		try {
			ctx.body = await getService(strapi).delete(ctx.params.id);
		} catch (error) {
			ctx.throw(500, error);
		}
	},
});
