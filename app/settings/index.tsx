import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  Linking,
} from "react-native";
import { useTheme } from "../hooks/useTheme";
import {
  Settings,
  ChevronRight,
  Image as ImageIcon,
  Mail,
  Shield,
  HelpCircle,
  Languages,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationMenu from "../components/NavigationMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = () => {
  const { isDarkMode, toggleTheme, themeStyles } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAppIcon, setCurrentAppIcon] = useState("default");
  const [iconModalVisible, setIconModalVisible] = useState(false);
  const [language, setLanguage] = useState("English");
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Load settings from AsyncStorage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [notifValue, iconValue, langValue, bioValue] = await Promise.all([
          AsyncStorage.getItem("notificationsEnabled"),
          AsyncStorage.getItem("appIcon"),
          AsyncStorage.getItem("language"),
          AsyncStorage.getItem("biometricEnabled"),
        ]);

        if (notifValue !== null) {
          setNotificationsEnabled(notifValue === "true");
        }

        if (iconValue !== null) {
          setCurrentAppIcon(iconValue);
        }

        if (langValue !== null) {
          setLanguage(langValue);
        }

        if (bioValue !== null) {
          setBiometricEnabled(bioValue === "true");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading settings:", error);
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);

    try {
      await AsyncStorage.setItem("notificationsEnabled", newValue.toString());
    } catch (error) {
      console.error("Error saving notification settings:", error);
      Alert.alert("Error", "Failed to save notification settings");
      // Revert the state if saving fails
      setNotificationsEnabled(!newValue);
    }
  };

  const toggleBiometric = async () => {
    const newValue = !biometricEnabled;
    setBiometricEnabled(newValue);

    try {
      await AsyncStorage.setItem("biometricEnabled", newValue.toString());
      if (newValue) {
        // In a real app, we would request biometric permission here
        Alert.alert(
          "Biometric Authentication",
          "In a real app, this would enable Face ID/Touch ID/Fingerprint login. For this demo, we've saved your preference.",
        );
      }
    } catch (error) {
      console.error("Error saving biometric settings:", error);
      Alert.alert("Error", "Failed to save biometric settings");
      // Revert the state if saving fails
      setBiometricEnabled(!newValue);
    }
  };

  const changeLanguage = async (newLanguage) => {
    setLanguage(newLanguage);

    try {
      await AsyncStorage.setItem("language", newLanguage);
      Alert.alert(
        "Language Changed",
        `Language has been changed to ${newLanguage}. In a real app, this would update all text throughout the application.`,
      );
    } catch (error) {
      console.error("Error saving language settings:", error);
      Alert.alert("Error", "Failed to save language settings");
    }
  };

  const contactSupport = () => {
    Linking.openURL(
      "mailto:support@invoiceapp.com?subject=Support%20Request&body=Hello,%20I%20need%20assistance%20with%20the%20Invoice%20App.",
    );
  };

  const openHelpCenter = () => {
    Linking.openURL("https://example.com/help-center");
  };

  const changeAppIcon = async (iconName) => {
    try {
      // In a real app, we would use a native module to change the app icon
      // For this demo, we'll just save the preference
      await AsyncStorage.setItem("appIcon", iconName);
      setCurrentAppIcon(iconName);
      setIconModalVisible(false);

      // PLATFORM-SPECIFIC IMPLEMENTATION NOTES:
      //
      // iOS Implementation:
      // 1. Configure alternate icons in Info.plist with CFBundleIcons and CFBundleAlternateIcons
      // 2. Use the UIApplication.shared.setAlternateIconName method via native module
      // 3. Example native module implementation would expose:
      //    RNAppIconChanger.setAppIcon(iconName, (error) => { handle error })
      //
      // Android Implementation:
      // 1. Create Activity Aliases in AndroidManifest.xml for each icon variant
      // 2. Each alias would point to MainActivity but with different android:icon values
      // 3. Use PackageManager to enable/disable specific Activity Aliases via native module
      // 4. Requires app restart on Android to apply changes
      //
      // Cross-Platform Package:
      // Could use a library like 'react-native-dynamic-app-icon' which handles
      // the platform-specific implementations behind a unified JS API

      // Show a message to the user
      Alert.alert(
        "App Icon",
        "In a real app, this would change your app icon. For this demo, we've saved your preference.",
        [{ text: "OK" }],
      );
    } catch (error) {
      console.error("Error changing app icon:", error);
      Alert.alert("Error", "Failed to change app icon");
    }
  };

  const openIconSelector = () => {
    setIconModalVisible(true);
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.backgroundColor}`}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View className="flex-1 px-4 pt-4 pb-20">
        <View className="flex-row items-center mb-6">
          <Settings size={24} color={isDarkMode ? "#FFFFFF" : "#0D9488"} />
          <Text className={`text-2xl font-bold ml-2 ${themeStyles.textColor}`}>
            Settings
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Appearance Section */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-2 ${themeStyles.textColor}`}
            >
              Appearance
            </Text>
            <View
              className={`rounded-lg ${themeStyles.cardBgColor} ${themeStyles.borderColor} border p-4`}
            >
              <View className="flex-row justify-between items-center">
                <Text className={themeStyles.textColor}>Dark Mode</Text>
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  trackColor={{ false: "#767577", true: "#0D9488" }}
                  thumbColor={"#f4f3f4"}
                />
              </View>
            </View>
          </View>

          {/* Notifications Section */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-2 ${themeStyles.textColor}`}
            >
              Notifications
            </Text>
            <View
              className={`rounded-lg ${themeStyles.cardBgColor} ${themeStyles.borderColor} border p-4`}
            >
              <View className="flex-row justify-between items-center">
                <Text className={themeStyles.textColor}>
                  Enable Notifications
                </Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={toggleNotifications}
                  trackColor={{ false: "#767577", true: "#0D9488" }}
                  thumbColor={"#f4f3f4"}
                />
              </View>
            </View>
          </View>

          {/* Appearance Section - App Icon */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-2 ${themeStyles.textColor}`}
            >
              App Icon
            </Text>
            <TouchableOpacity
              onPress={openIconSelector}
              className={`rounded-lg ${themeStyles.cardBgColor} ${themeStyles.borderColor} border p-4`}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <ImageIcon
                    size={20}
                    color={isDarkMode ? "#FFFFFF" : "#0D9488"}
                  />
                  <Text className={`ml-2 ${themeStyles.textColor}`}>
                    Change App Icon
                  </Text>
                </View>
                <ChevronRight
                  size={20}
                  color={isDarkMode ? "#FFFFFF" : "#0D9488"}
                />
              </View>
              <Text className="text-gray-500 dark:text-gray-400 mt-1">
                Current:{" "}
                {currentAppIcon === "default"
                  ? "Default"
                  : currentAppIcon.charAt(0).toUpperCase() +
                    currentAppIcon.slice(1)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Security Section */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-2 ${themeStyles.textColor}`}
            >
              Security
            </Text>
            <View
              className={`rounded-lg ${themeStyles.cardBgColor} ${themeStyles.borderColor} border p-4`}
            >
              <View className="flex-row justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <View className="flex-row items-center">
                  <Shield
                    size={20}
                    color={isDarkMode ? "#FFFFFF" : "#0D9488"}
                  />
                  <Text className={`ml-2 ${themeStyles.textColor}`}>
                    Biometric Authentication
                  </Text>
                </View>
                <Switch
                  value={biometricEnabled}
                  onValueChange={toggleBiometric}
                  trackColor={{ false: "#767577", true: "#0D9488" }}
                  thumbColor={"#f4f3f4"}
                />
              </View>
              <Text className="text-gray-500 dark:text-gray-400 mt-1 ml-7">
                Use Face ID/Touch ID to log in
              </Text>
            </View>
          </View>

          {/* Language Section */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-2 ${themeStyles.textColor}`}
            >
              Language
            </Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Select Language",
                  "Choose your preferred language",
                  [
                    {
                      text: "English",
                      onPress: () => changeLanguage("English"),
                    },
                    {
                      text: "Spanish",
                      onPress: () => changeLanguage("Spanish"),
                    },
                    { text: "French", onPress: () => changeLanguage("French") },
                    { text: "Cancel", style: "cancel" },
                  ],
                )
              }
              className={`rounded-lg ${themeStyles.cardBgColor} ${themeStyles.borderColor} border p-4`}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Languages
                    size={20}
                    color={isDarkMode ? "#FFFFFF" : "#0D9488"}
                  />
                  <Text className={`ml-2 ${themeStyles.textColor}`}>
                    App Language
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-gray-500 dark:text-gray-400 mr-2">
                    {language}
                  </Text>
                  <ChevronRight
                    size={20}
                    color={isDarkMode ? "#FFFFFF" : "#0D9488"}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Help & Support Section */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-2 ${themeStyles.textColor}`}
            >
              Help & Support
            </Text>
            <View
              className={`rounded-lg ${themeStyles.cardBgColor} ${themeStyles.borderColor} border p-4`}
            >
              <TouchableOpacity
                onPress={contactSupport}
                className="flex-row justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700"
              >
                <View className="flex-row items-center">
                  <Mail size={20} color={isDarkMode ? "#FFFFFF" : "#0D9488"} />
                  <Text className={`ml-2 ${themeStyles.textColor}`}>
                    Contact Support
                  </Text>
                </View>
                <ChevronRight
                  size={20}
                  color={isDarkMode ? "#FFFFFF" : "#0D9488"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={openHelpCenter}
                className="flex-row justify-between items-center py-2"
              >
                <View className="flex-row items-center">
                  <HelpCircle
                    size={20}
                    color={isDarkMode ? "#FFFFFF" : "#0D9488"}
                  />
                  <Text className={`ml-2 ${themeStyles.textColor}`}>
                    Help Center
                  </Text>
                </View>
                <ChevronRight
                  size={20}
                  color={isDarkMode ? "#FFFFFF" : "#0D9488"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* About Section */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-2 ${themeStyles.textColor}`}
            >
              About
            </Text>
            <View
              className={`rounded-lg ${themeStyles.cardBgColor} ${themeStyles.borderColor} border p-4`}
            >
              <View className="py-2 border-b border-gray-200 dark:border-gray-700">
                <Text className={themeStyles.textColor}>Version</Text>
                <Text className="text-gray-500 dark:text-gray-400">1.0.0</Text>
              </View>
              <View className="py-2">
                <Text className={themeStyles.textColor}>Build</Text>
                <Text className="text-gray-500 dark:text-gray-400">100</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* App Icon Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={iconModalVisible}
        onRequestClose={() => setIconModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View
            className={`w-4/5 rounded-xl p-5 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <Text className={`text-xl font-bold mb-4 ${themeStyles.textColor}`}>
              Select App Icon
            </Text>

            <View className="flex-row flex-wrap justify-between mb-4">
              <TouchableOpacity
                className={`w-[30%] p-2 rounded-lg mb-3 ${currentAppIcon === "default" ? (isDarkMode ? "bg-gray-700" : "bg-gray-200") : ""}`}
                onPress={() => changeAppIcon("default")}
              >
                <Image
                  source={require("../../assets/images/icon.png")}
                  className="w-16 h-16 self-center rounded-xl"
                />
                <Text className={`text-center mt-1 ${themeStyles.textColor}`}>
                  Default
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`w-[30%] p-2 rounded-lg mb-3 ${currentAppIcon === "dark" ? (isDarkMode ? "bg-gray-700" : "bg-gray-200") : ""}`}
                onPress={() => changeAppIcon("dark")}
              >
                <View className="w-16 h-16 self-center rounded-xl bg-gray-800 justify-center items-center">
                  <Text className="text-white text-2xl font-bold">INV</Text>
                </View>
                <Text className={`text-center mt-1 ${themeStyles.textColor}`}>
                  Dark
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`w-[30%] p-2 rounded-lg mb-3 ${currentAppIcon === "teal" ? (isDarkMode ? "bg-gray-700" : "bg-gray-200") : ""}`}
                onPress={() => changeAppIcon("teal")}
              >
                <View className="w-16 h-16 self-center rounded-xl bg-teal-500 justify-center items-center">
                  <Text className="text-white text-2xl font-bold">INV</Text>
                </View>
                <Text className={`text-center mt-1 ${themeStyles.textColor}`}>
                  Teal
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-teal-600 py-2 px-4 rounded-lg self-center mt-2"
              onPress={() => setIconModalVisible(false)}
            >
              <Text className="text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <NavigationMenu />
    </SafeAreaView>
  );
};

export default SettingsScreen;
