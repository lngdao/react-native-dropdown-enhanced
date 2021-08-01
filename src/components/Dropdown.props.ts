import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface DropdownProps {
  data: Array<Selected>;
  defaultValue?: number | string;
  onSelectedChange?: (selected: Selected) => void;
  style?: StyleProp<ViewStyle>;
  defaultLabel?: string;
  itemSeparatorComponent?: React.ReactElement;
  showsVerticalScrollIndicator?: boolean;
  itemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  searchStyle?: StyleProp<TextStyle>;
  searchable?: boolean;
  searchPlaceholder?: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
  delayCalcPosition?: number;
}

export type Selected = {
  label: string;
  value: number | string;
};
