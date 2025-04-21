import React from "react";
import { View, Text, Pressable } from "react-native";
import { Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

interface SummaryCardProps {
  title: string;
  amount: string;
  percentChange: number;
  color: string;
  icon: React.ReactNode;
}

const SummaryCard = ({
  title = "Outstanding",
  amount = "$0.00",
  percentChange = 0,
  color = "#14b8a6",
  icon = <DollarSign size={20} color="white" />,
}: SummaryCardProps) => {
  const isPositive = percentChange >= 0;

  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex-1 mx-1">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-gray-500 dark:text-gray-400 text-sm">
          {title}
        </Text>
        <View style={{ backgroundColor: color }} className="rounded-full p-2">
          {icon}
        </View>
      </View>
      <Text className="text-xl font-bold dark:text-white mb-1">{amount}</Text>
      <View className="flex-row items-center">
        {isPositive ? (
          <ArrowUpRight size={16} color="#10b981" />
        ) : (
          <ArrowDownRight size={16} color="#ef4444" />
        )}
        <Text
          className={`ml-1 ${isPositive ? "text-green-500" : "text-red-500"}`}
        >
          {Math.abs(percentChange)}%
        </Text>
        <Text className="text-gray-400 text-xs ml-1">vs last month</Text>
      </View>
    </View>
  );
};

interface ChartBarProps {
  height: number;
  label: string;
  value: string;
  color: string;
  index: number;
}

const ChartBar = ({
  height = 50,
  label = "Mon",
  value = "$0",
  color = "#14b8a6",
  index = 0,
}: ChartBarProps) => {
  const animatedHeight = useSharedValue(0);

  React.useEffect(() => {
    // Stagger the animations
    const timeout = setTimeout(() => {
      animatedHeight.value = withTiming(height, { duration: 1000 });
    }, index * 100);

    return () => clearTimeout(timeout);
  }, [height, index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
    };
  });

  return (
    <View className="items-center justify-end mx-1 flex-1">
      <Pressable className="items-center w-full">
        <Text className="text-xs text-gray-500 mb-1">{value}</Text>
        <Animated.View
          style={[animatedStyle, { backgroundColor: color }]}
          className="rounded-t-md w-full"
        />
        <Text className="text-xs text-gray-500 mt-1">{label}</Text>
      </Pressable>
    </View>
  );
};

interface DashboardSummaryProps {
  outstandingAmount?: string;
  paidAmount?: string;
  overdueAmount?: string;
  outstandingPercentChange?: number;
  paidPercentChange?: number;
  overduePercentChange?: number;
  chartData?: Array<{
    label: string;
    value: number;
    displayValue: string;
  }>;
}

const DashboardSummary = ({
  outstandingAmount = "$4,250.00",
  paidAmount = "$12,650.00",
  overdueAmount = "$1,380.00",
  outstandingPercentChange = 12.5,
  paidPercentChange = 8.2,
  overduePercentChange = -5.3,
  chartData = [
    { label: "Mon", value: 30, displayValue: "$300" },
    { label: "Tue", value: 45, displayValue: "$450" },
    { label: "Wed", value: 25, displayValue: "$250" },
    { label: "Thu", value: 60, displayValue: "$600" },
    { label: "Fri", value: 75, displayValue: "$750" },
    { label: "Sat", value: 40, displayValue: "$400" },
    { label: "Sun", value: 20, displayValue: "$200" },
  ],
}: DashboardSummaryProps) => {
  // Find the maximum value to normalize heights
  const maxValue = Math.max(...chartData.map((item) => item.value));

  // Calculate normalized heights (max height 100)
  const normalizedData = chartData.map((item) => ({
    ...item,
    height: (item.value / maxValue) * 100,
  }));

  return (
    <View className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
      <Text className="text-xl font-bold mb-4 dark:text-white">
        Financial Summary
      </Text>

      {/* Summary Cards */}
      <View className="flex-row mb-6">
        <SummaryCard
          title="Outstanding"
          amount={outstandingAmount}
          percentChange={outstandingPercentChange}
          color="#14b8a6"
          icon={<DollarSign size={20} color="white" />}
        />
        <SummaryCard
          title="Paid"
          amount={paidAmount}
          percentChange={paidPercentChange}
          color="#0ea5e9"
          icon={<DollarSign size={20} color="white" />}
        />
        <SummaryCard
          title="Overdue"
          amount={overdueAmount}
          percentChange={overduePercentChange}
          color="#f43f5e"
          icon={<DollarSign size={20} color="white" />}
        />
      </View>

      {/* Chart Section */}
      <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <Text className="text-base font-semibold mb-2 dark:text-white">
          Weekly Revenue
        </Text>
        <Text className="text-sm text-gray-500 mb-4">Last 7 days</Text>

        {/* Chart Container */}
        <View className="h-32">
          <View className="flex-row justify-between items-end h-full">
            {normalizedData.map((item, index) => (
              <ChartBar
                key={item.label}
                height={item.height}
                label={item.label}
                value={item.displayValue}
                color="#14b8a6"
                index={index}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default DashboardSummary;
