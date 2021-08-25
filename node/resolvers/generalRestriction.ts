export default async function generalRestriction(_: any, __: any, ctx: Context) {

    
    // let deleteFile = await <any>ctx.clients.vbase.deleteFile('vtexcol.myvtex', 'configurationMatcher');
    // console.log('deleteFile', deleteFile);

    let generalRestriction = await <any>ctx.clients.vbase.getJSON<any>('vtexcol.myvtex', 'generalRestriction', true);
    console.log(generalRestriction)
    return generalRestriction;
}