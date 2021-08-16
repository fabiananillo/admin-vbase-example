export default async function updateConfiguration(
    _: any,
    { configuration }: { configuration: any },
    ctx: Context
) {

    console.log('configurationInput', configuration);

    //Updates configuration through id
    if (configuration.id) {
        let configurationMatcher = await <any>ctx.clients.vbase.getJSON<any>('vtexcol.myvtex', 'configurationMatcher', true);
        console.log('list', configurationMatcher)
        //Find index of specific object using findIndex method.    
        let objIndex = configurationMatcher.findIndex(((obj: any) => obj.id == configuration.id));
        configuration.id = parseInt(configuration.id);
        configuration.updated_at = Date.now();
        configurationMatcher[objIndex] = configuration;
        console.log('set update', configurationMatcher)
        const saveConfiguration = await <any>ctx.clients.vbase
            .saveJSON('vtexcol.myvtex', 'configurationMatcher', configurationMatcher);
        if (saveConfiguration) {
            console.log('updated')
            let configurationMatcher = await <any>ctx.clients.vbase.getJSON<any>('vtexcol.myvtex', 'configurationMatcher', true);
            return configurationMatcher;
        }
    }

    return [];
}
