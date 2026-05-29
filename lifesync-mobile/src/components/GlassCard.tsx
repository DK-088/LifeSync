import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 20,
  className = "",
}) => {
  return (
    <View className={`overflow-hidden rounded-3xl border border-white/10 ${className}`} style={style}>
      <BlurView
        intensity={intensity}
        tint="dark"
        className="p-6"
      >
        {children}
      </BlurView>
    </View>
  );
};
