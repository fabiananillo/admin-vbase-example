import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import updateConfigurationGQL from '../graphql/updateConfiguration.gql'
import {
    Checkbox, AutocompleteInput, Button, Alert
} from 'vtex.styleguide'


export const RestrictionScoreDetails = ({
    globalCategoriesList,
    configuration,
    setConfigurationList,
    setInitialConfigurationList
}: any) => {

    const [inputValue, setInputValue] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [term, setTerm] = useState<string>('')
    const [checkGeneralRestriction, setcheckGeneralRestriction] = useState<boolean>(configuration.restrictionStatus)
    const [updateConfiguration] = useMutation(updateConfigurationGQL)
    const [selectedDepartment, setSelectedDepartment] = useState<any>(!configuration.restrictionList ? [] : configuration.restrictionList)
    const [alertType, setAlertType] = useState<string>('')
    const [alertMessage, setAlertMessage] = useState<string>('')
    const [showAlert, setShowAlert] = useState<boolean>(false)


    const handleCheckGeneralRestriction = () => {
        if (checkGeneralRestriction) {
            setcheckGeneralRestriction(false)
        } else {
            setcheckGeneralRestriction(true)
        }
    }


    const handleInputChange = (e: any) => {

        setInputValue(e.target.value)
    }

    const handleAddRestriction = (e: any) => {
        let department = e[0].value
        if (department.length > 0) {
            let foundDepartment = selectedDepartment.find(
                (departmentFind: any) => departmentFind === department
            )
            if (!foundDepartment) {
                setSelectedDepartment((departments: any) => [...departments, department])
                setTerm('')
                setInputValue('')
            }
        }
    }


    const options = {
        onSelect: (...args: any) => handleAddRestriction(args),
        loading,
        value: !term.length
            ? []
            : globalCategoriesList.filter((deparment: any) =>
                typeof deparment === 'string'
                    ? null
                    : deparment.label.toLowerCase().includes(term.toLowerCase())
            ),
    }

    const input = {
        onChange: (term: any) => {
            if (term) {
                setLoading(false)
                setTerm(term)
            } else {
                setTerm(term)
            }
        },
        //onSearch: (...args: any) => console.log('onSearch:', ...args),
        onClear: () => setTerm(''),
        placeholder: 'Buscar departamento...(Tecnología, Moda)',
        value: term,
    }

    const handleSubmit = async (e: any) => {
        //console.log('event', e)
        e.preventDefault()
        selectedDepartment.sort((a: any, b: any) => (parseInt(a) > parseInt(b) && 1) || -1)
        let configurationVariables: any = {
            id: configuration.id,
            name: configuration.name,
            status: configuration.status,
            type: configuration.type,
            value: configuration.value,
            sellers: configuration.sellers,
            ean: configuration.ean,
            productRef: configuration.productRef,
            productName: configuration.productName,
            skuName: configuration.skuName,
            brand: configuration.brand,
            category: configuration.category,
            skuRef: configuration.skuRef,
            created_at: configuration.created_at,
            updated_at: configuration.updated_at,
            restrictionStatus: checkGeneralRestriction,
            restrictionList: selectedDepartment
        }
        updateConfiguration({
            variables: {
                configuration: configurationVariables,
            },
        })
            .then(({ data }: any) => {
                console.log('updated', data)
                // setFormValues(INITIAL_FORM_VALUES)
                // setNameConfig('')
                // setSeller([])
                //sort by last id

                let configurationList = data.updateConfiguration.sort((a: any, b: any) => (a.id < b.id && 1) || -1)
                setConfigurationList(configurationList)
                setInitialConfigurationList(configurationList)

                setAlertType('success')
                setAlertMessage('Se ha guardado la configuración con éxito.')
                setShowAlert(true)
            })
            .catch((err: any) => {
                console.log('error', err)
                setAlertType('error')
                setAlertMessage('Ha ocurrido un error, intente nuevamente.')
                setShowAlert(true)
            })
    }

    const handleRemove = (id: any) => {

        let newList = selectedDepartment.filter((seller: any) => seller !== id)

        setSelectedDepartment(newList)

    }

    return (
        <div className="row">
            <h1>Reglas para {configuration.name}</h1>
            <div className="mt4 flex">
                <form onSubmit={handleSubmit}>
                    <div className="mb5">
                        <Checkbox
                            checked={checkGeneralRestriction}
                            id="option-0"
                            label="¿Desea restringir match de productos de diferentes sellers?"
                            name="default-checkbox-group"
                            onChange={handleCheckGeneralRestriction}
                            value="option-0"
                        />
                    </div>
                    <div className="mb5">
                        <AutocompleteInput
                            value={inputValue}
                            input={input}
                            options={options}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb5">
                        <ol>
                            {selectedDepartment.map((departmentKey: any) => {
                                let department = globalCategoriesList.find(
                                    (departmentFind: any) => departmentFind.value === departmentKey
                                )
                                return (
                                    <li key={departmentKey}>
                                        {' '}
                                        {department.label}{' '}
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(departmentKey)}
                                        >
                                            Remover
                                        </button>
                                    </li>
                                )
                            })}
                        </ol>
                    </div>

                    <div className="mb5">
                        {showAlert ? (
                            <Alert
                                type={`${alertType}`}
                                onClose={() => setShowAlert(false)}
                            >
                                {alertMessage}
                            </Alert>
                        ) : null}
                    </div>

                    <div className="mb5">
                        <Button
                            type="submit"
                            variation="primary"
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default RestrictionScoreDetails