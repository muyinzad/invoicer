import React from "react";
import { View, Text, Switch, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Settings, ChevronRight } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationMenu from "../components/NavigationMenu";

const SettingsScreen = () => {
  const { isDarkMode, toggleTheme, themeStyles } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // In a real app, you would save this preference to AsyncStorage or similar
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

      <NavigationMenu />
    </SafeAreaView>
  );
};

export default SettingsScreen;
