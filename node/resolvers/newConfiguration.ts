
export default async function newConfiguration(
  _: any,
  { configuration }: { configuration: any },
  ctx: Context
) {

  console.log(configuration);

  //Saves new configuration with a new id
  console.log(ctx)
  let listId = await <any>ctx.clients.vbase.getJSON<any>('vtexcol.myvtex', 'configurationId', true);
  let generateId = 1;
  if (listId) {
    //generateId = listId.generateId + 1;
    generateId = 1;
  }

  console.log(listId);
  console.log(configuration);
  console.log('generateId', generateId)
  configuration.id = generateId;
  configuration.created_at = Date.now();
  configuration.updated_at = Date.now();
  const saveId = await ctx.clients.vbase.saveJSON('vtexcol.myvtex', 'configurationId', { generateId });
  console.log('save id', saveId);

  const saveConfiguration = await <any>ctx.clients.vbase
    .saveJSON('vtexcol.myvtex', `${generateId}`, { configuration });
  console.log('saveConfig', saveConfiguration);

  if (saveConfiguration) {
    const saved = await <any>ctx.clients.vbase.getJSON<{ configuration: any }>('vtexcol.myvtex', `${generateId}`, true);
    console.log('saved', saved.configuration);
    return saved.configuration;

  }

  return false;
}
