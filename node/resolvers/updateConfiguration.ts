export default async function updateConfiguration(
    _: any,
    { configuration }: { configuration: any },
    ctx: Context
) {

    console.log(configuration);

    //Updates configuration through id
    if (configuration.id) {
        let configurationId = configuration.id;
        configuration.updated_at = Date.now();
        const saveConfiguration = await <any>ctx.clients.vbase
            .saveJSON('vtexcol.myvtex', `${configurationId}`, { configuration });
        console.log('saveConfig', saveConfiguration);
        if (saveConfiguration) {
            const saved = await <any>ctx.clients.vbase.getJSON<{ configuration: any }>('vtexcol.myvtex', `${configurationId}`, true);
            console.log('saved', saved.configuration);
            return saved.configuration;
        }
    }

    return false;
}
