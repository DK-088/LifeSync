import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ImageBackground
        source={require("../assets/Arc_bg.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Bottom content */}
          <View style={styles.content}>
            {/* Heading */}
            <Text style={styles.heading}>
              Effortless daily{"\n"}tracking clarity{"\n"}Automate your{"\n"}expenses and{"\n"}gain total focus
            </Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Automate daily expenses, track growth, and enhance your financial focus
            </Text>

            {/* Get Started button */}
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.85}
              onPress={() => router.push("/signin")}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08080f",
  },
  backgroundImage: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    paddingHorizontal: 28,
    paddingBottom: 40, // Reduced since SafeAreaView adds its own bottom padding
  },
  heading: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 34,
    color: "#ffffff",
    lineHeight: 42,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    color: "rgba(255,255,255,0.55)",
    lineHeight: 21,
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#ffffff",
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Outfit_600SemiBold",
    color: "#0a0a12",
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
