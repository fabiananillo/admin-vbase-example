import React, { FC, useState, useEffect, useRef } from 'react'
import { Layout, PageBlock, Button, Input, RadioGroup } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import './DottedBox.css';
import './node_modules/react-dual-listbox/lib/react-dual-listbox.css'
const CSS_HANDLES = ['exampleContainer', 'exampleText'];
const DualListBox = require('react-dual-listbox');

interface DisableTrack {
  ean: string
  productName: string
  skuName: string
  brand: string
  category: string
  skuRef: string
  productRef: string
}

type DisableTrackEnum = 'ean' | 'productName' | 'skuName' | 'brand' | 'category' | 'skuRef' | 'productRef';

interface DataInterface {
  target: {
    id: string
    value: string
  }
}


const TARGET_POINTS = 100;
const INITIAL_FORM_VALUES = {
  ean: "0",
  productName: "0",
  skuName: "0",
  brand: "0",
  category: "0",
  skuRef: "0",
  productRef: "0"
};



const AdminExample: FC = () => {
  const handles = useCssHandles(CSS_HANDLES);
  const initialState = {
    default: 'n/a',
    value: '',
    error: true,
    errorMessage: 'This field is mandatory',
    selected: ['one'],
  }
  const options = [
    { value: 'n/a', label: 'Ninguno' },
    { value: 'vtexlatam', label: 'Vtex Latam' },
    { value: '1', label: '1' }, ,
  ]

  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [disableTrack, setDisableTrack] = useState<any>({});
  const [enableButton, setEnableButton] = useState<boolean>(true);

  const clearDataEvent = () => {

    setFormValues(INITIAL_FORM_VALUES);

  }
/**
 * POWER BY CFICA
 */
  useEffect(() => {
    const totalPoints = calculateTotalPoints(formValues);
    console.log(totalPoints);
    if (totalPoints === TARGET_POINTS) {
      disableInputs(formValues);
      setEnableButton(false);
    } else {
      setDisableTrack({
        "ean": false,
        "productName": false,
        "skuName": false,
        "brand": false,
        "category": false,
        "skuRef": false,
        "productRef": false
      });
      setEnableButton(true);
      console.log(formValues);
    }
  }, [formValues]);

  const calculateTotalPoints = (formValues: DisableTrack) => {
    const values = Object?.values(formValues);
    const filteredValues = values?.filter((value) => typeof value === "number");
    const totalPoints = filteredValues?.reduce((a, b) => a + b, 0);
    return Number(totalPoints);
  };

  const disableInputs = (formValues: DisableTrack) => {
    let track = {}
    const keys: DisableTrackEnum[] = Object?.keys(formValues) as DisableTrackEnum[]
    keys.map((key: DisableTrackEnum) => {
      const value = formValues[key]
      track = { ...track, [key]: typeof value === 'string' }
    })

    setDisableTrack(track)
  }

  const handleInputValue = ({ target: { id, value } }: DataInterface) => {

    console.log('value', value);
    //console.log('totalpoints', totalPoints);
    setFormValues({
      ...formValues,
      [id]: Number(value)
    });

  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // if (totalPoints < 100) {
    //   //Mostrar alerta 

    // }

  }

  const eanRef = useRef(null);


  return (
    <Layout>
      <PageBlock
        title="Información Score"
        subtitle="Configuración de parámetros"
        variation="full"
      >
        <form onSubmit={handleSubmit}>
          <div >I can use the DOM with react ref</div>
          <div>
            <RadioGroup
              error={initialState.error}
              errorMessage={initialState.error && initialState.errorMessage}
              name="radioGroupExample4"
              options={[
                { value: 'value1', label: 'Seller' },
                { value: 'value2', label: 'Categoria' },
                { value: 'value3', label: 'Marca' },
              ]}
              value={initialState.value}
            //           onChange={({ target: { value } }) =>
            //   setState({ value, error: false, errorMessage: '' })
            // }
            />

            <div className={`${handles.exampleContainer}`}>
              <DualListBox
                options={options}
                selected={initialState.selected}
              //   onChange={(selected:any) => {
              //     this.setState({ selected });
              // }}
              />
            </div>


            <div className="mb5">
              <Input
                id="ean"
                maxLength="3"
                ref={eanRef}
                placeholder="Type ean value"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                label="EAN"
                onChange={handleInputValue}
                disabled={!!disableTrack["ean"]}
              />
            </div>

            <div className="mb5">
              <Input
                id="productName"
                maxLength="3"
                placeholder="Type product name value"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                label="Product Name"
                onChange={handleInputValue}
                disabled={!!disableTrack["productName"]}
              />
            </div>

            <div className="mb5">
              <Input
                id="skuName"
                maxLength="3"
                placeholder="Type sku name value"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                label="Sku Name"
                onChange={handleInputValue}
                disabled={!!disableTrack["skuName"]}
              />
            </div>

            <div className="mb5">
              <Input
                id="brand"
                maxLength="3"
                placeholder="Type brand value"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                label="Brand"
                onChange={handleInputValue}
                disabled={!!disableTrack["brand"]}
              />
            </div>

            <div className="mb5">
              <Input
                id="category"
                maxLength="3"
                placeholder="Type category value"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                label="Category"
                onChange={handleInputValue}
                disabled={!!disableTrack["category"]}
              />
            </div>

            <div className="mb5">
              <Input
                id="skuRef"
                maxLength="3"
                placeholder="Type sku ref value"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                label="Sku Ref"
                onChange={handleInputValue}
                disabled={!!disableTrack["skuRef"]}
              />
            </div>

            <div className="mb5">
              <Input
                id="productRef"
                maxLength="3"
                placeholder="Type product ref value"
                dataAttributes={{ 'hj-white-list': true, test: 'string' }}
                label="Product Ref"
                onChange={handleInputValue}
                disabled={!!disableTrack["productRef"]}
              />
            </div>

          </div>

          <div className="flex justify-center">
            <div className="flex flex-column items-center w-100">
              <span className="mb4">
                <Button type="submit" variation="primary" disabled={enableButton}>Guardar</Button>
              </span>
              <span className="mb4">
                <Button variation="secondary" onClick={clearDataEvent}>Limpiar</Button>
              </span>
            </div>
          </div>
        </form>
      </PageBlock>
    </Layout>
  )
}
export default AdminExample
