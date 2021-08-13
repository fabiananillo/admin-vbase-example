import React, { useState, useEffect, useRef } from 'react'
import {
  Layout,
  PageBlock,
  Button,
  Input,
  RadioGroup,
  Alert,
} from 'vtex.styleguide'
import { AddSeller } from './AddSeller'
import { AddCategory } from './AddCategory'
import { AddBrand } from './AddBrand'
import { useQuery, useMutation } from 'react-apollo'
import updateConfigurationGQL from '../graphql/updateConfiguration.gql'
import sellersQuery from '../graphql/sellers.gql'

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

export const ConfigurationDetails = (
  {
    configuration,
    brandList,
    categoryList
  }: any) => {
  //console.log('configuration is: ', configuration)
  const TARGET_POINTS = 100
  const INITIAL_FORM_VALUES = {
    ean: configuration.ean,
    productName: configuration.productName,
    skuName: configuration.skuName,
    brand: configuration.brand,
    category: configuration.category,
    skuRef: configuration.skuRef,
    productRef: configuration.productRef,
  }

  const initialScoreOptions = {
    value: configuration.type,
  }

  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES)
  const [scoreOptions, setScoreOptions] = useState<any>(initialScoreOptions)
  const [disableTrack, setDisableTrack] = useState<any>({})
  const [enableButton, setEnableButton] = useState<boolean>(true)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [alertType, setAlertType] = useState<string>('')
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [sellers, setSeller] = useState<any>([])
  const [nameConfig, setNameConfig] = useState<string>(configuration.name)
  const [saveNewConfiguration] = useMutation(updateConfigurationGQL)
  const nameRef = useRef<HTMLInputElement>()
  const [selectedCategory, setSelectedCategory] = useState<any>(configuration.type === 'categoria' ? configuration.value : null)
  const [selectedBrand, setSelectedBrand] = useState<any>(configuration.type === 'marca' ? configuration.value : null)
  const [sellerList, setSellerList] = useState<any>([])

  //console.log('initialFormValuas', formValues)

  //getSeller list
  useQuery(sellersQuery, {
    onCompleted: ({ sellers }: any) => {
      setSellerList(sellers.items)
    },
  })


  // if (configuration.type === 'categoria') {
  //   setSelectedCategory(configuration.value)
  // }
  // if (configuration.type === 'marca') {
  //   setSelectedBrand(configuration.value)
  // }

  const clearDataEvent = () => {
    setFormValues(INITIAL_FORM_VALUES)
    setNameConfig(configuration.name)
    setSeller([])
  }

  useEffect(() => {
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

  const totalPoints = calculateTotalPoints(formValues)
  //console.log('totalPoints', totalPoints)
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
    //const keyCode = event.keyCode || event.which
    //const keyValue = String.fromCharCode(keyCode)
    //console.log('keyValue', keyValue)
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault()
    }
  }

  const handleScoreOptions = (e: any) => {
    setFormValues(INITIAL_FORM_VALUES)
    setNameConfig('')
    setSeller([])
    setScoreOptions({ value: e.currentTarget.value })
  }

  const handleSubmit = async (e: any) => {
    // setEnableButton(true);

    e.preventDefault()

    // let name = nameRef.current as any;
    // console.log('name Ref', name.value);

    let valueOption = 'N/A'
    if (scoreOptions.value == 'categoria' || scoreOptions.value == 'marca') {
      valueOption = e.target[6].value
    }

    let configurationVariables: any = {
      id: configuration.id,
      name: nameConfig,
      status: true,
      type: scoreOptions.value,
      value: valueOption,
      sellers: sellers,
      ean: parseInt(formValues['ean']),
      productRef: parseInt(formValues['productRef']),
      productName: parseInt(formValues['productName']),
      skuName: parseInt(formValues['skuName']),
      brand: parseInt(formValues['brand']),
      category: parseInt(formValues['category']),
      skuRef: parseInt(formValues['skuRef']),
      created_at: configuration.created_at,
      updated_at: configuration.updated_at,
    }

    saveNewConfiguration({
      variables: {
        configuration: configurationVariables,
      },
    })
      .then((resp: any) => {
        // setFormValues(INITIAL_FORM_VALUES)
        // setNameConfig('')
        // setSeller([])
        console.log('se ha guardado', resp)
        setAlertType('success')
        setAlertMessage('Se ha guardado la configuración con éxito.')
        setShowAlert(true)
      })
      .catch((err: any) => {
        console.log('error', err)
        setAlertType('error')
        setAlertMessage('Ha ocurrido un error, intente nuevamente.')
        setShowAlert(true)
        setFormValues(INITIAL_FORM_VALUES)
        setNameConfig('')
        setSeller([])
      })
  }

  const handleRemove = (id: any) => {
    console.log('id to remove', id)
    console.log('the sellers list', sellers)
    let newList = sellers.filter((seller: any) => seller !== id)

    //setSeller(newList)
    console.log('newList es', newList)
    //setSeller(newList)
  }

  return (
    <Layout>
      <PageBlock
        title="Información Score"
        subtitle="Configuración de parámetros"
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
              <AddSeller setSeller={setSeller} sellers={sellers} />

              <ol>
                {sellers.map((seller: any) => {
                  let sellerName = sellerList.find(
                    (sellerFind: any) => sellerFind.id === seller
                  )
                  return (
                    <li key={seller}>
                      {' '}
                      {sellerName.name}{' '}
                      <button
                        type="button"
                        onClick={() => handleRemove(seller)}
                      >
                        Remover
                      </button>
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
                  Modificar
                </Button>
              </span>
              <span className="mb4">
                <Button variation="secondary" onClick={clearDataEvent}>
                  Deshacer Cambios{' '}
                </Button>
              </span>
            </div>
          </div>
        </form>
      </PageBlock>
    </Layout>
  )
}
