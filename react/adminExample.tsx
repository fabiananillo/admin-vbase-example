import React, { FC, useState, useEffect, useRef } from 'react'
import {
  Layout,
  PageBlock,
  Button,
  Input,
  RadioGroup,
  Alert,
} from 'vtex.styleguide'
import {
  MessageDescriptor,
  useIntl,
  defineMessages,
} from 'react-intl'
import { AddSeller } from './components/AddSeller'
import { AddCategory } from './components/AddCategory'
import { AddBrand } from './components/AddBrand'
import { useMutation, useQuery } from 'react-apollo'
import newConfigurationGQL from './graphql/newConfiguration.gql'
import sellersQuery from './graphql/sellers.gql'
import brandsQuery from './graphql/brands.gql'
import categoriesQuery from './graphql/categories.gql'

interface DisableTrack {
  ean: string
  productName: string
  skuName: string
  brand: string
  category: string
  skuRef: string
  productRef: string
}

type DisableTrackEnum =
  | 'ean'
  | 'productName'
  | 'skuName'
  | 'brand'
  | 'category'
  | 'skuRef'
  | 'productRef'

interface DataInterface {
  target: {
    id: string
    value: string
  }
}

const TARGET_POINTS = 100
const INITIAL_FORM_VALUES = {
  ean: '0',
  productName: '0',
  skuName: '0',
  brand: '0',
  category: '0',
  skuRef: '0',
  productRef: '0',
}

const AdminExample: FC = () => {
  const initialScoreOptions = {
    value: 'seller',
  }

  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES)
  const [scoreOptions, setScoreOptions] = useState<any>(initialScoreOptions)
  const [disableTrack, setDisableTrack] = useState<any>({})
  const [enableButton, setEnableButton] = useState<boolean>(true)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [alertType, setAlertType] = useState<string>('')
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [selectedSeller, setSelectedSeller] = useState<any>([])
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [nameConfig, setNameConfig] = useState<string>('')
  const [saveNewConfiguration] = useMutation(newConfigurationGQL)
  const eanRef = useRef<HTMLInputElement>()
  const nameRef = useRef<HTMLInputElement>()
  const [sellerList, setSellerList] = useState<any>([])
  const [brandList, setBrandList] = useState<any>([])
  const [categoryList, setCategoryList] = useState<any>([])

  const messages = defineMessages({
    newConfigurationTitle: { id: 'admin-example.score-matcher.newConfigurationTitle' },
    configurationSellerType: { id: 'admin-example.score-matcher.configurationSellerType' },
    configurationCategoryType: { id: 'admin-example.score-matcher.configurationCategoryType' },
    configurationBrandType: { id: 'admin-example.score-matcher.configurationBrandType' },
    saveBtn: { id: 'admin-example.score-matcher.saveBtn' },
    clearBtn: { id: 'admin-example.score-matcher.clearBtn' },
  })
  const intl = useIntl();
  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  let newConfigurationTitle = translateMessage(messages.newConfigurationTitle)
  let saveBtn = translateMessage(messages.saveBtn)
  let clearBtn = translateMessage(messages.clearBtn)
  //getSeller list
  useQuery(sellersQuery, {
    onCompleted: ({ sellers }: any) => {
      setSellerList(sellers.items)
    },
  })

  //console.log('sellerList', sellerList)

  //get brand list
  useQuery(brandsQuery, {
    onCompleted: ({ brands }: any) => {
      brands.items.sort(
        (a: any, b: any) => (a.label.toLowerCase() > b.label.toLowerCase() && 1) || -1
      )
      setBrandList(brands.items)
    },
  })
  //console.log('brands', brandList);

  //get category list
  useQuery(categoriesQuery, {
    variables: {
      pageSize: 0,
      page: 0
    },
    onCompleted: ({ categories }: any) => {
      categories.items.sort(
        (a: any, b: any) => (a.label.toLowerCase() > b.label.toLowerCase() && 1) || -1
      )
      setCategoryList(categories.items)
    },
  })
  //console.log('brands', brandList);

  const clearDataEvent = () => {
    setFormValues(INITIAL_FORM_VALUES)
    setNameConfig('')
    setSelectedSeller([])
  }

  useEffect(() => {
    const totalPoints = calculateTotalPoints(formValues)
    //console.log(totalPoints);
    if (totalPoints === TARGET_POINTS) {
      disableInputs(formValues)
      setEnableButton(false)
    } else {
      enableInputs()
      setEnableButton(true)
      //console.log(formValues);
    }

    if (totalPoints > TARGET_POINTS) {
      setAlertType('error')
      setAlertMessage('El valor total de puntos no puede ser mayor de 100')
      handleAlert(true)
      disableInputs(formValues)
    } else {
      handleAlert(false)
      enableInputs()
    }
  }, [formValues])

  const calculateTotalPoints = (formValues: DisableTrack) => {
    const values = Object?.values(formValues)
    const filteredValues = values?.filter((value) => typeof value === 'number')
    const totalPoints = filteredValues?.reduce((a, b) => a + b, 0)
    return Number(totalPoints)
  }

  const disableInputs = (formValues: DisableTrack) => {
    let track = {}
    const keys: DisableTrackEnum[] = Object?.keys(
      formValues
    ) as DisableTrackEnum[]
    keys.map((key: DisableTrackEnum) => {
      const value = formValues[key]
      track = { ...track, [key]: typeof value === 'string' }
    })

    setDisableTrack(track)
  }

  const enableInputs = () => {
    setDisableTrack({
      ean: false,
      productName: false,
      skuName: false,
      brand: false,
      category: false,
      skuRef: false,
      productRef: false,
    })
  }

  const handleInputValue = ({ target: { id, value } }: DataInterface) => {
    setFormValues({
      ...formValues,
      [id]: Number(value),
    })
  }

  const handleInputName = ({ target: { value } }: DataInterface) => {
    setNameConfig(value)
  }

  const handleAlert = (status: any) => {
    setShowAlert(status)
  }

  const handleOnlyNumbers = (event: any) => {
    const keyCode = event.keyCode || event.which
    const keyValue = String.fromCharCode(keyCode)
    console.log('keyValue', keyValue)
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault()
    }
  }

  const handleScoreOptions = (e: any) => {
    setFormValues(INITIAL_FORM_VALUES)
    setNameConfig('')
    setSelectedSeller([])
    setScoreOptions({ value: e.currentTarget.value })
  }

  const handleSubmit = async (e: any) => {
    setEnableButton(true)

    e.preventDefault()

    //console.log('e', e.target)

    let valueOption = 'N/A'
    if (scoreOptions.value == 'categoria') {
      valueOption = selectedCategory
    }
    if (scoreOptions.value == 'marca') {
      valueOption = selectedBrand
    }

    let configurationVariables: any = {
      name: nameConfig,
      status: true,
      type: scoreOptions.value,
      value: valueOption,
      sellers: selectedSeller,
      ean: parseInt(formValues['ean']),
      productRef: parseInt(formValues['productRef']),
      productName: parseInt(formValues['productName']),
      skuName: parseInt(formValues['skuName']),
      brand: parseInt(formValues['brand']),
      category: parseInt(formValues['category']),
      skuRef: parseInt(formValues['skuRef']),
    };

    saveNewConfiguration({
      variables: {
        configuration: configurationVariables,
      },
    })
      .then(({ data }: any) => {
        if (data.newConfiguration.length === 0) {
          setEnableButton(false)
          setAlertType('error')
          setAlertMessage('Ya existe un seller guardado con esta categoría o marca.')
          setShowAlert(true)
        } else {
          setFormValues(INITIAL_FORM_VALUES)
          setNameConfig('')
          setSelectedSeller([])
          console.log('se ha guardado', data)
          setAlertType('success')
          setAlertMessage('Se ha guardado la configuración con éxito.')
          setShowAlert(true)
        }

      })
      .catch((err: any) => {
        console.log('error', err)
        setAlertType('error')
        setAlertMessage('Ha ocurrido un error, intente nuevamente.')
        setShowAlert(true)
        setFormValues(INITIAL_FORM_VALUES)
        setNameConfig('')
        setSelectedSeller([])
      })
  }

  const handleRemove = (id: any) => {
    console.log('id to remove', id)
    console.log('the sellers list', selectedSeller)
    let newList = selectedSeller.filter((seller: any) => seller !== id)

    setSelectedSeller(newList)
    console.log('newList', newList)
    //setSeller(newList)
  }

  return (
    <Layout>
      <PageBlock
        title={newConfigurationTitle}
        variation="full"
      >
        <form onSubmit={handleSubmit}>
          <div>
            <div className="mb5">
              <RadioGroup
                name="scoreOptions"
                options={[
                  { value: 'seller', label: 'Seller' },
                  { value: 'categoria', label: 'Categoria' },
                  { value: 'marca', label: 'Marca' },
                ]}
                value={scoreOptions.value}
                onChange={handleScoreOptions}
              />
            </div>

            <div className="mb5">
              <AddSeller
                setSelectedSeller={setSelectedSeller}
                selectedSeller={selectedSeller}
                sellerList={sellerList}
              />

              <ol>
                {selectedSeller.map((seller: any) => {
                  let sellerName = sellerList.find(
                    (sellerFind: any) => sellerFind.value === seller
                  )
                  return (
                    <li
                      className="t-action--small pv4"
                      key={seller}
                    >
                      {' '}
                      {sellerName?.label}
                      {' '}
                      <Button
                        type="button"
                        variation="danger"
                        size="small"
                        onClick={() => handleRemove(seller)}
                      >
                        Quitar
                      </Button>
                    </li>
                  )
                })}
              </ol>
            </div>

            {scoreOptions.value == 'categoria' ? (
              <div className="mb5">
                <AddCategory
                  setSelectedCategory={setSelectedCategory}
                  selectedCategory={selectedCategory}
                  categoryList={categoryList}
                />
              </div>
            ) : null}

            {scoreOptions.value == 'marca' ? (
              <div className="mb5">
                <AddBrand
                  setSelectedBrand={setSelectedBrand}
                  selectedBrand={selectedBrand}
                  brandList={brandList}
                />
              </div>
            ) : null}

            <div className="mb5">
              <Input
                id="name"
                ref={nameRef}
                value={nameConfig}
                placeholder="Type name config"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                label="NAME"
                onChange={handleInputName}
              />
            </div>

            <div className="mb5">
              <Input
                id="ean"
                value={formValues['ean']}
                ref={eanRef}
                maxLength="3"
                pattern="^-?[0-9]\d*\.?\d*$"
                placeholder="Type ean value"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                label="EAN"
                onKeyPress={handleOnlyNumbers}
                onChange={handleInputValue}
                disabled={!!disableTrack['ean']}
              />
            </div>

            <div className="mb5">
              <Input
                id="productName"
                value={formValues['productName']}
                maxLength="3"
                placeholder="Type product name value"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                label="Product Name"
                onKeyPress={handleOnlyNumbers}
                onChange={handleInputValue}
                disabled={!!disableTrack['productName']}
              />
            </div>

            <div className="mb5">
              <Input
                id="skuName"
                value={formValues['skuName']}
                maxLength="3"
                placeholder="Type sku name value"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                label="Sku Name"
                onKeyPress={handleOnlyNumbers}
                onChange={handleInputValue}
                disabled={!!disableTrack['skuName']}
              />
            </div>

            <div className="mb5">
              <Input
                id="brand"
                value={formValues['brand']}
                maxLength="3"
                placeholder="Type brand value"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                label="Brand"
                onKeyPress={handleOnlyNumbers}
                onChange={handleInputValue}
                disabled={!!disableTrack['brand']}
              />
            </div>

            <div className="mb5">
              <Input
                id="category"
                value={formValues['category']}
                maxLength="3"
                placeholder="Type category value"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                label="Category"
                onKeyPress={handleOnlyNumbers}
                onChange={handleInputValue}
                disabled={!!disableTrack['category']}
              />
            </div>

            <div className="mb5">
              <Input
                id="skuRef"
                value={formValues['skuRef']}
                maxLength="3"
                placeholder="Type sku ref value"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                label="Sku Ref"
                onKeyPress={handleOnlyNumbers}
                onChange={handleInputValue}
                disabled={!!disableTrack['skuRef']}
              />
            </div>

            <div className="mb5">
              <Input
                id="productRef"
                value={formValues['productRef']}
                maxLength="3"
                placeholder="Type product ref value"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                label="Product Ref"
                onKeyPress={handleOnlyNumbers}
                onChange={handleInputValue}
                disabled={!!disableTrack['productRef']}
              />
            </div>

            <div className="mb5">
              {showAlert ? (
                <Alert type={`${alertType}`}>{alertMessage}</Alert>
              ) : null}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-column items-center w-100">
              <span className="mb4">
                <Button
                  type="submit"
                  variation="primary"
                  disabled={enableButton}
                >
                  {saveBtn}
                </Button>
              </span>
              <span className="mb4">
                <Button variation="secondary" onClick={clearDataEvent}>
                  {clearBtn}
                </Button>
              </span>
            </div>
          </div>
        </form>
      </PageBlock>
    </Layout>
  )
}
export default AdminExample
