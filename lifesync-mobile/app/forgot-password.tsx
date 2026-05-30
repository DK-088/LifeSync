import React, { useState, useRef } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, KeyRound } from "lucide-react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { apiRequest } from "../src/services/apiClient";
import Snackbar from "../src/components/Snackbar";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("screen");

type Step = "request" | "verify" | "reset";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  
  // Wizard steps state
  const [step, setStep] = useState<Step>("request");
  
  // Input fields state
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  
  // OTP code boxes state (6 digits)
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputRefs = useRef<TextInput[]>([]);

  // Password fields state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // Snackbar states
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error" | "info">("info");

  const showSnackbar = (message: string, type: "success" | "error" | "info" = "info") => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  // Real-time email validation
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

  // Real-time password validation
  const validatePassword = (val: string) => {
    setNewPassword(val);
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

  // Step 1: Send OTP request
  const handleSendOTP = async () => {
    if (!email.trim() || emailError) {
      showSnackbar("Please enter a valid email address.", "error");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setLoading(false);
      showSnackbar("Verification code sent to your email!", "success");
      setStep("verify");
    } catch (error: any) {
      setLoading(false);
      console.warn("[FORGOT_PASSWORD_ERROR]", error);
      showSnackbar(error.message || "Failed to send verification code.", "error");
    }
  };

  // Step 2: Handle OTP code changes
  const handleOtpChange = (text: string, index: number) => {
    const cleanText = text.replace(/[^0-9]/g, ""); // Allow digits only
    const newOtp = [...otp];
    newOtp[index] = cleanText;
    setOtp(newOtp);

    // Auto-focus next input box on typing
    if (cleanText && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    // Auto-focus previous input box on backspace
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      showSnackbar("Please enter all 6 digits of the code.", "error");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: fullOtp,
        }),
      });
      setLoading(false);
      showSnackbar("OTP verified successfully!", "success");
      setStep("reset");
    } catch (error: any) {
      setLoading(false);
      console.warn("[VERIFY_OTP_ERROR]", error);
      showSnackbar(error.message || "Invalid or expired verification code.", "error");
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (newPassword.length < 8 || passwordError) {
      showSnackbar("Password must be at least 8 characters.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showSnackbar("Passwords do not match.", "error");
      return;
    }

    setLoading(true);
    try {
      const fullOtp = otp.join("");
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: fullOtp,
          password: newPassword.trim(),
        }),
      });
      setLoading(false);
      showSnackbar("Password reset successfully! Redirecting...", "success");

      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    } catch (error: any) {
      setLoading(false);
      console.warn("[RESET_PASSWORD_ERROR]", error);
      showSnackbar(error.message || "Failed to reset password. Please try again.", "error");
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
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => {
                if (step === "verify") setStep("request");
                else if (step === "reset") setStep("verify");
                else router.back();
              }}
              style={styles.backButton}
            >
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>

            {/* Header Titles */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {step === "request" && "Reset Password"}
                {step === "verify" && "Enter Code"}
                {step === "reset" && "New Password"}
              </Text>
              <Text style={styles.subtitle}>
                {step === "request" && "Enter your email address to receive a 6-digit verification code"}
                {step === "verify" && `We sent a verification code to ${email}`}
                {step === "reset" && "Create a secure new password for your account"}
              </Text>
            </View>

            {/* Glassmorphic Form Card */}
            <BlurView intensity={35} tint="dark" style={styles.glassCard}>
              
              {/* STEP 1: REQUEST OTP */}
              {step === "request" && (
                <View>
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

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleSendOTP}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#9900ff", "#9900ff"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? "Sending..." : "Send Verification Code"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 2: VERIFY OTP (6-Digit Boxes) */}
              {step === "verify" && (
                <View>
                  <Text style={styles.inputLabel}>Verification Code</Text>
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          if (ref) otpInputRefs.current[index] = ref;
                        }}
                        style={styles.otpInput}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                        placeholder="0"
                        placeholderTextColor="rgba(255,255,255,0.15)"
                        textAlign="center"
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleVerifyOTP}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#9900ff", "#9900ff"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? "Verifying..." : "Verify Code"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>Didn't receive code? </Text>
                    <TouchableOpacity onPress={handleSendOTP} disabled={loading}>
                      <Text style={styles.resendLink}>Resend</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* STEP 3: RESET PASSWORD */}
              {step === "reset" && (
                <View>
                  {/* New Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>New Password</Text>
                    <View style={[
                      styles.inputWrapper,
                      passwordError ? styles.inputWrapperError : null
                    ]}>
                      <Lock color={passwordError ? "#ef4444" : "rgba(255,255,255,0.4)"} size={20} style={styles.inputIcon} />
                      <TextInput
                        placeholder="Enter your new password"
                        placeholderTextColor="rgba(255, 255, 255, 0.53)"
                        style={styles.input}
                        value={newPassword}
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

                  {/* Confirm Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <View style={styles.inputWrapper}>
                      <Lock color="rgba(255,255,255,0.4)" size={20} style={styles.inputIcon} />
                      <TextInput
                        placeholder="Confirm your new password"
                        placeholderTextColor="rgba(255, 255, 255, 0.53)"
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                      />
                      <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? (
                          <EyeOff color="rgba(255,255,255,0.4)" size={20} />
                        ) : (
                          <Eye color="rgba(255,255,255,0.4)" size={20} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleResetPassword}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#9900ff", "#9900ff"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? "Resetting..." : "Reset Password"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

            </BlurView>
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
    lineHeight: 20,
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
  inputWrapperError: {
    borderColor: "rgba(239, 68, 68, 0.4)",
    backgroundColor: "rgba(239, 68, 68, 0.03)",
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
  errorText: {
    fontFamily: "Outfit_400Regular",
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
    marginLeft: 4,
  },
  actionButton: {
    borderRadius: 28,
    height: 56,
    overflow: "hidden",
    marginTop: 12,
  },
  buttonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Outfit_500Medium",
    fontSize: 18,
    color: "#fff",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    marginTop: 8,
  },
  otpInput: {
    width: 44,
    height: 54,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    color: "#fff",
    fontSize: 22,
    fontFamily: "Outfit_600SemiBold",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  resendText: {
    fontFamily: "Outfit_400Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.45)",
  },
  resendLink: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 14,
    color: "#c084fc",
  },
});
