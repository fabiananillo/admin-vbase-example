import React, { FC, useState } from 'react'
import { useQuery } from 'react-apollo'
import {
  Layout,
  PageBlock,
  Tab,
  Tabs
} from 'vtex.styleguide'
import { GeneralRestriction } from './components/GeneralRestriction'
import RestrictionByScore from './components/RestrictionByScore'
import categoriesGQL from './graphql/categories.gql'


const RestrictionMatcher: FC = () => {

  const [currentTab, setcurrentTab] = useState<any>(1)
  const [globalCategoriesList, setglobalCategoriesList] = useState({});

  useQuery(categoriesGQL, {
    onCompleted: (({ categories }: any) => {
      let departmentList = categories.items.filter((category: any) => category.fatherCategoryId === "");
      setglobalCategoriesList(departmentList);
    })
  })


  return (
    <Layout>
      <PageBlock
        title="Restriction Matcher"
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
              label="Configuración"
              active={currentTab === 2}
              onClick={() => setcurrentTab(2)}>
              <RestrictionByScore
                globalCategoriesList={globalCategoriesList}
              />
            </Tab>
          </Tabs>
        </div>

      </PageBlock>
    </Layout>
  )
}
export default RestrictionMatcher
