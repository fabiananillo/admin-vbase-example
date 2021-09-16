import React, { useState } from 'react'
import { AutocompleteInput } from 'vtex.styleguide'
import {
  MessageDescriptor,
  useIntl,
  defineMessages,
} from 'react-intl'

export const AddSeller = ({
  setSelectedSeller,
  selectedSeller = [],
  sellerList,
}: any) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [term, setTerm] = useState<string>('')
  const [loadingSeller, setLoading] = useState<boolean>(false)
  const messages = defineMessages({
    addSellerTitle: { id: 'admin-example.score-matcher.addSellerTitle' },
    addSellerPlaceholder: { id: 'admin-example.score-matcher.addSellerPlaceholder' }
  })

  const intl = useIntl();
  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  let addSellerTitle = translateMessage(messages.addSellerTitle)
  let addSellerPlaceholder = translateMessage(messages.addSellerPlaceholder)

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value)
  }

  const handleAddSeller = (e: any) => {
    let sellerName = e[0].value
    if (sellerName.length > 0) {
      let foundSeller = selectedSeller.find(
        (sellerFind: any) => sellerFind === sellerName
      )
      if (!foundSeller) {
        setSelectedSeller((sellers: any) => [...sellers, sellerName])
        setTerm('')
        setInputValue('')
      }
    }
  }

  //console.log('sellerList', sellerList);
  //const timeoutRef = useRef(null)
  const options = {
    onSelect: (...args: any) => handleAddSeller(args),
    loadingSeller,
    value: !term.length
      ? []
      : sellerList.filter((seller: any) =>
        typeof seller === 'string'
          ? null
          : seller.label.toLowerCase().includes(term.toLowerCase())
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
    placeholder: addSellerPlaceholder,
    value: term,
  }

  return (
    <div>
      <h2>{addSellerTitle}</h2>
      <AutocompleteInput
        value={inputValue}
        input={input}
        options={options}
        onChange={handleInputChange}
      />
    </div>
  )
}
