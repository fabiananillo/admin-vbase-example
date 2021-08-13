import React, { FC, useState } from 'react'
import { Layout, PageBlock, Table, Modal } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import { useDisclosure } from 'react-use-disclosure'
import { ConfigurationDetails } from './components/ConfigurationDetails'
import configurationGQL from './graphql/configuration.gql'
import categoriesQuery from './graphql/categories.gql'
import brandsQuery from './graphql/brands.gql'

const AdminOtherExample: FC = () => {
  const [configuration, setConfiguration] = useState<any>({})
  const [configurationList, setConfigurationList] = useState<any>({})
  const [initialConfigurationList, setInitialConfigurationList] = useState<any>(
    {}
  )
  const [categoryList, setCategoryList] = useState<any>({})
  const [brandList, setBrandList] = useState<any>({})
  const [searchValue, setSearchValue] = useState<any>('')
  const {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
  } = useDisclosure()

  //get configuration list
  useQuery(configurationGQL, {
    onCompleted: ({ configuration }: any) => {

      //sort by last id
      configuration.sort((a: any, b: any) => (a.id < b.id && 1) || -1)
      setConfigurationList(configuration)
      setInitialConfigurationList(configuration)
    },
  })

  //get category list
  useQuery(categoriesQuery, {
    onCompleted: ({ categories }: any) => {
      setCategoryList(categories.items)
    },
  })

  //get brand list
  useQuery(brandsQuery, {
    onCompleted: ({ brands }: any) => {
      setBrandList(brands.items)
    },
  })

  console.log('category list', categoryList)

  const defaultSchema = {
    properties: {
      name: {
        title: 'Nombre',
      },
      status: {
        title: 'Estado',
        cellRenderer: ({ rowData }: any) => {
          if (rowData.status) {
            return 'Activo'
          }
          return 'Inactivo'
        },
      },
      type: {
        title: 'Tipo',
      },
      value: {
        title: 'Valor',
        cellRenderer: ({ rowData }: any) => {
          if (rowData.type == 'categoria') {
            console.log('rowData', rowData)
            let value = categoryList.find(
              (cat: any) => cat.value === rowData.value
            )
            return value?.label
          }
          if (rowData.type == 'marca') {
            let value = brandList.find(
              (brand: any) => brand.value === rowData.value
            )
            return value?.label
          }
          if (rowData.type == 'seller') {
            let length = rowData.sellers.length
            if (length > 1) {
              return `${length} Sellers`
            }
            return rowData.sellers[0]
          }
        },
      },
      updated_at: {
        title: 'Actualizado',
        cellRenderer: ({ rowData }: any) => {
          let a = new Date(rowData.created_at * 1000)
          let months = [
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic',
          ]

          let month = months[a.getMonth()]
          let date = a.getDate()
          let hour = a.getHours()
          let min = a.getMinutes()
          let time = date + ' ' + month + ' ' + hour + ':' + min

          return time
        },
      },
    },
  }

  const lineActions = [
    {
      label: (_: any) => 'Ver Detalles',
      onClick: async ({ rowData }: any) => {
        let configuration = await configurationList.find(
          (conf: any) => conf.id === rowData.id
        )
        if (configuration) {
          setConfiguration(configuration)
          return openModal()
        }
      },
    },
    {
      label: (_: any) => 'Activar',
      onClick: ({ rowData }: any) => console.log('click', rowData),
    },
    {
      label: (_: any) => 'Desactivar',
      isDangerous: true,
      onClick: ({ rowData }: any) => console.log('click', rowData),
    },
  ]

  const handleInputSearchChange = async (e: any) => {

    let inputValue = e.target.value

    setConfigurationList(initialConfigurationList)
    setSearchValue(inputValue)

    let result: any[] = []
    initialConfigurationList.map((val: any) => {
      let findName = val.name.includes(inputValue)
      if (findName) {
        result = [...result, val]
      }
    })
    setConfigurationList(result)


  }

  return (
    <Layout>
      <PageBlock title="Listar Configuración" variation="full">
        <div className="mb9">
          <Table
            schema={defaultSchema}
            items={configurationList}
            lineActions={lineActions}
            toolbar={{
              inputSearch: {
                value: searchValue,
                placeholder: 'Buscar...',
                onChange: handleInputSearchChange,
                // onClear: this.handleInputSearchClear,
                // onSubmit: this.handleInputSearchSubmit,
              },
              newLine: {
                label: 'Nueva Configuración',
                handleCallback: () => console.log('handle new line callback'),
              },
            }}
          />
        </div>

        <div className="mb5">
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            aria-label="Detalles Configuración"
            aria-describedby="modal-description"
          >
            <div className="dark-gray" id="modal-description">
              <ConfigurationDetails configuration={configuration} />
            </div>
          </Modal>
        </div>
      </PageBlock>
    </Layout>
  )
}

export default AdminOtherExample
