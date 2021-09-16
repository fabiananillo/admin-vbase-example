import React from 'react'
import {
  MessageDescriptor,
  useIntl,
  defineMessages,
} from 'react-intl'
import { Dropdown } from 'vtex.styleguide'

export const AddCategory = (
  {
    setSelectedCategory,
    selectedCategory,
    categoryList
  }: any) => {
  const messages = defineMessages({
    addCategoryTitle: { id: 'admin-example.score-matcher.addCategoryTitle' },
    addCategoryPlaceholder: { id: 'admin-example.score-matcher.addCategoryPlaceholder' }
  })

  const intl = useIntl();
  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  let addCategoryTitle = translateMessage(messages.addCategoryTitle)
  let addCategoryPlaceholder = translateMessage(messages.addCategoryPlaceholder)

  const handleSelectCategory = (_: any, value: any) => {
    console.log('select category', value)
    setSelectedCategory(value)
  }

  return (
    <div>
      <h2>{addCategoryTitle}</h2>
      <Dropdown
        options={categoryList}
        value={selectedCategory}
        onChange={handleSelectCategory}
        placeholder={addCategoryPlaceholder}
      />
    </div>
  )
}
