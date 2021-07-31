import React from 'react'
import { SafeAreaView } from 'react-native'
import Dropdown, {
  DropdownProps,
  Selected,
} from 'react-native-dropdown-enhanced'

const data: Selected[] = [
  { label: 'Ha Noi', value: 10 },
  { label: 'Ho Chi Minh', value: 11 },
  { label: 'Thai Binh', value: 12 },
  { label: 'Da Nang', value: 13 },
  { label: 'Da Lat', value: 14 },
  { label: 'Thanh Hoa', value: 15 },
]

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
      <Dropdown data={data} defaultValue={14} />
    </SafeAreaView>
  )
}

export default App
