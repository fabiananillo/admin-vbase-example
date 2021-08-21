export default async function generalRestriction(_: any, __: any, ctx: Context) {


    let generalRestriction = await <any>ctx.clients.vbase.getJSON<any>('vtexcol.myvtex', 'generalRestriction', true);

    return generalRestriction;
}