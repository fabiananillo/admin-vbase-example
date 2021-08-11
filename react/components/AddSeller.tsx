import React, { useState } from 'react'
import { AutocompleteInput } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import sellersQuery from '../graphql/sellers.gql'

export const AddSeller = ({
  setSeller,
  configuration = {},
  sellers = [],
}: any) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [term, setTerm] = useState<string>('')
  const [loadingSeller, setLoading] = useState<boolean>(false)
  const { data } = useQuery(sellersQuery)
  let sellerList: any[] = []
  if (data) {
    let items = data.sellers.items
    //console.log('items', items);
    items.map((value: any) => {
      sellerList = [...sellerList, { value: value.id, label: value.name }]
    })
  }

  if (Object.entries(configuration).length !== 0) {
    
    configuration.sellers.map((value: any) => {
      console.log(value)
      let foundSeller = sellers.find((sellerFind: any) => sellerFind === value)
      if (!foundSeller) {
        //console.log('test')
        setSeller((sellers: any) => [...sellers, value])
      }
    })
  }

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value)
  }

  const handleAddSeller = (e: any) => {
    let sellerName = e[0].value
    if (sellerName.length > 0) {
      let foundSeller = sellers.find(
        (sellerFind: any) => sellerFind === sellerName
      )
      if (!foundSeller) {
        setSeller((sellers: any) => [...sellers, sellerName])
        setTerm('')
        setInputValue('')
      }
    }
  }

  //const timeoutRef = useRef(null)
  const options = {
    onSelect: (...args: any) => handleAddSeller(args),
    loadingSeller,
    value: !term.length
      ? []
      : sellerList.filter((user) =>
          typeof user === 'string'
            ? null
            : user.label.toLowerCase().includes(term.toLowerCase())
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
