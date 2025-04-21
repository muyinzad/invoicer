import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Edit2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Send,
  Plus,
  DollarSign,
  Clock,
  AlertCircle,
  Check,
} from "lucide-react-native";
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
    notes:
      "Large enterprise client with multiple departments. Primary contact is John Smith.",
    paymentTerms: 30,
    sendReminders: true,
    invoices: [
      {
        id: "INV-001",
        amount: 5000.0,
        date: "2023-09-01",
        dueDate: "2023-10-01",
        status: "paid",
      },
      {
        id: "INV-002",
        amount: 5000.0,
        date: "2023-10-01",
        dueDate: "2023-11-01",
        status: "paid",
      },
      {
        id: "INV-003",
        amount: 2500.0,
        date: "2023-10-15",
        dueDate: "2023-11-15",
        status: "pending",
      },
    ],
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
    notes: "Mid-size manufacturing client. Very prompt with payments.",
    paymentTerms: 15,
    sendReminders: false,
    invoices: [
      {
        id: "INV-004",
        amount: 3750.5,
        date: "2023-08-15",
        dueDate: "2023-08-30",
        status: "paid",
      },
      {
        id: "INV-005",
        amount: 5000.0,
        date: "2023-09-15",
        dueDate: "2023-09-30",
        status: "paid",
      },
    ],
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
    notes:
      "High-value client with multiple projects. Contact Bruce Wayne for escalations.",
    paymentTerms: 45,
    sendReminders: true,
    invoices: [
      {
        id: "INV-006",
        amount: 10000.0,
        date: "2023-09-01",
        dueDate: "2023-10-15",
        status: "paid",
      },
      {
        id: "INV-007",
        amount: 5000.0,
        date: "2023-10-05",
        dueDate: "2023-11-20",
        status: "pending",
      },
    ],
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
    notes:
      "Tech industry client with high standards. Requires detailed invoices.",
    paymentTerms: 30,
    sendReminders: false,
    invoices: [
      {
        id: "INV-008",
        amount: 12350.75,
        date: "2023-08-01",
        dueDate: "2023-08-31",
        status: "paid",
      },
      {
        id: "INV-009",
        amount: 10000.0,
        date: "2023-09-15",
        dueDate: "2023-10-15",
        status: "paid",
      },
    ],
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
    notes:
      "Research company with multiple divisions. Invoices must be sent to accounting@umbrella.com",
    paymentTerms: 60,
    sendReminders: true,
    invoices: [
      {
        id: "INV-010",
        amount: 4600.25,
        date: "2023-09-01",
        dueDate: "2023-11-01",
        status: "paid",
      },
      {
        id: "INV-011",
        amount: 3200.0,
        date: "2023-10-20",
        dueDate: "2023-12-20",
        status: "pending",
      },
    ],
  },
];

export default function ClientDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isDarkMode, themeStyles } = useTheme();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch client details
    setTimeout(() => {
      const foundClient = mockClients.find((c) => c.id === id);
      setClient(foundClient || null);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <Check size={16} color="#10b981" />;
      case "pending":
        return <Clock size={16} color="#f59e0b" />;
      case "overdue":
        return <AlertCircle size={16} color="#ef4444" />;
      default:
        return null;
    }
  };

  const navigateToCreateInvoice = () => {
    router.push("/create-invoice");
  };

  const navigateToEditClient = () => {
    router.push(`/clients/edit/${id}`);
  };

  const sendReminder = () => {
    // Logic to send payment reminder
    console.log("Sending reminder to", client?.email);
    // Show success message
  };

  if (loading) {
    return (
      <SafeAreaView
        className={`flex-1 ${themeStyles.backgroundColor} items-center justify-center`}
      >
        <ActivityIndicator size="large" color="#0d9488" />
        <Text className={`mt-4 ${themeStyles.textColor}`}>
          Loading client details...
        </Text>
      </SafeAreaView>
    );
  }

  if (!client) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.backgroundColor}`}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color={isDarkMode ? "#fff" : "#000"} />
          </TouchableOpacity>
          <Text className={`text-2xl font-bold ${themeStyles.textColor}`}>
            Client Details
          </Text>
        </View>
        <View className="flex-1 items-center justify-center p-4">
          <Text className={`text-lg ${themeStyles.textColor} text-center`}>
            Client not found
          </Text>
          <TouchableOpacity
            className="mt-4 bg-teal-600 px-4 py-2 rounded-lg"
            onPress={() => router.push("/clients")}
          >
            <Text className="text-white font-medium">Back to Clients</Text>
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
            Client Details
          </Text>
        </View>
        <TouchableOpacity
          onPress={navigateToEditClient}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          <Edit2 size={20} color={isDarkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pb-24">
        {/* Client Info Card */}
        <View
          className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
        >
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className={`text-xl font-bold ${themeStyles.textColor}`}>
                {client.name}
              </Text>
              <View className="mt-1">
                {client.outstandingAmount > 0 ? (
                  <View className="bg-red-100 self-start px-2 py-1 rounded-full">
                    <Text className="text-xs font-medium text-red-800">
                      {formatCurrency(client.outstandingAmount)} outstanding
                    </Text>
                  </View>
                ) : (
                  <View className="bg-green-100 self-start px-2 py-1 rounded-full">
                    <Text className="text-xs font-medium text-green-800">
                      All paid
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View className="items-end">
              <Text className={`font-bold ${themeStyles.textColor}`}>
                {formatCurrency(client.totalBilled)}
              </Text>
              <Text
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Total billed
              </Text>
            </View>
          </View>

          <View className="mb-3">
            <View className="flex-row items-center mb-2">
              <Mail
                size={16}
                color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                className="mr-2"
              />
              <Text className={themeStyles.textColor}>{client.email}</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Phone
                size={16}
                color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                className="mr-2"
              />
              <Text className={themeStyles.textColor}>{client.phone}</Text>
            </View>
            <View className="flex-row items-start mb-2">
              <MapPin
                size={16}
                color={isDarkMode ? "#9CA3AF" : "#6B7280"}
                className="mr-2 mt-1"
              />
              <Text className={themeStyles.textColor}>{client.address}</Text>
            </View>
          </View>

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              className="flex-1 mr-2 bg-teal-600 py-2 rounded-lg items-center justify-center flex-row"
              onPress={navigateToCreateInvoice}
            >
              <FileText size={16} color="#fff" />
              <Text className="text-white ml-2 font-medium">New Invoice</Text>
            </TouchableOpacity>
            {client.outstandingAmount > 0 && (
              <TouchableOpacity
                className="flex-1 ml-2 bg-yellow-500 py-2 rounded-lg items-center justify-center flex-row"
                onPress={sendReminder}
              >
                <Send size={16} color="#fff" />
                <Text className="text-white ml-2 font-medium">
                  Send Reminder
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Billing Info */}
        <View
          className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
        >
          <Text className={`font-bold mb-3 ${themeStyles.textColor}`}>
            Billing Information
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Payment Terms
            </Text>
            <Text className={themeStyles.textColor}>
              {client.paymentTerms} days
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Send Reminders
            </Text>
            <Text className={themeStyles.textColor}>
              {client.sendReminders ? "Yes" : "No"}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Last Invoice
            </Text>
            <Text className={themeStyles.textColor}>
              {formatDate(client.lastInvoice)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {client.notes && (
          <View
            className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
          >
            <Text className={`font-bold mb-2 ${themeStyles.textColor}`}>
              Notes
            </Text>
            <Text className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              {client.notes}
            </Text>
          </View>
        )}

        {/* Invoice History */}
        <View
          className={`p-4 rounded-lg mb-4 ${themeStyles.cardBgColor} border ${themeStyles.borderColor}`}
        >
          <Text className={`font-bold mb-3 ${themeStyles.textColor}`}>
            Invoice History
          </Text>
          {client.invoices.map((invoice: any) => (
            <TouchableOpacity
              key={invoice.id}
              className={`p-3 mb-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} flex-row justify-between items-center`}
              onPress={() => console.log("View invoice", invoice.id)}
            >
              <View>
                <Text className={`font-medium ${themeStyles.textColor}`}>
                  {invoice.id}
                </Text>
                <Text
                  className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {formatDate(invoice.date)}
                </Text>
              </View>
              <View className="items-end">
                <Text className={`font-bold ${themeStyles.textColor}`}>
                  {formatCurrency(invoice.amount)}
                </Text>
                <View className="flex-row items-center">
                  {getStatusIcon(invoice.status)}
                  <View
                    className={`ml-1 px-2 py-0.5 rounded-full ${getStatusColor(invoice.status)}`}
                  >
                    <Text className="text-xs font-medium capitalize">
                      {invoice.status}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Navigation Menu */}
      <NavigationMenu activeTab="clients" />
    </SafeAreaView>
  );
}
