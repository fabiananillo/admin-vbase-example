import React, { useState } from 'react'
import { Dropdown } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import brandsQuery from '../graphql/brands.gql'

export const AddBrand = ({ defaultBrand = '' }: any) => {
  const [selected, setSelected] = useState<string>(
    defaultBrand !== '' ? defaultBrand : ''
  )
  const { data } = useQuery(brandsQuery)
  let brandList: any[] = []

  if (data) {
    let items = data.brands.items
    items.map((value: any) => {
      brandList = [...brandList, { value: value.id, label: value.name }]
    })
    brandList.sort(
      (a, b) => (a.label.toLowerCase() > b.label.toLowerCase() && 1) || -1
    )
  }

  const handleSelectBrand = (_: any, value: any) => {
    setSelected(value)
  }

  return (
    <div>
      <h2>Seleccione Marca</h2>
      <Dropdown
        options={brandList}
        value={selected}
        onChange={handleSelectBrand}
      />
    </div>
  )
}
