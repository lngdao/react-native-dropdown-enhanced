import * as React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  ListRenderItem,
} from 'react-native'
import { DropdownProps, Selected } from './Dropdown.props'

type ContainerDimension = {
  width: number
  height: number
  px: number
  py: number
}

const SPACING = 10
const DEFAULT_VALUE = 0

const Dropdown = (props: DropdownProps) => {
  const {
    data,
    defaultValue,
    onSelectedChange,
    style,
    labelStyle,
    dropdownStyle,
    searchable,
    searchStyle,
    defaultLabel = 'All',
    itemStyle,
    itemTextStyle,
    searchPlaceholder = 'Type here',
    activeTextColor = 'orange',
    inactiveTextColor = 'black',
    itemSeparatorComponent,
    showDropIcon = true,
    separatorStyle,
    showTickIcon = false,
    tickIconStyle,
    delayCalcPosition = 200,
    ...flatListProps
  } = props

  const [selected, setSelected] = useState<Selected>({
    label: defaultLabel,
    value: '',
  })
  const [dataDropdown, setDataDropdown] = useState<Array<Selected>>(data)
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false)
  const [containerDimension, setContainerDimension] =
    React.useState<ContainerDimension>({
      width: DEFAULT_VALUE,
      height: DEFAULT_VALUE,
      px: DEFAULT_VALUE,
      py: DEFAULT_VALUE,
    })
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
  const [textSearch, setTextSearch] = useState<string>(data[0].label)
  const [isCalculatingPostition, setIsCalculatingPosition] =
    useState<boolean>(true)
  const [currentOffset, setCurrentOffset] = useState<number | undefined>(
    undefined
  )
  const containerRef = useRef<View>(null)
  const inputRef = useRef<TextInput>(null)
  const listRef = useRef<FlatList>(null)
  const currentOffsetRef = useRef<number>(DEFAULT_VALUE)

  const handleOnLayout = () => {
    setTimeout(() => {
      containerRef.current?.measure((fx, fy, width, height, px, py) => {
        setContainerDimension(prev => ({
          ...prev,
          width,
          height,
          px,
          py,
        }))
      })
    }, delayCalcPosition)
    setIsCalculatingPosition(false)
  }

  const toggleDropdown = () => {
    if (searchable) {
      setTextSearch(selected.label)
      setIsSearchActive(!dropdownVisible)
    }
    setDropdownVisible(prev => !prev)
  }

  const onSearch = (text: string) => {
    setTextSearch(text)
    var matchingData = data.filter(item => item.label.search(text) != -1)
    setDataDropdown(matchingData)
  }

  const checkDefaultValue = () => {
    if (defaultValue) {
      let target = data.find(item => item.value == defaultValue)

      if (target) {
        setSelected(prev => ({
          ...prev,
          label: target!.label,
          value: defaultValue,
        }))
      }
    }
  }

  useEffect(() => {
    if (dropdownVisible && currentOffset) {
      setTimeout(() => {
        listRef.current?.scrollToOffset({
          offset: currentOffset,
          animated: false,
        })
      }, 0)
    }
  }, [dropdownVisible])

  useEffect(() => {
    // check default value
    checkDefaultValue()
  }, [])

  const renderDropdownItem: ListRenderItem<Selected> = ({ item }) => {
    const dropdownItemView = (
      <View style={[styles.dropdownItem, itemStyle]}>
        <Text
          style={[
            {
              color:
                selected.value == item.value
                  ? activeTextColor
                  : inactiveTextColor,
            },
            itemTextStyle,
          ]}
          children={item.label}
        />
        {selected.value == item.value && showTickIcon && (
          <Image
            style={[styles.tickIcon, tickIconStyle]}
            source={require('../assets/ic_tick.png')}
          />
        )}
      </View>
    )

    return (
      <TouchableOpacity
        onPress={() => {
          setCurrentOffset(currentOffsetRef.current)
          toggleDropdown()
          setSelected(item)
          !!onSelectedChange && onSelectedChange(item)
          searchable && setIsSearchActive(false)
          searchable && setDataDropdown(data)
        }}
        children={dropdownItemView}
      />
    )
  }

  const containerView = () => {
    const containerChild =
      searchable && isSearchActive ? (
        <TextInput
          ref={inputRef}
          value={textSearch}
          contextMenuHidden
          placeholder={searchPlaceholder}
          onChangeText={onSearch}
          autoFocus
          style={[styles.searchStyle, searchStyle]}
        />
      ) : (
        <Text
          style={[styles.label, labelStyle]}
          numberOfLines={1}
          children={selected.label}
        />
      )

    return (
      <View
        ref={containerRef}
        onLayout={handleOnLayout}
        style={[styles.containerStyle, style]}
      >
        {containerChild}
        {showDropIcon && (
          <Image
            style={[
              styles.ic_arrow,
              { transform: [{ rotate: dropdownVisible ? '180deg' : '0deg' }] },
            ]}
            source={require('../assets/ic_arrow_down.png')}
          />
        )}
      </View>
    )
  }

  const dropdownWrapper = (cpn: JSX.Element) => {
    return !searchable ? (
      <Modal
        visible={dropdownVisible}
        transparent
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={toggleDropdown}
          children={
            <View
              style={{ flex: 1, backgroundColor: 'transparent' }}
              children={cpn}
            />
          }
        />
      </Modal>
    ) : (
      cpn
    )
  }

  const keyExtractor = useCallback((_, index) => `${index}`, [])

  const separatorComponent = useCallback(
    () =>
      itemSeparatorComponent || (
        <View style={[styles.separator, separatorStyle]} />
      ),
    []
  )

  const renderDropdown = () => (
    <View
      pointerEvents={dropdownVisible ? undefined : 'none'}
      style={[
        styles.dropdown,
        {
          top:
            containerDimension.height +
            5 +
            (!searchable ? containerDimension.py : 0),
          left: !searchable ? containerDimension.px : 0,
          width: containerDimension.width,
          opacity: dropdownVisible ? 1 : 0,
        },
        dropdownStyle,
      ]}
      children={
        <FlatList
          ref={listRef}
          data={dataDropdown}
          renderItem={renderDropdownItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={separatorComponent}
          scrollEventThrottle={16}
          onScroll={event => {
            currentOffsetRef.current = event.nativeEvent.contentOffset.y
          }}
          initialNumToRender={data.length}
          {...flatListProps}
        />
      }
    />
  )

  return (
    <View style={{ zIndex: 5, overflow: 'visible', flex: 1 }}>
      <TouchableWithoutFeedback
        disabled={isCalculatingPostition}
        onPress={toggleDropdown}
        children={containerView()}
      />
      {dropdownWrapper(renderDropdown())}
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    borderColor: '#CED4DA',
    borderWidth: 1,
    height: 50,
    padding: SPACING,
  },
  label: {
    flex: 1,
    paddingRight: SPACING,
  },
  ic_arrow: {
    width: 12,
    height: 12,
  },
  searchStyle: {
    flex: 1,
    paddingRight: SPACING,
  },
  dropdown: {
    zIndex: 20,
    position: 'absolute',
    borderRadius: 5,
    maxHeight: 200,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  dropdownItem: {
    padding: SPACING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#CED4DA',
    marginHorizontal: SPACING,
  },
  tickIcon: {
    width: 17,
    height: 17,
    tintColor: 'orange',
  },
})

export default Dropdown
