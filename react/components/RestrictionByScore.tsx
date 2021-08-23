import React, { useState } from 'react'
import { Layout, PageBlock, Table, Modal } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import configurationGQL from '../graphql/configuration.gql'
import { useDisclosure } from 'react-use-disclosure'
import RestrictionScoreDetails from './RestrictionScoreDetails'

const RestrictionByScore = ({ globalCategoriesList }: any) => {
    const [configuration, setConfiguration] = useState<any>({})
    const [initialConfigurationList, setInitialConfigurationList] = useState<any>(
        {}
    )
    const [configurationList, setConfigurationList] = useState<any>({})
    const [searchValue, setSearchValue] = useState<any>('')
    const {
        isOpen: isModalOpen,
        open: openModal,
        close: closeModal,
    } = useDisclosure()


    const defaultSchema = {
        properties: {
            name: {
                title: 'Nombre',
            },
        },
    }

    //get configuration list
    useQuery(configurationGQL, {
        onCompleted: ({ configuration }: any) => {
            //sort by last id
            configuration.sort((a: any, b: any) => (a.id < b.id && 1) || -1)
            setConfigurationList(configuration)
            setInitialConfigurationList(configuration)
        },
    })

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
                            <RestrictionScoreDetails
                                globalCategoriesList={globalCategoriesList}
                                configuration={configuration}
                                setConfigurationList={setConfigurationList}
                                setInitialConfigurationList={setInitialConfigurationList}
                            />
                        </div>
                    </Modal>
                </div>
            </PageBlock>
        </Layout>
    )
}

export default RestrictionByScore