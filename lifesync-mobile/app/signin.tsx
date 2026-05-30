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
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { SocialIcon } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { authApi } from "../src/services/apiClient";
import Snackbar from "../src/components/Snackbar";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSignIn = async () => {
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
      await authApi.login(email.trim().toLowerCase(), password.trim());
      setLoading(false);
      router.push("/analytics");
    } catch (error: any) {
      setLoading(false);
      console.warn("[SIGNIN_ERROR]", error.message || error);
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
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue your journey</Text>
              </View>

              {/* Form Card */}
              <BlurView intensity={20} tint="dark" style={styles.glassCard}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={[
                    styles.inputWrapper,
                    emailError ? styles.inputWrapperError : null
                  ]}>
                    <Mail 
                      color={emailError ? "#ef4444" : "rgba(255,255,255,0.4)"} 
                      size={20} 
                      style={styles.inputIcon} 
                    />
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

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={[
                    styles.inputWrapper,
                    passwordError ? styles.inputWrapperError : null
                  ]}>
                    <Lock 
                      color={passwordError ? "#ef4444" : "rgba(255,255,255,0.4)"} 
                      size={20} 
                      style={styles.inputIcon} 
                    />
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

                <TouchableOpacity 
                  style={styles.forgotPassword}
                  onPress={() => router.push("/forgot-password")}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={handleSignIn}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#9900ff", "#9900ff"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.signInGradient}
                  >
                    <Text style={styles.signInButtonText}>
                      {loading ? "Signing In..." : "Sign In"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </BlurView>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Icons */}
              <View style={styles.socialRow}>
                <SocialIcon
                  type="google"
                  iconSize={24}
                  style={styles.socialButton}
                  iconColor="#fff"
                />
                <SocialIcon
                  type="apple"
                  iconSize={24}
                  style={styles.socialButton}
                  iconColor="#fff"
                />
                <SocialIcon
                  type="facebook"
                  iconSize={24}
                  style={styles.socialButton}
                  iconColor="#fff"
                />
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text style={styles.signUpText}>Sign Up</Text>
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
  backgroundImage: {
    flex: 1,
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
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontFamily: "Outfit_700Bold",
    fontSize: 40,
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Outfit_400Regular",
    fontSize: 16,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontFamily: "Outfit_500Medium",
    fontSize: 13,
    color: "#ffffffff",
  },
  signInButton: {
    borderRadius: 28,
    height: 56,
    overflow: "hidden",
  },
  signInGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  signInButtonText: {
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
  signUpText: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 16,
    color: "#c084fc",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  dividerText: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.60)",
    marginHorizontal: 16,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    margin: 0,
    padding: 0,
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
