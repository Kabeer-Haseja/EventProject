import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useTheme} from '../context';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = React.memo(({
  value,
  onChangeText,
  placeholder = 'Search events...',
}) => {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.card}]}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={[styles.input, {color: colors.text}]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onChangeText('')}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Text style={[styles.clearText, {color: colors.textSecondary}]}>
            ✕
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    fontSize: 20,
    fontWeight: '300',
  },
});

