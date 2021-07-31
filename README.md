# react-native-dropdown-enhanced

A simply **dropdown** | **selected** | **picker** | **combine searchable** for react native that works both for IOS and Android.

## Installation

### # Using yarn

     yarn add react-native-dropdown-enhanced

### # Using npm

     npm add react-native-dropdown-enhanced

## Demo

#### Code provided in `Examples folder`.

## Usage

#### Simple usage

```
const data: Selected[] = [
  {label: 'Ha Noi', value: 10},
  {label: 'Ho Chi Minh', value: 11},
  {label: 'Thai Binh', value: 12},
  {label: 'Da Nang', value: 13},
  {label: 'Da Lat', value: 14},
  {label: 'Thanh Hoa', value: 15},
];

const App = () => {
return (
    <SafeAreaView
      style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Dropdown
        data={data}
        defaultValue={14}
        onSelectedChange={({label, value}) => console.log(label)}
      />
    </SafeAreaView>
  )
}
```

#### Combine search

```
const App = () => {
  return (
    <SafeAreaView
      style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Dropdown
        data={data}
        defaultValue={14}
        onSelectedChange={({label, value}) => console.log(label)}
        searchable
      />
    </SafeAreaView>
  );
};
```

## Props

Updating...

## License

[MIT](https://choosealicense.com/licenses/mit/)
