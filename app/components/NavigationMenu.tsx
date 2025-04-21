import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import {
  Home,
  FileText,
  Users,
  Receipt,
  Plus,
  Settings,
} from "lucide-react-native";

interface NavigationMenuProps {
  activeTab?: "dashboard" | "invoices" | "clients" | "expenses" | "settings";
}

const NavigationMenu = ({ activeTab = "dashboard" }: NavigationMenuProps) => {
  const router = useRouter();

  const navigateTo = (route: string) => {
    router.push(route);
  };

  return (
    <View className="bg-white dark:bg-gray-900 h-20 w-full flex-row items-center justify-between px-4 border-t border-gray-200 dark:border-gray-800">
      {/* Dashboard Tab */}
      <TouchableOpacity
        className={`items-center ${activeTab === "dashboard" ? "opacity-100" : "opacity-60"}`}
        onPress={() => navigateTo("/")}
      >
        <Home
          size={24}
          color={activeTab === "dashboard" ? "#0D9488" : "#9CA3AF"}
        />
        <Text
          className={`text-xs mt-1 ${activeTab === "dashboard" ? "text-teal-600 dark:text-teal-500" : "text-gray-500 dark:text-gray-400"}`}
        >
          Dashboard
        </Text>
      </TouchableOpacity>

      {/* Invoices Tab */}
      <TouchableOpacity
        className={`items-center ${activeTab === "invoices" ? "opacity-100" : "opacity-60"}`}
        onPress={() => navigateTo("/invoices")}
      >
        <FileText
          size={24}
          color={activeTab === "invoices" ? "#0D9488" : "#9CA3AF"}
        />
        <Text
          className={`text-xs mt-1 ${activeTab === "invoices" ? "text-teal-600 dark:text-teal-500" : "text-gray-500 dark:text-gray-400"}`}
        >
          Invoices
        </Text>
      </TouchableOpacity>

      {/* Create Invoice Button (Center) */}
      <TouchableOpacity
        className="bg-teal-600 w-14 h-14 rounded-full items-center justify-center -mt-6 shadow-lg"
        onPress={() => navigateTo("/create-invoice")}
      >
        <Plus size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Clients Tab */}
      <TouchableOpacity
        className={`items-center ${activeTab === "clients" ? "opacity-100" : "opacity-60"}`}
        onPress={() => navigateTo("/clients")}
      >
        <Users
          size={24}
          color={activeTab === "clients" ? "#0D9488" : "#9CA3AF"}
        />
        <Text
          className={`text-xs mt-1 ${activeTab === "clients" ? "text-teal-600 dark:text-teal-500" : "text-gray-500 dark:text-gray-400"}`}
        >
          Clients
        </Text>
      </TouchableOpacity>

      {/* Expenses Tab */}
      <TouchableOpacity
        className={`items-center ${activeTab === "expenses" ? "opacity-100" : "opacity-60"}`}
        onPress={() => navigateTo("/expenses")}
      >
        <Receipt
          size={24}
          color={activeTab === "expenses" ? "#0D9488" : "#9CA3AF"}
        />
        <Text
          className={`text-xs mt-1 ${activeTab === "expenses" ? "text-teal-600 dark:text-teal-500" : "text-gray-500 dark:text-gray-400"}`}
        >
          Expenses
        </Text>
      </TouchableOpacity>

      {/* Settings Tab */}
      <TouchableOpacity
        className={`items-center ${activeTab === "settings" ? "opacity-100" : "opacity-60"}`}
        onPress={() => navigateTo("/settings")}
      >
        <Settings
          size={24}
          color={activeTab === "settings" ? "#0D9488" : "#9CA3AF"}
        />
        <Text
          className={`text-xs mt-1 ${activeTab === "settings" ? "text-teal-600 dark:text-teal-500" : "text-gray-500 dark:text-gray-400"}`}
        >
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NavigationMenu;
