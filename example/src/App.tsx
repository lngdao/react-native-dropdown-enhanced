import React, { useState, useEffect } from 'react'
import { Text } from 'react-native'
import { StyleSheet, SafeAreaView, ActivityIndicator, View } from 'react-native'
import { getListProvinceCode, getNcovInformation } from './services/api/api'
import Dropdown, { Selected } from 'react-native-dropdown-enhanced'

type ProvincePayload = {
  name: string
  'hec-key': number
}

const App = () => {
  const [listProvince, setListProvince] = useState<Array<Selected>>([])
  const [dataCovid, setDataCovid] = useState<any>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [information, setInformation] = useState<any>({})

  const requestGetListProvince = async () => {
    const dataProvince = await (await fetch(getListProvinceCode)).json()
    const dataNcov = await (await fetch(getNcovInformation)).json()
    setListProvince(
      dataProvince.key.map((item: ProvincePayload) => ({
        label: item.name.replace(/-/g, ' ').toUpperCase(),
        value: item['hec-key'],
      }))
    )
    setDataCovid(dataNcov)
    setIsLoading(false)
  }

  const onSelected = (selected: Selected) => {
    let target = dataCovid?.detail?.find(
      (item: any) => item['hc-key'] == selected.value
    )
    setInformation(target)
  }

  useEffect(() => {
    requestGetListProvince()
  }, [])

  if (isLoading)
    return (
      <View style={styles.centerStyle}>
        <ActivityIndicator size='large' />
        <Text style={{ marginTop: 15 }} children={'Loading data...'} />
      </View>
    )

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.text}>CHOOSE PROVINCE: </Text>
        <Dropdown
          data={listProvince}
          labelStyle={styles.text}
          style={{ height: 40, borderWidth: 0, borderBottomWidth: 1 }}
          onSelectedChange={onSelected}
        />
      </View>
      <View style={[styles.centerStyle, { zIndex: -1 }]}>
        <Text style={styles.title}>VIETNAM COVID-19 DATA</Text>
        <Text
          style={[styles.text, { marginBottom: 5, color: '#E43022' }]}
          children={`DEAD: ${information?.socatuvong || dataCovid?.deceased}`}
        />
        <Text
          style={[styles.text, { color: '#7FB36D' }]}
          children={`RECOVERED: ${
            information?.socakhoi || dataCovid?.recovered
          }`}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  centerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: '500',
    fontSize: 19,
    position: 'absolute',
    bottom: 0,
    marginTop: 30,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
})

export default App
