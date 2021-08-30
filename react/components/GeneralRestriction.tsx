import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import newGeneralRestrictionGQL from '../graphql/newGeneralRestriction.gql'
import generalRestrictionGQL from '../graphql/generalRestriction.gql'
import {
    Checkbox, AutocompleteInput, Button, Alert
} from 'vtex.styleguide'


export const GeneralRestriction = ({ globalCategoriesList }: any) => {

    const [inputValue, setInputValue] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [term, setTerm] = useState<string>('')
    const [checkGeneralRestriction, setcheckGeneralRestriction] = useState<boolean>(false)
    const [newGeneralRestriction] = useMutation(newGeneralRestrictionGQL)
    const [selectedDepartment, setSelectedDepartment] = useState<any>([])
    const [alertType, setAlertType] = useState<string>('')
    const [alertMessage, setAlertMessage] = useState<string>('')
    const [showAlert, setShowAlert] = useState<boolean>(false)

    useQuery(generalRestrictionGQL, {
        onCompleted: ({ generalRestriction }: any) => {
            //console.log('generalRestrictionQuery', generalRestriction)
            if (generalRestriction) {
                setcheckGeneralRestriction(generalRestriction?.status)
                setSelectedDepartment(generalRestriction?.list)
            }
        },
    })

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

        let foundDepartment = selectedDepartment?.find(
            (departmentFind: any) => departmentFind === department
        )

        if (!foundDepartment) {
            setSelectedDepartment((departments: any) => [...departments, department])
            setTerm('')
            setInputValue('')
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
        selectedDepartment?.sort((a: any, b: any) => (parseInt(a) > parseInt(b) && 1) || -1)
        newGeneralRestriction({
            variables: {
                generalRestriction: {
                    status: checkGeneralRestriction,
                    list: selectedDepartment
                },
            },
        }).then(({ data }: any) => {
            setcheckGeneralRestriction(data.newGeneralRestriction.status);
            setSelectedDepartment(data.newGeneralRestriction.list)
            setAlertType('success')
            setAlertMessage('Se ha guardado la regla con éxito.')
            setShowAlert(true)
        }).catch((err: any) => {
            console.log('error', err)
            setAlertType('error')
            setAlertMessage('Ha ocurrido un error')
            setShowAlert(true)
        })
    }

    const handleRemove = (id: any) => {

        let newList = selectedDepartment.filter((seller: any) => seller !== id)

        setSelectedDepartment(newList)

    }

    return (
        <div className="row">
            <h1>Rules</h1>
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
                    <div className="mb9">
                        <ol>
                            {selectedDepartment?.map((departmentKey: any) => {
                                if (globalCategoriesList.length > 0) {
                                    //console.log('globalCategoriew', globalCategoriesList)
                                    let department = globalCategoriesList?.find(
                                        (departmentFind: any) => departmentFind.value === departmentKey
                                    )
                                    return (
                                        <li
                                            className="t-action--small pv4"
                                            key={departmentKey}
                                        >
                                            {' '}
                                            {department?.label}
                                            {' '}
                                            <Button
                                                type="button"
                                                variation="danger"
                                                size="small"
                                                onClick={() => handleRemove(departmentKey)}
                                            >
                                                Quitar
                                            </Button>
                                        </li>
                                    )
                                }
                                return null;
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
