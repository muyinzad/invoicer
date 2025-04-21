import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Check, Clock, AlertCircle, Send, Trash } from "lucide-react-native";

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

interface InvoiceListProps {
  invoices?: Invoice[];
  onMarkAsPaid?: (id: string) => void;
  onSendReminder?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewInvoice?: (id: string) => void;
}

const InvoiceList = ({
  invoices = [
    {
      id: "1",
      clientName: "Acme Corp",
      amount: 1250.0,
      dueDate: "2023-12-15",
      status: "pending",
    },
    {
      id: "2",
      clientName: "Globex Industries",
      amount: 3450.75,
      dueDate: "2023-11-30",
      status: "overdue",
    },
    {
      id: "3",
      clientName: "Wayne Enterprises",
      amount: 5000.0,
      dueDate: "2023-12-20",
      status: "pending",
    },
    {
      id: "4",
      clientName: "Stark Industries",
      amount: 2750.5,
      dueDate: "2023-11-25",
      status: "paid",
    },
    {
      id: "5",
      clientName: "Umbrella Corporation",
      amount: 1800.25,
      dueDate: "2023-12-05",
      status: "overdue",
    },
  ],
  onMarkAsPaid = () => {},
  onSendReminder = () => {},
  onDelete = () => {},
  onViewInvoice = () => {},
}: InvoiceListProps) => {
  const [refreshing, setRefreshing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "overdue":
        return "bg-red-500";
      default:
        return "bg-gray-500";
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

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    item: Invoice,
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: "clamp",
    });

    const renderActionButton = (
      color: string,
      icon: React.ReactNode,
      onPress: () => void,
    ) => {
      return (
        <Animated.View
          style={{
            transform: [{ translateX: trans }],
          }}
        >
          <TouchableOpacity
            className={`h-full w-16 justify-center items-center ${color}`}
            onPress={onPress}
          >
            {icon}
          </TouchableOpacity>
        </Animated.View>
      );
    };

    if (item.status === "paid") {
      return renderActionButton(
        "bg-red-500",
        <Trash size={20} color="white" />,
        () => onDelete(item.id),
      );
    }

    return (
      <View className="flex-row">
        {item.status !== "paid" &&
          renderActionButton(
            "bg-green-500",
            <Check size={20} color="white" />,
            () => onMarkAsPaid(item.id),
          )}
        {item.status !== "paid" &&
          renderActionButton(
            "bg-blue-500",
            <Send size={20} color="white" />,
            () => onSendReminder(item.id),
          )}
        {renderActionButton(
          "bg-red-500",
          <Trash size={20} color="white" />,
          () => onDelete(item.id),
        )}
      </View>
    );
  };

  const renderItem = ({ item }: { item: Invoice }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
    >
      <TouchableOpacity
        className="bg-white dark:bg-gray-800 p-4 mb-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
        onPress={() => onViewInvoice(item.id)}
        activeOpacity={0.7}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800 dark:text-white">
              {item.clientName}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Due: {formatDate(item.dueDate)}
              </Text>
            </View>
          </View>
          <View>
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(item.amount)}
            </Text>
            <View className="flex-row items-center justify-end mt-1">
              <View
                className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(item.status)}`}
              />
              <Text className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-4 py-3 flex-row justify-between items-center">
        <Text className="text-xl font-bold text-gray-800 dark:text-white">
          Recent Invoices
        </Text>
        <TouchableOpacity>
          <Text className="text-teal-500 font-medium">See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={invoices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-gray-500 dark:text-gray-400">
              No invoices found
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default InvoiceList;
