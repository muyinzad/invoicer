import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Save,
  Camera,
  Receipt,
  DollarSign,
  Calendar,
  FileText,
  Tag,
  Store,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import NavigationMenu from "../components/NavigationMenu";
import { useTheme } from "../hooks/useTheme";

const CATEGORIES = [
  "Office Supplies",
  "Travel",
  "Software",
  "Meals",
  "Equipment",
  "Other",
];

export default function AddExpenseScreen() {
  const router = useRouter();
  const { isDarkMode, themeStyles } = useTheme();

  // State for expense data
  const [expenseData, setExpenseData] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    vendor: "",
    description: "",
    receiptImage: null,
  });

  const handleInputChange = (field: string, value: string) => {
    setExpenseData({
      ...expenseData,
      [field]: value,
    });
  };

  const saveExpense = () => {
    // Here you would save the expense to your database
    console.log("Saving expense:", expenseData);
    router.push("/expenses");
  };

  const takePhoto = () => {
    // This would use the camera to take a photo of a receipt
    console.log("Taking photo of receipt");
    // For demo purposes, we'll just set a placeholder
    setExpenseData({
      ...expenseData,
      receiptImage:
        "https://images.unsplash.com/photo-1572636583595-ebfe0f58e83e?w=400&q=80",
    });
  };

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
            New Expense
          </Text>
        </View>
        <TouchableOpacity
          onPress={saveExpense}
          className="bg-teal-600 px-4 py-2 rounded-lg flex-row items-center"
        >
          <Save size={18} color="#fff" />
          <Text className="text-white ml-1 font-medium">Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4 pb-24">
          {/* Receipt Image */}
          <View
            className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
          >
            <Text className={`font-bold mb-4 ${themeStyles.textColor}`}>
              Receipt Image
            </Text>

            {expenseData.receiptImage ? (
              <View className="mb-4">
                <Image
                  source={{ uri: expenseData.receiptImage }}
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={takePhoto}
                  className="absolute top-2 right-2 bg-teal-600 p-2 rounded-full"
                >
                  <Camera size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={takePhoto}
                className="h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg items-center justify-center mb-4"
              >
                <Camera size={32} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                <Text
                  className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Tap to take a photo of receipt
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Expense Details */}
          <View
            className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
          >
            <Text className={`font-bold mb-4 ${themeStyles.textColor}`}>
              Expense Details
            </Text>

            <View className="mb-4">
              <View className="flex-row items-center mb-1">
                <DollarSign
                  size={16}
                  color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                />
                <Text
                  className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Amount
                </Text>
              </View>
              <TextInput
                placeholder="0.00"
                placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                value={expenseData.amount}
                onChangeText={(text) => handleInputChange("amount", text)}
                keyboardType="decimal-pad"
                className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
              />
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-1">
                <Calendar
                  size={16}
                  color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                />
                <Text
                  className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Date
                </Text>
              </View>
              <TextInput
                placeholder="YYYY-MM-DD"
                placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                value={expenseData.date}
                onChangeText={(text) => handleInputChange("date", text)}
                className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
              />
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-1">
                <Store size={16} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                <Text
                  className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Vendor/Merchant
                </Text>
              </View>
              <TextInput
                placeholder="Enter vendor name"
                placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                value={expenseData.vendor}
                onChangeText={(text) => handleInputChange("vendor", text)}
                className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
              />
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-1">
                <FileText
                  size={16}
                  color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                />
                <Text
                  className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Description
                </Text>
              </View>
              <TextInput
                placeholder="Enter description"
                placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                value={expenseData.description}
                onChangeText={(text) => handleInputChange("description", text)}
                multiline
                numberOfLines={2}
                className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} min-h-[60px] textAlignVertical-top`}
              />
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-1">
                <Tag size={16} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                <Text
                  className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Category
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => handleInputChange("category", category)}
                    className={`px-3 py-2 rounded-lg ${expenseData.category === category ? "bg-teal-500" : isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
                  >
                    <Text
                      className={`${expenseData.category === category ? "text-white" : isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Navigation Menu */}
      <NavigationMenu activeTab="expenses" />
    </SafeAreaView>
  );
}
