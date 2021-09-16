import React, { FC, useState } from 'react'
import { Table, Modal } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import { useDisclosure } from 'react-use-disclosure'
import { ConfigurationDetails } from './components/ConfigurationDetails'
import { useMutation } from 'react-apollo'
import {
    MessageDescriptor,
    useIntl,
    defineMessages,
} from 'react-intl'
import updateConfigurationGQL from './graphql/updateConfiguration.gql'
import configurationGQL from './graphql/configuration.gql'
import categoriesQuery from './graphql/categories.gql'
import brandsQuery from './graphql/brands.gql'
import sellersQuery from './graphql/sellers.gql'
import AdminExample from './adminExample'

const ScoreProfiles: FC = () => {
    const [updateConfiguration] = useMutation(updateConfigurationGQL)
    const [configuration, setConfiguration] = useState<any>({})
    const [configurationList, setConfigurationList] = useState<any>({})
    const [initialConfigurationList, setInitialConfigurationList] = useState<any>(
        {}
    )
    const [categoryList, setCategoryList] = useState<any>([])
    const [brandList, setBrandList] = useState<any>([])
    const [sellerList, setSellerList] = useState<any>([])
    const [searchValue, setSearchValue] = useState<any>('')
    const messages = defineMessages({
        configurationTitle: { id: 'admin-example.score-matcher.configurationTitle' },
        configurationPlaceholder: { id: 'admin-example.score-matcher.configurationPlaceholder' },
        configurationAddNewBtn: { id: 'admin-example.score-matcher.configurationAddNewBtn' },
        configurationTableName: { id: 'admin-example.score-matcher.configurationTableName' },
        configurationTableStatus: { id: 'admin-example.score-matcher.configurationTableStatus' },
        configurationTableType: { id: 'admin-example.score-matcher.configurationTableType' },
        configurationTableValue: { id: 'admin-example.score-matcher.configurationTableValue' },
        configurationTableUpdateAt: { id: 'admin-example.score-matcher.configurationTableUpdateAt' },
        configurationTableDetails: { id: 'admin-example.score-matcher.configurationTableDetails' },
        configurationTableEnable: { id: 'admin-example.score-matcher.configurationTableEnable' },
        configurationTableDisable: { id: 'admin-example.score-matcher.configurationTableDisable' },
    })
    const intl = useIntl();
    const translateMessage = (message: MessageDescriptor) =>
        intl.formatMessage(message)

    let configurationTitle = translateMessage(messages.configurationTitle)
    let configurationPlaceholder = translateMessage(messages.configurationPlaceholder)
    let configurationAddNewBtn = translateMessage(messages.configurationAddNewBtn)
    let configurationTableName = translateMessage(messages.configurationTableName)
    let configurationTableStatus = translateMessage(messages.configurationTableStatus)
    let configurationTableType = translateMessage(messages.configurationTableType)
    let configurationTableValue = translateMessage(messages.configurationTableValue)
    let configurationTableUpdateAt = translateMessage(messages.configurationTableUpdateAt)
    let configurationTableDetails = translateMessage(messages.configurationTableDetails)
    let configurationTableEnable = translateMessage(messages.configurationTableEnable)
    let configurationTableDisable = translateMessage(messages.configurationTableDisable)
    const {
        isOpen: isModalOpen,
        open: openModal,
        close: closeModal,
    } = useDisclosure()

    const {
        isOpen: isModalOpenNewScore,
        open: openModalNewScore,
        close: closeModalNewScore,
    } = useDisclosure()

    //getSeller list
    useQuery(sellersQuery, {
        onCompleted: ({ sellers }: any) => {
            setSellerList(sellers.items)
        },
    })

    //console.log('seller List', sellerList)

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
        variables: {
            pageSize: 0,
            page: 0
        },
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

    //console.log('category list', categoryList)

    const defaultSchema = {
        properties: {
            name: {
                title: configurationTableName,
            },
            status: {
                title: configurationTableStatus,
                cellRenderer: ({ rowData }: any) => {
                    if (rowData.status) {
                        return 'Activo'
                    }
                    return 'Inactivo'
                },
            },
            type: {
                title: configurationTableType,
            },
            value: {
                title: configurationTableValue,
                cellRenderer: ({ rowData }: any) => {
                    if (rowData.type == 'categoria') {
                        //console.log('rowData', rowData)
                        let value = categoryList?.find(
                            (cat: any) => cat.value === rowData.value
                        )
                        return value?.label
                    }
                    if (rowData.type == 'marca') {
                        let value = brandList?.find(
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
                title: configurationTableUpdateAt,
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
            label: (_: any) => configurationTableDetails,
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
            label: (_: any) => configurationTableEnable,
            onClick: ({ rowData }: any) => {
                let configurationVariables: any = {
                    id: rowData.id,
                    name: rowData.name,
                    status: true,
                    type: rowData.type,
                    value: rowData.value,
                    sellers: rowData.sellers,
                    ean: rowData.ean,
                    productRef: rowData.productRef,
                    productName: rowData.productName,
                    skuName: rowData.skuName,
                    brand: rowData.brand,
                    category: rowData.category,
                    skuRef: rowData.skuRef,
                    created_at: rowData.created_at,
                    updated_at: rowData.updated_at,
                }

                //console.log('config var', configurationVariables)

                updateConfiguration({
                    variables: {
                        configuration: configurationVariables,
                    },
                })
                    .then(({ data }: any) => {
                        //getSeller list
                        let configurationList = data.updateConfiguration.sort((a: any, b: any) => (a.id < b.id && 1) || -1)

                        setConfigurationList(configurationList)
                        setInitialConfigurationList(configurationList)

                        //console.log('se ha guardado', configurationList)

                    })
                    .catch((err: any) => {
                        console.log('error', err)
                    })
                console.log('click', rowData)
            },
        },
        {
            label: (_: any) => configurationTableDisable,
            isDangerous: true,
            onClick: ({ rowData }: any) => {
                let configurationVariables: any = {
                    id: rowData.id,
                    name: rowData.name,
                    status: false,
                    type: rowData.type,
                    value: rowData.value,
                    sellers: rowData.sellers,
                    ean: rowData.ean,
                    productRef: rowData.productRef,
                    productName: rowData.productName,
                    skuName: rowData.skuName,
                    brand: rowData.brand,
                    category: rowData.category,
                    skuRef: rowData.skuRef,
                    created_at: rowData.created_at,
                    updated_at: rowData.updated_at,
                }


                updateConfiguration({
                    variables: {
                        configuration: configurationVariables,
                    },
                })
                    .then(({ data }: any) => {

                        let configurationList = data.updateConfiguration.sort((a: any, b: any) => (a.id < b.id && 1) || -1)

                        setConfigurationList(configurationList)
                        setInitialConfigurationList(configurationList)

                        //console.log('se ha guardado', configurationList)

                    })
                    .catch((err: any) => {
                        console.log('error', err)
                    })
                console.log('click', rowData)
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

        <div className="row">
            <h1>{configurationTitle}</h1>
            <Table
                schema={defaultSchema}
                items={configurationList}
                lineActions={lineActions}
                toolbar={{
                    inputSearch: {
                        value: searchValue,
                        placeholder: configurationPlaceholder,
                        onChange: handleInputSearchChange,
                        // onClear: this.handleInputSearchClear,
                        // onSubmit: this.handleInputSearchSubmit,
                    },
                    newLine: {
                        label: configurationAddNewBtn,
                        handleCallback: () => openModalNewScore(),
                    },
                }}
            />

            <div className="mb5">
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    aria-label="Configuration Details"
                    aria-describedby="modal-description"
                >
                    <div className="dark-gray" id="modal-description">
                        <ConfigurationDetails
                            configuration={configuration}
                            brandList={brandList}
                            categoryList={categoryList}
                            sellerList={sellerList}
                            setConfigurationList={setConfigurationList}
                            setInitialConfigurationList={setInitialConfigurationList}
                        />
                    </div>
                </Modal>
            </div>
            <div className="mb7">
                <Modal
                    isOpen={isModalOpenNewScore}
                    onClose={closeModalNewScore}
                    aria-label="New"
                    aria-describedby="modal-description"
                >
                    <div className="dark-gray" id="modal-description">
                        <AdminExample />
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default ScoreProfiles
