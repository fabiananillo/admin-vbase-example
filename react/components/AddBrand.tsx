import React from 'react'
import { Dropdown } from 'vtex.styleguide'

export const AddBrand = ({
  setSelectedBrand,
  selectedBrand,
  brandList }: any) => {

  //console.log('brandList component', brandList)

  const handleSelectBrand = (_: any, value: any) => {
    setSelectedBrand(value)
  }

  return (
    <div>
      <h2>Seleccione Marca</h2>
      <Dropdown
        options={brandList}
        value={selectedBrand}
        onChange={handleSelectBrand}
      />
    </div>
  )
}
