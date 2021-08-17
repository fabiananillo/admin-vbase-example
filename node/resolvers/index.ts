import token from './token';
import saveToken from './saveToken';
import newConfiguration from './newConfiguration';
import updateConfiguration from './updateConfiguration';
import configuration from './configuration';
import configurationByCategory from './configurationByCategory';
import configurationByBrand from './configurationByBrand';
import configurationBySeller from './configurationBySeller';

export const mutations = {
  saveToken,
  newConfiguration,
  updateConfiguration
}

export const queries = {
  token,
  configuration,
  configurationByCategory,
  configurationByBrand,
  configurationBySeller
}
