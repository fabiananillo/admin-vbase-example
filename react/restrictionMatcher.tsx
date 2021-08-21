import React, { FC, useState } from 'react'
import { useQuery } from 'react-apollo'
import {
  Layout,
  PageBlock,
  Tab,
  Tabs
} from 'vtex.styleguide'
import { GeneralRestriction } from './components/GeneralRestriction'
import globalCategoriesGQL from './graphql/globalCategories.gql'


const RestrictionMatcher: FC = () => {

  const [currentTab, setcurrentTab] = useState<any>(1)
  const [globalCategoriesList, setglobalCategoriesList] = useState({});

  useQuery(globalCategoriesGQL, {
    onCompleted: (({ globalCategories }: any) => {
      setglobalCategoriesList(globalCategories);
    })
  })

  
  return (
    <Layout>
      <PageBlock
        title="Restriction Matcher"
        subtitle="Configuración de parámetros"
        variation="full"
      >
        <div>
          <Tabs fullWidth>
            <Tab
              label="General"
              active={currentTab === 1}
              onClick={() => setcurrentTab(1)}>
              <GeneralRestriction
                globalCategoriesList={globalCategoriesList}
              />
            </Tab>
            <Tab
              label="Configuracion"
              active={currentTab === 2}
              onClick={() => setcurrentTab(2)}>
              <p>Content for the invoices.</p>
            </Tab>
          </Tabs>
        </div>

      </PageBlock>
    </Layout>
  )
}
export default RestrictionMatcher
