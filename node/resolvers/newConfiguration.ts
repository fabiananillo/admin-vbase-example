export default async function newConfiguration(
  _: any,
  { configuration }: { configuration: any },
  ctx: Context
) {

  console.log('configuration is', configuration);

  let configurationMatcher = await <any>ctx.clients.vbase.getJSON<any>('vtexcol.myvtex', 'configurationMatcher', true);
  //console.log('currentConfigurationMatcher', configurationMatcher);

  configuration.restrictionStatus = false;
  configuration.restrictionList = [];
  configuration.created_at = Date.now();
  configuration.updated_at = Date.now();

  if (configurationMatcher) {
    configuration.id = configurationMatcher.length + 1;
    let configurationToSave = [...configurationMatcher, configuration];
    console.log('configurationToSave', configurationToSave)
    const saveConfiguration = await <any>ctx.clients.vbase
      .saveJSON('vtexcol.myvtex', 'configurationMatcher', configurationToSave);
    if (saveConfiguration) {
      console.log('saved new config')
      return [configuration];
    }
  } else {
    configuration.id = 1;
    const saveConfiguration = await <any>ctx.clients.vbase
      .saveJSON('vtexcol.myvtex', 'configurationMatcher', [configuration]);
    if (saveConfiguration) {
      console.log('saved new config')
      return [configuration];
    }
  }

  return [];


}
