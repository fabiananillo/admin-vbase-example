export default async function configurationByCategory(_: any, { id }: any, ctx: Context) {

    console.log(id)
    let configurationMatcher = await <any>ctx.clients.vbase.getJSON<any>('vtexcol.myvtex', 'configurationMatcher', true);

    return !configurationMatcher ? [] : configurationMatcher;

}