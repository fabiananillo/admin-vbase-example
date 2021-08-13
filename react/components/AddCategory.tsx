import React from 'react'
import { Dropdown } from 'vtex.styleguide'

export const AddCategory = (
  {
    setSelectedCategory,
    selectedCategory,
    categoryList
  }: any) => {

  const handleSelectCategory = (_: any, value: any) => {
    console.log('select category', value)
    setSelectedCategory(value)
  }

  return (
    <div>
      <h2>Seleccione Categoria</h2>
      <Dropdown
        options={categoryList}
        value={selectedCategory}
        onChange={handleSelectCategory}
      />
    </div>
  )
}
