import React from 'react'
import {
  MessageDescriptor,
  useIntl,
  defineMessages,
} from 'react-intl'
import { Dropdown } from 'vtex.styleguide'

export const AddBrand = ({
  setSelectedBrand,
  selectedBrand,
  brandList }: any) => {

  const messages = defineMessages({
    addBrandTitle: { id: 'admin-example.score-matcher.addBrandTitle' },
    addBrandPlaceholder: { id: 'admin-example.score-matcher.addBrandPlaceholder' }
  })

  const intl = useIntl();
  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  let addBrandTitle = translateMessage(messages.addBrandTitle)
  let addBrandPlaceholder = translateMessage(messages.addBrandPlaceholder)

  const handleSelectBrand = (_: any, value: any) => {
    setSelectedBrand(value)
  }

  return (
    <div>
      <h2>{addBrandTitle}</h2>
      <Dropdown
        options={brandList}
        value={selectedBrand}
        onChange={handleSelectBrand}
        placeholder={addBrandPlaceholder}
      />
    </div>
  )
}
