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

            let listId = await <any>ctx.clients.vbase.getJSON<any>('vtexcol.myvtex', 'configurationId');
            console.log('listId', listId);
            // let deleteFile = await <any>ctx.clients.vbase.deleteFile('vtexcol.myvtex', '4');
            // console.log('deleteFile', deleteFile);

            let configurationList: any[] = [];
            for (let i = 1; i <= listId.generateId; i++) {

                let configuration = await <any>ctx.clients.vbase.getJSON<{ configuration: any }>('vtexcol.myvtex', `${i}`, true);

                if (configuration) {
                    let configurationItem = configuration.configuration;
                    configurationList.push(configurationItem);
                }

            }

            console.log('configurationList asdasd', configurationList);

            return configurationList;

        }
    }

    return false;
}
