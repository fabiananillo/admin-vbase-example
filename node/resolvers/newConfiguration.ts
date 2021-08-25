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

    let validateCategory: boolean = true;
    let validateBrand: boolean = true;
    let findSeller: any[] = []
    //validate brand or category combination 
    if (configuration.type === 'categoria' && configuration.sellers.length > 0) {
      let configSellers = configuration.sellers;
      console.log(' is categoria')

      //find category value array
      let findMatcherCategory = configurationMatcher.filter((value: any) => value.type == configuration.type && value.value == configuration.value)

      if (findMatcherCategory) {
        console.log('find matcher category', findMatcherCategory)
        configSellers.map((seller: string) => {
          console.log('seller', seller)
          findMatcherCategory.map((matcher: any) => {
            findSeller = matcher.sellers.filter((sellerKey: any) => sellerKey == seller);
            if (findSeller.length > 0) {
              validateCategory = false;
            }
          })
        })
      }
    }

    if (configuration.type === 'marca' && configuration.sellers.length > 0) {
      let configSellers = configuration.sellers;
      console.log(' is marca')

      //find brand value array
      let findMatcherBrand = configurationMatcher.filter((value: any) => value.type == configuration.type && value.value == configuration.value)

      if (findMatcherBrand) {
        console.log('find matcher brand', findMatcherBrand)
        configSellers.map((seller: string) => {
          console.log('seller', seller)
          findMatcherBrand.map((matcher: any) => {
            findSeller = matcher.sellers.filter((sellerKey: any) => sellerKey == seller);
            if (findSeller.length > 0) {
              validateBrand = false;
            }
          })
        })
      }
    }


    if (validateCategory && validateBrand) {
      console.log('config matcher', configurationMatcher)
      configuration.id = configurationMatcher.length + 1;
      let configurationToSave = [...configurationMatcher, configuration];
      console.log('configurationToSave', configurationToSave)
      const saveConfiguration = await <any>ctx.clients.vbase
        .saveJSON('vtexcol.myvtex', 'configurationMatcher', configurationToSave);
      if (saveConfiguration) {
        console.log('saved new config')
        return [configuration];
      }
    }

  }
  else {
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
