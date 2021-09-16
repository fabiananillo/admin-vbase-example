import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import {
    MessageDescriptor,
    useIntl,
    defineMessages,
} from 'react-intl'
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

    const messages = defineMessages({
        restrictionTitle: { id: 'admin-example.score-matcher.restrictionTitle' },
        restrictionPlaceholder: { id: 'admin-example.score-matcher.restrictionPlaceholder' },
        restrictionCheckbox: { id: 'admin-example.score-matcher.restrictionCheckbox' },
        removeBtn: { id: 'admin-example.score-matcher.removeBtn' },
        saveBtn: { id: 'admin-example.score-matcher.saveBtn' },
        restrictionAlertSuccess: { id: 'admin-example.score-matcher.restrictionAlertSuccess' },
        restrictionAlertError: { id: 'admin-example.score-matcher.restrictionAlertError' }
    })
    const intl = useIntl();
    const translateMessage = (message: MessageDescriptor) =>
        intl.formatMessage(message)

    let restrictionTitle = translateMessage(messages.restrictionTitle)
    let restrictionPlaceholder = translateMessage(messages.restrictionPlaceholder)
    let restrictionCheckbox = translateMessage(messages.restrictionCheckbox)
    let removeBtn = translateMessage(messages.removeBtn)
    let saveBtn = translateMessage(messages.saveBtn)
    let restrictionAlertSuccess = translateMessage(messages.restrictionAlertSuccess)
    let restrictionAlertError = translateMessage(messages.restrictionAlertError)

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
        placeholder: restrictionPlaceholder,
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
            setAlertMessage(restrictionAlertSuccess)
            setShowAlert(true)
        }).catch((err: any) => {
            console.log('error', err)
            setAlertType('error')
            setAlertMessage(restrictionAlertError)
            setShowAlert(true)
        })
    }

    const handleRemove = (id: any) => {

        let newList = selectedDepartment.filter((seller: any) => seller !== id)

        setSelectedDepartment(newList)

    }

    return (
        <div className="row">
            <h1>{restrictionTitle}</h1>
            <div className="mt4 flex">
                <form onSubmit={handleSubmit}>
                    <div className="mb5">
                        <Checkbox
                            checked={checkGeneralRestriction}
                            id="option-matcher"
                            label={restrictionCheckbox}
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
                                            className="t-action--small pv3"
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
                                                {removeBtn}
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
                            {saveBtn}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
