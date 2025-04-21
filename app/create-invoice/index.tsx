import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react-native";
import { useRouter } from "expo-router";
import NavigationMenu from "../components/NavigationMenu";
import { useTheme } from "../hooks/useTheme";

export default function CreateInvoiceScreen() {
  const router = useRouter();
  const { isDarkMode, themeStyles } = useTheme();

  // State for invoice data
  const [invoiceData, setInvoiceData] = useState({
    client: "",
    invoiceNumber: "INV-" + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    items: [{ id: 1, description: "", quantity: 1, rate: 0, amount: 0 }],
    notes: "",
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  // Add new line item
  const addLineItem = () => {
    const newItem = {
      id: invoiceData.items.length + 1,
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, newItem],
    });
  };

  // Remove line item
  const removeLineItem = (id: number) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData({
        ...invoiceData,
        items: invoiceData.items.filter((item) => item.id !== id),
      });
    }
  };

  // Update line item
  const updateLineItem = (
    id: number,
    field: string,
    value: string | number,
  ) => {
    const updatedItems = invoiceData.items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Recalculate amount if quantity or rate changes
        if (field === "quantity" || field === "rate") {
          const quantity = field === "quantity" ? Number(value) : item.quantity;
          const rate = field === "rate" ? Number(value) : item.rate;
          updatedItem.amount = quantity * rate;
        }

        return updatedItem;
      }
      return item;
    });

    // Calculate subtotal and total
    const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.1; // 10% tax rate

    setInvoiceData({
      ...invoiceData,
      items: updatedItems,
      subtotal,
      tax,
      total: subtotal + tax,
    });
  };

  // Save invoice
  const saveInvoice = () => {
    // Here you would save the invoice to your database
    console.log("Saving invoice:", invoiceData);
    router.push("/invoices");
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
            New Invoice
          </Text>
        </View>
        <TouchableOpacity
          onPress={saveInvoice}
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
          {/* Client and Invoice Info */}
          <View
            className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
          >
            <Text className={`font-bold mb-2 ${themeStyles.textColor}`}>
              Client Information
            </Text>
            <TextInput
              placeholder="Client Name or Business"
              placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
              value={invoiceData.client}
              onChangeText={(text) =>
                setInvoiceData({ ...invoiceData, client: text })
              }
              className={`p-3 rounded-lg mb-3 ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
            />

            <View className="flex-row justify-between mb-3">
              <View className="flex-1 mr-2">
                <Text
                  className={`text-sm mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Invoice #
                </Text>
                <TextInput
                  value={invoiceData.invoiceNumber}
                  onChangeText={(text) =>
                    setInvoiceData({ ...invoiceData, invoiceNumber: text })
                  }
                  className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                />
              </View>
              <View className="flex-1 ml-2">
                <Text
                  className={`text-sm mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  Date
                </Text>
                <TextInput
                  value={invoiceData.date}
                  onChangeText={(text) =>
                    setInvoiceData({ ...invoiceData, date: text })
                  }
                  className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                />
              </View>
            </View>

            <Text
              className={`text-sm mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Due Date
            </Text>
            <TextInput
              value={invoiceData.dueDate}
              onChangeText={(text) =>
                setInvoiceData({ ...invoiceData, dueDate: text })
              }
              className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
            />
          </View>

          {/* Line Items */}
          <View
            className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
          >
            <Text className={`font-bold mb-3 ${themeStyles.textColor}`}>
              Items
            </Text>

            {invoiceData.items.map((item, index) => (
              <View
                key={item.id}
                className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className={`font-medium ${themeStyles.textColor}`}>
                    Item #{index + 1}
                  </Text>
                  <TouchableOpacity onPress={() => removeLineItem(item.id)}>
                    <Trash2
                      size={18}
                      color={isDarkMode ? "#EF4444" : "#DC2626"}
                    />
                  </TouchableOpacity>
                </View>

                <TextInput
                  placeholder="Description"
                  placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  value={item.description}
                  onChangeText={(text) =>
                    updateLineItem(item.id, "description", text)
                  }
                  className={`p-3 rounded-lg mb-2 ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                />

                <View className="flex-row justify-between">
                  <View className="flex-1 mr-2">
                    <Text
                      className={`text-sm mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Quantity
                    </Text>
                    <TextInput
                      keyboardType="numeric"
                      value={item.quantity.toString()}
                      onChangeText={(text) =>
                        updateLineItem(
                          item.id,
                          "quantity",
                          parseFloat(text) || 0,
                        )
                      }
                      className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                    />
                  </View>
                  <View className="flex-1 mx-2">
                    <Text
                      className={`text-sm mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Rate
                    </Text>
                    <TextInput
                      keyboardType="numeric"
                      value={item.rate.toString()}
                      onChangeText={(text) =>
                        updateLineItem(item.id, "rate", parseFloat(text) || 0)
                      }
                      className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
                    />
                  </View>
                  <View className="flex-1 ml-2">
                    <Text
                      className={`text-sm mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Amount
                    </Text>
                    <View
                      className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
                    >
                      <Text className={themeStyles.textColor}>
                        ${item.amount.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={addLineItem}
              className="flex-row items-center justify-center py-3 border border-dashed border-teal-500 rounded-lg"
            >
              <Plus size={18} color="#0D9488" />
              <Text className="ml-2 text-teal-600 font-medium">Add Item</Text>
            </TouchableOpacity>
          </View>

          {/* Notes */}
          <View
            className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
          >
            <Text className={`font-bold mb-2 ${themeStyles.textColor}`}>
              Notes
            </Text>
            <TextInput
              placeholder="Add notes for your client"
              placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
              value={invoiceData.notes}
              onChangeText={(text) =>
                setInvoiceData({ ...invoiceData, notes: text })
              }
              multiline
              numberOfLines={4}
              className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"} min-h-[100px] textAlignVertical-top`}
            />
          </View>

          {/* Summary */}
          <View
            className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
          >
            <Text className={`font-bold mb-3 ${themeStyles.textColor}`}>
              Summary
            </Text>

            <View className="flex-row justify-between mb-2">
              <Text className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                Subtotal
              </Text>
              <Text className={themeStyles.textColor}>
                ${invoiceData.subtotal.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                Tax (10%)
              </Text>
              <Text className={themeStyles.textColor}>
                ${invoiceData.tax.toFixed(2)}
              </Text>
            </View>

            <View className="flex-row justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <Text className={`font-bold ${themeStyles.textColor}`}>
                Total
              </Text>
              <Text className={`font-bold text-lg ${themeStyles.textColor}`}>
                ${invoiceData.total.toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Navigation Menu */}
      <NavigationMenu activeTab="invoices" />
    </SafeAreaView>
  );
}
