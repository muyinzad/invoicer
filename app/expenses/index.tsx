import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Moon,
  Sun,
  Search,
  Filter,
  Plus,
  Receipt,
  Camera,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import NavigationMenu from "../components/NavigationMenu";
import { useTheme } from "../hooks/useTheme";

// Mock data for expenses
const mockExpenses = [
  {
    id: "1",
    category: "Office Supplies",
    amount: 125.5,
    date: "2023-10-15",
    vendor: "Office Depot",
    description: "Printer paper, ink cartridges, and pens",
    receiptImage: null,
  },
  {
    id: "2",
    category: "Travel",
    amount: 345.75,
    date: "2023-10-20",
    vendor: "Delta Airlines",
    description: "Flight to client meeting",
    receiptImage: null,
  },
  {
    id: "3",
    category: "Software",
    amount: 49.99,
    date: "2023-10-25",
    vendor: "Adobe",
    description: "Monthly subscription",
    receiptImage: null,
  },
  {
    id: "4",
    category: "Meals",
    amount: 78.25,
    date: "2023-10-30",
    vendor: "Restaurant",
    description: "Client lunch meeting",
    receiptImage: null,
  },
  {
    id: "5",
    category: "Equipment",
    amount: 899.99,
    date: "2023-11-05",
    vendor: "Apple",
    description: "iPad Pro for presentations",
    receiptImage: null,
  },
];

// Category colors for visual distinction
const categoryColors: Record<string, { bg: string; text: string }> = {
  "Office Supplies": { bg: "bg-blue-100", text: "text-blue-800" },
  Travel: { bg: "bg-purple-100", text: "text-purple-800" },
  Software: { bg: "bg-green-100", text: "text-green-800" },
  Meals: { bg: "bg-orange-100", text: "text-orange-800" },
  Equipment: { bg: "bg-red-100", text: "text-red-800" },
  Other: { bg: "bg-gray-100", text: "text-gray-800" },
};

export default function ExpensesScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, themeStyles } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState(mockExpenses);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredExpenses(mockExpenses);
    } else {
      const filtered = mockExpenses.filter(
        (expense) =>
          expense.description.toLowerCase().includes(text.toLowerCase()) ||
          expense.vendor.toLowerCase().includes(text.toLowerCase()) ||
          expense.category.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredExpenses(filtered);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const navigateToAddExpense = () => {
    router.push("/expenses/add");
  };

  const navigateToExpenseDetails = (expenseId: string) => {
    router.push(`/expenses/${expenseId}`);
  };

  const getCategoryStyle = (category: string) => {
    return categoryColors[category] || categoryColors["Other"];
  };

  // Calculate total expenses
  const totalExpenses = mockExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.backgroundColor}`}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <Text className={`text-2xl font-bold ${themeStyles.textColor}`}>
          Expenses
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
          <TextInput
            className="ml-2 flex-1 text-gray-800 dark:text-white"
            placeholder="Search expenses..."
            placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity
          className={`p-2 rounded-lg ${themeStyles.cardBgColor} ${themeStyles.borderColor} border`}
        >
          <Filter size={20} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
        </TouchableOpacity>
      </View>

      {/* Expense Summary */}
      <View className="px-4 py-3">
        <View
          className={`p-4 rounded-lg ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
        >
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            Total Expenses
          </Text>
          <Text className={`text-2xl font-bold ${themeStyles.textColor} mb-1`}>
            {formatCurrency(totalExpenses)}
          </Text>
          <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
            <View
              className="h-2 bg-teal-500 rounded-full"
              style={{
                width: `${Math.min(100, (totalExpenses / 10000) * 100)}%`,
              }}
            />
          </View>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {Math.round((totalExpenses / 10000) * 100)}% of monthly budget
          </Text>
        </View>
      </View>

      {/* Expenses List */}
      <FlatList
        data={filteredExpenses}
        className="px-4 pt-2 pb-20"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`p-4 mb-3 rounded-lg ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
            onPress={() => navigateToExpenseDetails(item.id)}
          >
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 items-center justify-center mr-3">
                  <Receipt
                    size={20}
                    color={isDarkMode ? "#5eead4" : "#0d9488"}
                  />
                </View>
                <View>
                  <Text className={`font-bold ${themeStyles.textColor}`}>
                    {item.vendor}
                  </Text>
                  <Text
                    className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
              <View>
                <Text
                  className={`font-bold ${themeStyles.textColor} text-right`}
                >
                  {formatCurrency(item.amount)}
                </Text>
                <View
                  className={`px-2 py-1 rounded-full mt-1 ${getCategoryStyle(item.category).bg}`}
                >
                  <Text
                    className={`text-xs font-medium ${getCategoryStyle(item.category).text}`}
                  >
                    {item.category}
                  </Text>
                </View>
              </View>
            </View>
            <Text
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {formatDate(item.date)}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-10">
            <Text className={themeStyles.textColor}>No expenses found</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-24 right-4 bg-teal-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={navigateToAddExpense}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Navigation Menu */}
      <NavigationMenu activeTab="expenses" />
    </SafeAreaView>
  );
}
