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
import { Moon, Sun, Search, Filter, Plus, User } from "lucide-react-native";
import { useRouter } from "expo-router";
import NavigationMenu from "../components/NavigationMenu";
import { useTheme } from "../hooks/useTheme";

// Mock data for clients
const mockClients = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "(555) 123-4567",
    address: "123 Business Ave, Suite 100",
    totalBilled: 12500.0,
    outstandingAmount: 2500.0,
    lastInvoice: "2023-10-15",
  },
  {
    id: "2",
    name: "Globex Industries",
    email: "info@globex.com",
    phone: "(555) 987-6543",
    address: "456 Corporate Blvd",
    totalBilled: 8750.5,
    outstandingAmount: 0,
    lastInvoice: "2023-09-30",
  },
  {
    id: "3",
    name: "Wayne Enterprises",
    email: "business@wayne.com",
    phone: "(555) 555-5555",
    address: "1 Wayne Tower, Gotham City",
    totalBilled: 15000.0,
    outstandingAmount: 5000.0,
    lastInvoice: "2023-10-05",
  },
  {
    id: "4",
    name: "Stark Industries",
    email: "sales@stark.com",
    phone: "(555) 111-2222",
    address: "200 Park Avenue, New York",
    totalBilled: 22350.75,
    outstandingAmount: 0,
    lastInvoice: "2023-09-15",
  },
  {
    id: "5",
    name: "Umbrella Corporation",
    email: "contact@umbrella.com",
    phone: "(555) 333-4444",
    address: "987 Research Dr",
    totalBilled: 7800.25,
    outstandingAmount: 3200.0,
    lastInvoice: "2023-10-20",
  },
];

export default function ClientsScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, themeStyles } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState(mockClients);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredClients(mockClients);
    } else {
      const filtered = mockClients.filter(
        (client) =>
          client.name.toLowerCase().includes(text.toLowerCase()) ||
          client.email.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredClients(filtered);
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

  const navigateToAddClient = () => {
    router.push("/clients/add");
  };

  const navigateToClientDetails = (clientId: string) => {
    router.push(`/clients/${clientId}`);
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.backgroundColor}`}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <Text className={`text-2xl font-bold ${themeStyles.textColor}`}>
          Clients
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
            placeholder="Search clients..."
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

      {/* Client Stats Summary */}
      <View className="flex-row px-4 py-3 justify-between">
        <View
          className={`p-3 rounded-lg ${themeStyles.cardBgColor} flex-1 mr-2 border ${themeStyles.borderColor}`}
        >
          <Text className="text-gray-500 dark:text-gray-400 text-xs">
            Total Clients
          </Text>
          <Text className={`text-lg font-bold ${themeStyles.textColor}`}>
            {mockClients.length}
          </Text>
        </View>
        <View
          className={`p-3 rounded-lg ${themeStyles.cardBgColor} flex-1 mx-2 border ${themeStyles.borderColor}`}
        >
          <Text className="text-gray-500 dark:text-gray-400 text-xs">
            Active
          </Text>
          <Text className={`text-lg font-bold ${themeStyles.textColor}`}>
            {mockClients.filter((c) => c.outstandingAmount > 0).length}
          </Text>
        </View>
        <View
          className={`p-3 rounded-lg ${themeStyles.cardBgColor} flex-1 ml-2 border ${themeStyles.borderColor}`}
        >
          <Text className="text-gray-500 dark:text-gray-400 text-xs">
            Outstanding
          </Text>
          <Text className={`text-lg font-bold text-red-500`}>
            {formatCurrency(
              mockClients.reduce(
                (sum, client) => sum + client.outstandingAmount,
                0,
              ),
            )}
          </Text>
        </View>
      </View>

      {/* Clients List */}
      <FlatList
        data={filteredClients}
        className="px-4 pt-2 pb-20"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`p-4 mb-3 rounded-lg ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
            onPress={() => navigateToClientDetails(item.id)}
          >
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 items-center justify-center mr-3">
                  <User size={20} color={isDarkMode ? "#5eead4" : "#0d9488"} />
                </View>
                <View>
                  <Text className={`font-bold ${themeStyles.textColor}`}>
                    {item.name}
                  </Text>
                  <Text
                    className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {item.email}
                  </Text>
                </View>
              </View>
              <View>
                {item.outstandingAmount > 0 ? (
                  <View className="bg-red-100 px-2 py-1 rounded-full">
                    <Text className="text-xs font-medium text-red-800">
                      {formatCurrency(item.outstandingAmount)}
                    </Text>
                  </View>
                ) : (
                  <View className="bg-green-100 px-2 py-1 rounded-full">
                    <Text className="text-xs font-medium text-green-800">
                      Paid
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View className="flex-row justify-between items-center">
              <Text
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Last invoice: {formatDate(item.lastInvoice)}
              </Text>
              <Text className={`font-medium ${themeStyles.textColor}`}>
                {formatCurrency(item.totalBilled)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-10">
            <Text className={themeStyles.textColor}>No clients found</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-24 right-4 bg-teal-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={navigateToAddClient}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Navigation Menu */}
      <NavigationMenu activeTab="clients" />
    </SafeAreaView>
  );
}
