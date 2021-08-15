import React, { useState } from 'react'
import { AutocompleteInput } from 'vtex.styleguide'

export const AddSeller = ({
  setSelectedSeller,
  selectedSeller = [],
  sellerList,
}: any) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [term, setTerm] = useState<string>('')
  const [loadingSeller, setLoading] = useState<boolean>(false)


  // if (Object.entries(configuration).length !== 0) {

  //   configuration.sellers.map((value: any) => {
  //     console.log(value)
  //     let foundSeller = selectedSeller.find((sellerFind: any) => sellerFind === value)
  //     if (!foundSeller) {
  //       //console.log('test')
  //       setSelectedSeller((sellers: any) => [...sellers, value])
  //     }
  //   })
  // }

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
    onSearch: (...args: any) => console.log('onSearch:', ...args),
    onClear: () => setTerm(''),
    placeholder: 'Buscar seller',
    value: term,
  }

  return (
    <div>
      <h2>Seleccione Sellers</h2>
      <AutocompleteInput
        value={inputValue}
        input={input}
        options={options}
        onChange={handleInputChange}
      />
    </div>
  )
}
