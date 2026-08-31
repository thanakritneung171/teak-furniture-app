import React from 'react';
import { KeyboardTypeOptions, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors, font, radius } from '../theme/tokens';
import { T } from './ui';

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <T size={12} c={colors.forest700} w="semibold" style={{ marginBottom: 6 }}>
        {label}
      </T>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mute}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, multiline ? { minHeight: 80, textAlignVertical: 'top', paddingTop: 12 } : null]}
      />
    </View>
  );
}

export function Choice({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <T size={12} c={colors.forest700} w="semibold" style={{ marginBottom: 8 }}>
        {label}
      </T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <Pressable
              key={o.value}
              onPress={() => onChange(o.value)}
              style={[styles.opt, active && { backgroundColor: colors.forest900, borderColor: colors.forest900 }]}
            >
              <T size={13} w={active ? 'semibold' : 'regular'} c={active ? colors.white : colors.textBody}>
                {o.label}
              </T>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    fontFamily: font.regular,
    fontSize: 15,
    color: colors.textStrong,
  },
  opt: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
});
