import React, { useState } from 'react'
import { Dropdown } from 'vtex.styleguide'
import { useQuery } from 'react-apollo'
import categoriesQuery from '../graphql/categories.gql'

export const AddCategory = ({ defaultCategory = '' }: any) => {
  const [selected, setSelected] = useState<string>(
    defaultCategory !== '' ? defaultCategory : ''
  )
  const { data } = useQuery(categoriesQuery)

  let categoryList: any[] = []
  if (data) {
    let items = data.categories.items
    items.map((value: any) => {
      categoryList = [...categoryList, { value: value.id, label: value.name }]
    })
    categoryList.sort(
      (a, b) => (a.label.toLowerCase() > b.label.toLowerCase() && 1) || -1
    )
  }

  const handleSelectCategory = (_: any, value: any) => {
    console.log('select category', value)
    setSelected(value)
  }

  return (
    <div>
      <h2>Seleccione Categoria</h2>
      <Dropdown
        options={categoryList}
        value={selected}
        onChange={handleSelectCategory}
      />
    </div>
  )
}
