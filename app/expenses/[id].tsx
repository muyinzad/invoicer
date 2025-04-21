import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  Store,
  Receipt,
} from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
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
    receiptImage:
      "https://images.unsplash.com/photo-1572636583595-ebfe0f58e83e?w=400&q=80",
    taxDeductible: true,
    paymentMethod: "Credit Card",
    project: "General Operations",
  },
  {
    id: "2",
    category: "Travel",
    amount: 345.75,
    date: "2023-10-20",
    vendor: "Delta Airlines",
    description: "Flight to client meeting",
    receiptImage:
      "https://images.unsplash.com/photo-1647427060118-4911c9821b82?w=400&q=80",
    taxDeductible: true,
    paymentMethod: "Company Card",
    project: "Client Project A",
  },
  {
    id: "3",
    category: "Software",
    amount: 49.99,
    date: "2023-10-25",
    vendor: "Adobe",
    description: "Monthly subscription",
    receiptImage: null,
    taxDeductible: true,
    paymentMethod: "Credit Card",
    project: "General Operations",
  },
  {
    id: "4",
    category: "Meals",
    amount: 78.25,
    date: "2023-10-30",
    vendor: "Restaurant",
    description: "Client lunch meeting",
    receiptImage:
      "https://images.unsplash.com/photo-1634921553115-1456f6857d2e?w=400&q=80",
    taxDeductible: true,
    paymentMethod: "Cash",
    project: "Client Project B",
  },
  {
    id: "5",
    category: "Equipment",
    amount: 899.99,
    date: "2023-11-05",
    vendor: "Apple",
    description: "iPad Pro for presentations",
    receiptImage:
      "https://images.unsplash.com/photo-1592500595497-d1f8c5a1c44e?w=400&q=80",
    taxDeductible: true,
    paymentMethod: "Company Card",
    project: "Office Equipment",
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

export default function ExpenseDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isDarkMode, themeStyles } = useTheme();
  const [expense, setExpense] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch expense details
    setTimeout(() => {
      const foundExpense = mockExpenses.find((e) => e.id === id);
      setExpense(foundExpense || null);
      setLoading(false);
    }, 500);
  }, [id]);

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

  const getCategoryStyle = (category: string) => {
    return categoryColors[category] || categoryColors["Other"];
  };

  const navigateToEditExpense = () => {
    router.push(`/expenses/edit/${id}`);
  };

  const deleteExpense = () => {
    // Logic to delete expense
    console.log("Deleting expense", id);
    router.push("/expenses");
  };

  if (loading) {
    return (
      <SafeAreaView
        className={`flex-1 ${themeStyles.backgroundColor} items-center justify-center`}
      >
        <ActivityIndicator size="large" color="#0d9488" />
        <Text className={`mt-4 ${themeStyles.textColor}`}>
          Loading expense details...
        </Text>
      </SafeAreaView>
    );
  }

  if (!expense) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.backgroundColor}`}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color={isDarkMode ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text className={`text-2xl font-bold ${themeStyles.textColor}`}>
            Expense Details
          </Text>
        </View>
        <View className="flex-1 items-center justify-center p-4">
          <Text className={`text-lg ${themeStyles.textColor} text-center`}>
            Expense not found
          </Text>
          <TouchableOpacity
            className="mt-4 bg-teal-600 px-4 py-2 rounded-lg"
            onPress={() => router.push("/expenses")}
          >
            <Text className="text-white font-medium">Back to Expenses</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.backgroundColor}`}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color={isDarkMode ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text className={`text-2xl font-bold ${themeStyles.textColor}`}>
            Expense Details
          </Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity
            onPress={navigateToEditExpense}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 mr-2"
          >
            <Edit2 size={20} color={isDarkMode ? "#fff" : "#000"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={deleteExpense}
            className="p-2 rounded-full bg-red-100 dark:bg-red-900"
          >
            <Trash2 size={20} color={isDarkMode ? "#ef4444" : "#dc2626"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pb-24">
        {/* Expense Summary Card */}
        <View
          className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
        >
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className={`text-xl font-bold ${themeStyles.textColor}`}>
                {expense.vendor}
              </Text>
              <View className="mt-1">
                <View
                  className={`self-start px-2 py-1 rounded-full ${getCategoryStyle(expense.category).bg}`}
                >
                  <Text
                    className={`text-xs font-medium ${getCategoryStyle(expense.category).text}`}
                  >
                    {expense.category}
                  </Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className={`font-bold text-xl ${themeStyles.textColor}`}>
                {formatCurrency(expense.amount)}
              </Text>
              <Text
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                {formatDate(expense.date)}
              </Text>
            </View>
          </View>

          <View className="mb-3">
            <Text className={`${themeStyles.textColor}`}>
              {expense.description}
            </Text>
          </View>

          {/* Receipt Image */}
          {expense.receiptImage && (
            <View className="mt-4 mb-2">
              <Text className={`font-bold mb-2 ${themeStyles.textColor}`}>
                Receipt
              </Text>
              <Image
                source={{ uri: expense.receiptImage }}
                className="w-full h-48 rounded-lg"
                resizeMode="cover"
              />
            </View>
          )}
        </View>

        {/* Additional Details */}
        <View
          className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
        >
          <Text className={`font-bold mb-3 ${themeStyles.textColor}`}>
            Additional Details
          </Text>
          <View className="flex-row items-center mb-3">
            <Calendar
              size={16}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              className="mr-2"
            />
            <Text
              className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mr-2`}
            >
              Date:
            </Text>
            <Text className={themeStyles.textColor}>
              {formatDate(expense.date)}
            </Text>
          </View>
          <View className="flex-row items-center mb-3">
            <Store
              size={16}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              className="mr-2"
            />
            <Text
              className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mr-2`}
            >
              Vendor:
            </Text>
            <Text className={themeStyles.textColor}>{expense.vendor}</Text>
          </View>
          <View className="flex-row items-center mb-3">
            <Tag
              size={16}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              className="mr-2"
            />
            <Text
              className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mr-2`}
            >
              Category:
            </Text>
            <Text className={themeStyles.textColor}>{expense.category}</Text>
          </View>
          <View className="flex-row items-center mb-3">
            <DollarSign
              size={16}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              className="mr-2"
            />
            <Text
              className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mr-2`}
            >
              Amount:
            </Text>
            <Text className={themeStyles.textColor}>
              {formatCurrency(expense.amount)}
            </Text>
          </View>
          <View className="flex-row items-start mb-3">
            <FileText
              size={16}
              color={isDarkMode ? "#9CA3AF" : "#6B7280"}
              className="mr-2 mt-1"
            />
            <Text
              className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mr-2`}
            >
              Description:
            </Text>
            <Text className={`${themeStyles.textColor} flex-1`}>
              {expense.description}
            </Text>
          </View>
        </View>

        {/* Tax & Payment Info */}
        <View
          className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
        >
          <Text className={`font-bold mb-3 ${themeStyles.textColor}`}>
            Tax & Payment Information
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Tax Deductible
            </Text>
            <Text className={themeStyles.textColor}>
              {expense.taxDeductible ? "Yes" : "No"}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Payment Method
            </Text>
            <Text className={themeStyles.textColor}>
              {expense.paymentMethod}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Project
            </Text>
            <Text className={themeStyles.textColor}>{expense.project}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Menu */}
      <NavigationMenu activeTab="expenses" />
    </SafeAreaView>
  );
}
