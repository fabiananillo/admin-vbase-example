export default async function newGeneralRestriction(
    _: any,
    { generalRestriction }: { generalRestriction: any },
    ctx: Context
) {

    console.log('geeneralRestriction', generalRestriction)

    const saveRestriction = await <any>ctx.clients.vbase
        .saveJSON('vtexcol.myvtex', 'generalRestriction', generalRestriction);
    if (saveRestriction) {
        console.log('saved general restriction matcher');
    }

    return generalRestriction;

}
