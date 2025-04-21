import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Moon, Sun, Search, Filter, Plus } from "lucide-react-native";
import NavigationMenu from "../components/NavigationMenu";
import { useTheme } from "../hooks/useTheme";

// Mock data for invoices
const mockInvoices = [
  {
    id: "INV-001",
    client: "Acme Corp",
    amount: 1250.0,
    date: "2023-10-15",
    status: "paid",
  },
  {
    id: "INV-002",
    client: "Globex Inc",
    amount: 3450.75,
    date: "2023-10-20",
    status: "pending",
  },
  {
    id: "INV-003",
    client: "Stark Industries",
    amount: 7800.5,
    date: "2023-10-25",
    status: "overdue",
  },
  {
    id: "INV-004",
    client: "Wayne Enterprises",
    amount: 5200.25,
    date: "2023-10-30",
    status: "draft",
  },
  {
    id: "INV-005",
    client: "Oscorp",
    amount: 1800.0,
    date: "2023-11-05",
    status: "pending",
  },
];

export default function InvoicesScreen() {
  const { isDarkMode, toggleTheme, themeStyles } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.backgroundColor}`}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <Text className={`text-2xl font-bold ${themeStyles.textColor}`}>
          Invoices
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

      {/* Search and Filter */}
      <View className="flex-row px-4 py-2 gap-2">
        <View
          className={`flex-1 flex-row items-center px-3 py-2 rounded-lg ${themeStyles.cardBgColor} ${themeStyles.borderColor} border`}
        >
          <Search size={18} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
          <Text className="ml-2 text-gray-400">Search invoices...</Text>
        </View>
        <TouchableOpacity
          className={`p-2 rounded-lg ${themeStyles.cardBgColor} ${themeStyles.borderColor} border`}
        >
          <Filter size={20} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
        </TouchableOpacity>
      </View>

      {/* Invoices List */}
      <FlatList
        data={mockInvoices}
        className="px-4 pt-2 pb-20"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`p-4 mb-3 rounded-lg ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className={`font-bold ${themeStyles.textColor}`}>
                {item.id}
              </Text>
              <View
                className={`px-2 py-1 rounded-full ${getStatusColor(item.status)}`}
              >
                <Text className="text-xs font-medium capitalize">
                  {item.status}
                </Text>
              </View>
            </View>
            <Text
              className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {item.client}
            </Text>
            <View className="flex-row justify-between items-center">
              <Text className={`font-bold ${themeStyles.textColor}`}>
                {formatCurrency(item.amount)}
              </Text>
              <Text
                className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {formatDate(item.date)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-10">
            <Text className={themeStyles.textColor}>No invoices found</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-24 right-4 bg-teal-600 w-14 h-14 rounded-full items-center justify-center shadow-lg">
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Navigation Menu */}
      <NavigationMenu activeTab="invoices" />
    </SafeAreaView>
  );
}
