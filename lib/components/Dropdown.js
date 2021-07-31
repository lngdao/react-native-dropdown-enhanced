"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_1 = require("react");
const react_native_1 = require("react-native");
const SPACING = 10;
const DEFAULT_VALUE = 0;
const Dropdown = (props) => {
    const { data, defaultValue, onSelectedChange, style, labelStyle, searchCombine, searchStyle, searchPlaceholder = 'Type here', activeTextColor = 'orange', inactiveTextColor = 'black', } = props;
    const [selected, setSelected] = react_1.useState({
        label: data[DEFAULT_VALUE].label,
        value: data[DEFAULT_VALUE].value,
    });
    const [dataDropdown, setDataDropdown] = react_1.useState(data);
    const [dropdownVisible, setDropdownVisible] = react_1.useState(false);
    const [containerDimension, setContainerDimension] = React.useState({
        width: DEFAULT_VALUE,
        height: DEFAULT_VALUE,
        px: DEFAULT_VALUE,
        py: DEFAULT_VALUE,
    });
    const [isSearchActive, setIsSearchActive] = react_1.useState(false);
    const [textSearch, setTextSearch] = react_1.useState(data[DEFAULT_VALUE].label);
    const containerRef = react_1.useRef(null);
    const inputRef = react_1.useRef(null);
    const handleOnLayout = () => {
        containerRef.current?.measure((fx, fy, width, height, px, py) => {
            console.log(fx, fy, width, height, px, py);
            setContainerDimension((prev) => ({
                ...prev,
                width,
                height,
                px,
                py,
            }));
        });
    };
    const toggleDropdown = () => {
        if (searchCombine) {
            setTextSearch(selected.label);
            setIsSearchActive(!dropdownVisible);
        }
        setDropdownVisible((prev) => !prev);
    };
    const onSearch = (text) => {
        setTextSearch(text);
        var matchingData = data.filter((item) => item.label.search(text) != -1);
        setDataDropdown(matchingData);
    };
    const checkDefaultValue = () => {
        if (defaultValue) {
            let target = data.find((item) => item.value == defaultValue);
            if (target) {
                setSelected((prev) => ({
                    ...prev,
                    label: target.label,
                    value: defaultValue,
                }));
            }
        }
    };
    react_1.useEffect(() => {
        // check default value
        checkDefaultValue();
    }, []);
    const renderDropdownItem = ({ item, index, }) => {
        const dropdownItemView = (<react_native_1.View style={styles.dropdownItem}>
        <react_native_1.Text style={{
                color: selected.value == item.value
                    ? activeTextColor
                    : inactiveTextColor,
            }} children={item.label}/>
      </react_native_1.View>);
        return (<react_native_1.TouchableOpacity onPress={() => {
                toggleDropdown();
                setSelected(item);
                !!onSelectedChange && onSelectedChange(item);
                searchCombine && setIsSearchActive(false);
                searchCombine && setDataDropdown(data);
            }} children={dropdownItemView}/>);
    };
    const containerView = () => {
        const containerChild = searchCombine && isSearchActive ? (<react_native_1.TextInput ref={inputRef} value={textSearch} contextMenuHidden placeholder={searchPlaceholder} onChangeText={onSearch} autoFocus style={[styles.searchStyle, searchStyle]}/>) : (<react_native_1.Text style={[styles.label, labelStyle]} numberOfLines={1} children={selected.label}/>);
        return (<react_native_1.View ref={containerRef} onLayout={handleOnLayout} style={[styles.containerStyle, style]}>
        {containerChild}
        <react_native_1.Image style={[
                styles.ic_arrow,
                { transform: [{ rotate: dropdownVisible ? '180deg' : '0deg' }] },
            ]} source={require('../assets/ic_arrow_down.png')}/>
      </react_native_1.View>);
    };
    const dropdownWrapper = (cpn) => {
        return !searchCombine ? (<react_native_1.Modal visible={dropdownVisible} transparent onRequestClose={() => setDropdownVisible(false)}>
        <react_native_1.TouchableWithoutFeedback onPress={toggleDropdown} children={<react_native_1.View style={{ flex: 1, backgroundColor: 'transparent' }} children={cpn}/>}/>
      </react_native_1.Modal>) : (cpn);
    };
    const renderDropdown = () => (<react_native_1.View pointerEvents={dropdownVisible ? undefined : 'none'} style={[
            styles.dropdown,
            {
                top: containerDimension.height +
                    5 +
                    (!searchCombine ? containerDimension.py : 0),
                left: !searchCombine ? containerDimension.px : 0,
                width: containerDimension.width,
                opacity: dropdownVisible ? 1 : 0,
            },
        ]} children={<react_native_1.FlatList data={dataDropdown} renderItem={renderDropdownItem} keyExtractor={(_, index) => `${index}`} ItemSeparatorComponent={() => <react_native_1.View style={styles.separator}/>}/>}/>);
    return (<react_native_1.View style={{ zIndex: 5 }}>
      <react_native_1.TouchableWithoutFeedback onPress={toggleDropdown} children={containerView()}/>
      {dropdownWrapper(renderDropdown())}
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({
    containerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 5,
        borderColor: '#CED4DA',
        borderWidth: 1,
        width: 200,
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
    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#CED4DA',
        marginHorizontal: SPACING,
    },
});
exports.default = Dropdown;
//# sourceMappingURL=Dropdown.js.map