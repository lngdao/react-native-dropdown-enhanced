/// <reference types="react" />
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
export interface DropdownProps {
    data: Array<Selected>;
    defaultValue?: number;
    onSelectedChange?: (selected: Selected) => void;
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    searchStyle?: StyleProp<TextStyle>;
    searchCombine?: boolean;
    searchPlaceholder?: string;
    activeTextColor?: string;
    inactiveTextColor?: string;
}
export declare type Selected = {
    label: string;
    value: number;
};
declare const Dropdown: (props: DropdownProps) => JSX.Element;
export default Dropdown;
