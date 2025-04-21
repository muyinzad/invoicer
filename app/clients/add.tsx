import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import NavigationMenu from "../components/NavigationMenu";
import { useTheme } from "../hooks/useTheme";

export default function AddClientScreen() {
  const router = useRouter();
  const { isDarkMode, themeStyles } = useTheme();

  // State for client data
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    sendReminders: true,
    paymentTerms: "30", // Default to 30 days
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setClientData({
      ...clientData,
      [field]: value,
    });
  };

  const saveClient = () => {
    // Here you would save the client to your database
    console.log("Saving client:", clientData);
    router.push("/clients");
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
            New Client
          </Text>
        </View>
        <TouchableOpacity
          onPress={saveClient}
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
          {/* Client Basic Info */}
          <View
            className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
          >
            <Text className={`font-bold mb-4 ${themeStyles.textColor}`}>
              Basic Information
            </Text>

            <View className="mb-4">
              <View className="flex-row items-center mb-1">
                <User size={16} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                <Text
                  className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Client Name
                </Text>
              </View>
              <TextInput
                placeholder="Enter client name"
                placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                value={clientData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
              />
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-1">
                <Mail size={16} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                <Text
                  className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Email Address
                </Text>
              </View>
              <TextInput
                placeholder="Enter email address"
                placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                value={clientData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
                className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
              />
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-1">
                <Phone size={16} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                <Text
                  className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Phone Number
                </Text>
              </View>
              <TextInput
                placeholder="Enter phone number"
                placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                value={clientData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                keyboardType="phone-pad"
                className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
              />
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-1">
                <MapPin size={16} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                <Text
                  className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Address
                </Text>
              </View>
              <TextInput
                placeholder="Enter address"
                placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                value={clientData.address}
                onChangeText={(text) => handleInputChange("address", text)}
                multiline
                numberOfLines={2}
                className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} min-h-[60px] textAlignVertical-top`}
              />
            </View>
          </View>

          {/* Billing Settings */}
          <View
            className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
          >
            <Text className={`font-bold mb-4 ${themeStyles.textColor}`}>
              Billing Settings
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
                  Payment Terms (Days)
                </Text>
              </View>
              <TextInput
                placeholder="30"
                placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                value={clientData.paymentTerms}
                onChangeText={(text) => handleInputChange("paymentTerms", text)}
                keyboardType="number-pad"
                className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
              />
            </View>

            <View className="flex-row justify-between items-center mb-4">
              <Text className={`${themeStyles.textColor}`}>
                Send Payment Reminders
              </Text>
              <Switch
                value={clientData.sendReminders}
                onValueChange={(value) =>
                  handleInputChange("sendReminders", value)
                }
                trackColor={{ false: "#d1d5db", true: "#14b8a6" }}
                thumbColor="#ffffff"
              />
            </View>
          </View>

          {/* Notes */}
          <View
            className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
          >
            <Text className={`font-bold mb-2 ${themeStyles.textColor}`}>
              Notes
            </Text>
            <TextInput
              placeholder="Add notes about this client"
              placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
              value={clientData.notes}
              onChangeText={(text) => handleInputChange("notes", text)}
              multiline
              numberOfLines={4}
              className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} min-h-[100px] textAlignVertical-top`}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Navigation Menu */}
      <NavigationMenu activeTab="clients" />
    </SafeAreaView>
  );
}
