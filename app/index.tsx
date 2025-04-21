import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Moon, Sun } from "lucide-react-native";
import DashboardSummary from "./components/DashboardSummary";
import InvoiceList from "./components/InvoiceList";
import NavigationMenu from "./components/NavigationMenu";
import InvoiceCreator from "./components/InvoiceCreator";
import { useTheme } from "./hooks/useTheme";

export default function Dashboard() {
  const { isDarkMode, toggleTheme, themeStyles } = useTheme();
  const [showInvoiceCreator, setShowInvoiceCreator] = useState(false);

  const handleCreateInvoice = () => {
    setShowInvoiceCreator(true);
  };

  const handleCloseInvoiceCreator = () => {
    setShowInvoiceCreator(false);
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.backgroundColor}`}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <Text className={`text-2xl font-bold ${themeStyles.textColor}`}>
          InvoiceApp
        </Text>
        <TouchableOpacity
          onPress={toggleTheme}
          className={`p-2 rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}
        >
          {isDarkMode ? (
            <Sun size={24} color="#fff" />
          ) : (
            <Moon size={24} color="#000" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Dashboard Summary Component */}
        <DashboardSummary isDarkMode={isDarkMode} />
        {/* Recent Invoices Section */}
        <View className="px-4 mt-4">
          <Text
            className={`text-xl font-semibold mb-2 ${themeStyles.textColor}`}
          >
            Recent Invoices
          </Text>
          <InvoiceList isDarkMode={isDarkMode} />
        </View>
        {/* Add more sections as needed */}
        <View className="h-20" /> {/* Spacer for bottom navigation */}
      </ScrollView>

      {/* Navigation Menu */}
      <NavigationMenu activeTab="dashboard" />

      {/* Invoice Creator Modal */}
      {showInvoiceCreator && (
        <InvoiceCreator
          isDarkMode={isDarkMode}
          onClose={handleCloseInvoiceCreator}
        />
      )}
    </SafeAreaView>
  );
}
