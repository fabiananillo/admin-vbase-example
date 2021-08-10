export default async function configurationByCategory(_: any, { id }: any, ctx: Context) {

    console.log('id _ ', id);


    let listId = await <any>ctx.clients.vbase.getJSON<any>('vtexcol.myvtex', 'configurationId');

    console.log('listId', listId);
    // // let deleteFile = await <any>ctx.clients.vbase.deleteFile('vtexcol.myvtex', '4');
    // // console.log('deleteFile', deleteFile);


    let configurationList: any[] = [];
    for (let i = 1; i <= listId.generateId; i++) {

        let configuration = await <any>ctx.clients.vbase.getJSON<{ configuration: any }>('vtexcol.myvtex', `${i}`, true);

        if (configuration) {
            let configurationItem = configuration.configuration;
            configurationList.push(configurationItem);
        }

    }

    console.log('configurationList', configurationList);

    return configurationList;

}