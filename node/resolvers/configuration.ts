export default async function configuration(_: any, __: any, ctx: Context) {

  // let deleteFile = await <any>ctx.clients.vbase.deleteFile('vtexcol.myvtex', 'configurationMatcher');
  // console.log('deleteFile', deleteFile);

  let configurationMatcher = await <any>ctx.clients.vbase.getJSON<any>('vtexcol.myvtex', 'configurationMatcher', true);

  return !configurationMatcher ? [] : configurationMatcher;
}