export default async function configurationByBrand(_: any, { id }: any, ctx: Context) {

    console.log('id', id)
    let configurationMatcher = await <any>ctx.clients.vbase.getJSON<any>('vtexcol.myvtex', 'configurationMatcher', true);
    console.log('configMatcherList', configurationMatcher)
    if (configurationMatcher) {
        let configuration = configurationMatcher.filter((obj: any) => (obj.type) == 'marca' && obj.value == id)
        console.log('configuration', configuration)
        return configuration;
    }

    return [];

}