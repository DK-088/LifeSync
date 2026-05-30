import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { authApi } from "../src/services/apiClient";
import Snackbar from "../src/components/Snackbar";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");

export default function SignUpScreen() {
  const router = useRouter();
  
  // State variables for signup fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Realtime validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (val: string) => {
    setEmail(val);
    if (!val.trim()) {
      setEmailError("");
      return;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(val.trim())) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (val: string) => {
    setPassword(val);
    if (!val.trim()) {
      setPasswordError("");
      return;
    }
    if (val.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
    } else {
      setPasswordError("");
    }
  };

  // Snackbar local states
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error" | "info">("info");

  const showSnackbar = (message: string, type: "success" | "error" | "info" = "info") => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const handleSignUp = async () => {
    if (!name.trim()) {
      showSnackbar("Please enter your full name.", "error");
      return;
    }
    
    if (!email.trim()) {
      setEmailError("Please enter your email address.");
      return;
    }
    if (emailError) return;
    
    if (!password.trim()) {
      setPasswordError("Please enter your password.");
      return;
    }
    if (passwordError) return;

    setLoading(true);
    try {
      await authApi.register(
        name.trim(),
        email.trim().toLowerCase(),
        password.trim(),
        phone.trim() || undefined
      );
      setLoading(false);
      showSnackbar("Account created successfully! Redirecting...", "success");
      
      // Delay navigation slightly so they can see the success toast message
      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    } catch (error: any) {
      setLoading(false);
      console.warn("[SIGNUP_ERROR]", error.message || error);
      showSnackbar(
        error.message || "Unable to connect to the server. Please check if the backend is running.",
        "error"
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Fixed Background Image using physical screen size */}
      <ImageBackground
        source={require("../assets/Arc_bg.png")}
        style={[
          StyleSheet.absoluteFillObject,
          {
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            position: "absolute",
          }
        ]}
        imageStyle={styles.backgroundImageStyle}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to start your journey</Text>
            </View>

            {/* Form Card */}
            <BlurView intensity={35} tint="dark" style={styles.glassCard}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <User color="rgba(255,255,255,0.4)" size={20} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter your full name"
                    placeholderTextColor="rgba(255, 255, 255, 0.53)"
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Email Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[
                  styles.inputWrapper,
                  emailError ? styles.inputWrapperError : null
                ]}>
                  <Mail color={emailError ? "#ef4444" : "rgba(255,255,255,0.4)"} size={20} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(255, 255, 255, 0.53)"
                    style={styles.input}
                    value={email}
                    onChangeText={validateEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              {/* Phone Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number (Optional)</Text>
                <View style={styles.inputWrapper}>
                  <Phone color="rgba(255,255,255,0.4)" size={20} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter your phone number"
                    placeholderTextColor="rgba(255, 255, 255, 0.53)"
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[
                  styles.inputWrapper,
                  passwordError ? styles.inputWrapperError : null
                ]}>
                  <Lock color={passwordError ? "#ef4444" : "rgba(255,255,255,0.4)"} size={20} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(255, 255, 255, 0.53)"
                    style={styles.input}
                    value={password}
                    onChangeText={validatePassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff color={passwordError ? "#ef4444" : "rgba(255,255,255,0.4)"} size={20} />
                    ) : (
                      <Eye color={passwordError ? "#ef4444" : "rgba(255,255,255,0.4)"} size={20} />
                    )}
                  </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSignUp}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#9900ff", "#9900ff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.signUpGradient}
                >
                  <Text style={styles.signUpButtonText}>
                    {loading ? "Creating..." : "Sign Up"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </BlurView>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/signin")}>
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Snackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08080f",
  },
  backgroundImageStyle: {
    opacity: 0.5,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: "Outfit_700Bold",
    fontSize: 32,
    color: "#fff",
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.81)",
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: "Outfit_500Medium",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.75)",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontFamily: "Outfit_400Regular",
    fontSize: 16,
  },
  signUpButton: {
    borderRadius: 28,
    height: 56,
    overflow: "hidden",
    marginTop: 12,
  },
  signUpGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpButtonText: {
    fontFamily: "Outfit_500Medium",
    fontSize: 18,
    color: "#fff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    fontFamily: "Outfit_400Regular",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.60)",
  },
  signInText: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 16,
    color: "#c084fc",
  },
  errorText: {
    fontFamily: "Outfit_400Regular",
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
    marginLeft: 4,
  },
  inputWrapperError: {
    borderColor: "rgba(239, 68, 68, 0.4)",
    backgroundColor: "rgba(239, 68, 68, 0.03)",
  },
});
