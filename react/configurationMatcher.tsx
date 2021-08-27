import React, { FC, useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import {
  Layout,
  PageBlock,
  Tab,
  Tabs
} from 'vtex.styleguide'
import { GeneralRestriction } from './components/GeneralRestriction'
import categoriesGQL from './graphql/categories.gql'
import ScoreProfiles from './scoreProfiles'


const ConfigurationMatcher: FC = () => {

  const [currentTab, setcurrentTab] = useState<any>(1)
  const [globalCategoriesList, setglobalCategoriesList] = useState<any>([]);
  const { fetchMore } = useQuery(categoriesGQL, {
    variables: {
      pageSize: 100,
      page: 0
    },
    notifyOnNetworkStatusChange: true,
    // onCompleted: (({ categories }: any) => {
    //   //console.log('categoriesFound', categories)
    //   let departmentList = categories.items.filter((category: any) => category.fatherCategoryId === "");
    //   setglobalCategoriesList(departmentList);
    // })
  })

  // console.log(fetchMore);

  const fetchRest = async () => {
    let isEmpty = false
    let page = 1;
    let foundDepartments: any[] = []
    while (!isEmpty) {
      const { data } = await fetchMore({
        variables: {
          pageSize: 100,
          page: page
        },
        updateQuery: (() => { })
      })
      page = page + 1;
      if (data.categories.items.length == 0) {
        isEmpty = true
      } else {
        let departmentList = await data.categories.items.filter((category: any) => category.fatherCategoryId === "");
        if (departmentList.length > 0) {
          departmentList.map((department: any) => {
            //console.log('foundDeparments', department)
            foundDepartments = [...foundDepartments, department]
          })
        }

      }
    }
    return foundDepartments;
  }

  useEffect(() => {
    fetchRest().then((departmentList: any) => {
      setglobalCategoriesList(departmentList);
      //console.log('fetchRest', departmentList)
    });
  }, [])


  return (
    <Layout fullWidth="true">
      <PageBlock
        title="Matcher Configuration"
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
              label="Perfiles Configuración"
              active={currentTab === 2}
              onClick={() => setcurrentTab(2)}>
              <ScoreProfiles />
            </Tab>
          </Tabs>
        </div>
      </PageBlock>
    </Layout>
  )
}
export default ConfigurationMatcher
