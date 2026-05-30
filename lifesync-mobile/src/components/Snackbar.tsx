import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import { Info, AlertCircle, CheckCircle } from "lucide-react-native";

interface SnackbarProps {
  visible: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onDismiss: () => void;
}

export default function Snackbar({ visible, message, type = "info", onDismiss }: SnackbarProps) {
  const slideAnim = useRef(new Animated.Value(-120)).current; // starts offscreen at top

  useEffect(() => {
    if (visible) {
      // Spring animation for modern sliding bounce effect
      Animated.spring(slideAnim, {
        toValue: 20, // Slide down past top status bar
        useNativeDriver: true,
        tension: 70,
        friction: 8,
      }).start();

      // Auto dismiss after 3.5 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 3500);

      return () => clearTimeout(timer);
    } else {
      slideAnim.setValue(-120);
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: -120, // slide back up offscreen
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle color="#10b981" size={20} />;
      case "error":
        return <AlertCircle color="#ef4444" size={20} />;
      default:
        return <Info color="#c084fc" size={20} />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "rgba(16, 185, 129, 0.4)";
      case "error":
        return "rgba(239, 68, 68, 0.4)";
      default:
        return "rgba(192, 132, 252, 0.4)"; // brand purple accent border
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          borderColor: getBorderColor(),
        },
      ]}
    >
      <BlurView intensity={35} tint="dark" style={styles.blur}>
        {getIcon()}
        <Text style={styles.text}>{message}</Text>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 30,
    left: 20,
    right: 20,
    zIndex: 9999,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  blur: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: "rgba(10, 10, 15, 0.88)",
    gap: 12,
  },
  text: {
    color: "#fff",
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
  },
});
