import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Switch,
} from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import {
  Trash2,
  Plus,
  X,
  Image as ImageIcon,
  Download,
  Send,
  Save,
  DollarSign,
  Calendar,
  User,
  Briefcase,
  Edit3,
  Move,
} from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceCreatorProps {
  visible?: boolean;
  onClose?: () => void;
  onSave?: (invoiceData: any) => void;
  onSend?: (invoiceData: any) => void;
  initialData?: any;
}

const TEMPLATES = [
  { id: "template1", name: "Professional", color: "#14b8a6" },
  { id: "template2", name: "Minimal", color: "#0ea5e9" },
  { id: "template3", name: "Creative", color: "#8b5cf6" },
];

const InvoiceCreator: React.FC<InvoiceCreatorProps> = ({
  visible = true,
  onClose = () => {},
  onSave = () => {},
  onSend = () => {},
  initialData = null,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [clientName, setClientName] = useState("John Doe");
  const [clientEmail, setClientEmail] = useState("john@example.com");
  const [issueDate, setIssueDate] = useState("2023-06-15");
  const [dueDate, setDueDate] = useState("2023-06-30");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: "1",
      description: "Web Design Services",
      quantity: 1,
      rate: 500,
      amount: 500,
    },
    {
      id: "2",
      description: "Logo Design",
      quantity: 1,
      rate: 200,
      amount: 200,
    },
  ]);
  const [notes, setNotes] = useState("Thank you for your business!");
  const [includeLogo, setIncludeLogo] = useState(true);
  const [includeSignature, setIncludeSignature] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  // Animation values
  const dragY = useSharedValue(0);
  const dragX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: dragY.value }, { translateX: dragX.value }],
    };
  });

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setLineItems([...lineItems, newItem]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate amount if quantity or rate changes
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      }),
    );
  };

  const handleSave = () => {
    const invoiceData = {
      template: selectedTemplate,
      invoiceNumber,
      clientName,
      clientEmail,
      issueDate,
      dueDate,
      lineItems,
      notes,
      includeLogo,
      includeSignature,
      total: calculateTotal(),
    };
    onSave(invoiceData);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSend = () => {
    const invoiceData = {
      template: selectedTemplate,
      invoiceNumber,
      clientName,
      clientEmail,
      issueDate,
      dueDate,
      lineItems,
      notes,
      includeLogo,
      includeSignature,
      total: calculateTotal(),
    };
    onSend(invoiceData);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View className="p-4">
            <Text className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Select Template
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {TEMPLATES.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  className={`w-[30%] h-40 rounded-lg mb-4 border-2 ${selectedTemplate.id === template.id ? "border-teal-500" : "border-gray-200"}`}
                  style={{ backgroundColor: template.color + "20" }}
                  onPress={() => {
                    setSelectedTemplate(template);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <View className="flex-1 justify-center items-center">
                    <View
                      className="w-16 h-1 mb-2 rounded-full"
                      style={{ backgroundColor: template.color }}
                    />
                    <View
                      className="w-12 h-1 mb-2 rounded-full"
                      style={{ backgroundColor: template.color }}
                    />
                    <View
                      className="w-14 h-1 mb-4 rounded-full"
                      style={{ backgroundColor: template.color }}
                    />
                    <Text
                      className="text-center text-sm font-medium"
                      style={{ color: template.color }}
                    >
                      {template.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 2:
        return (
          <View className="p-4">
            <Text className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Invoice Details
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                Invoice Number
              </Text>
              <TextInput
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                value={invoiceNumber}
                onChangeText={setInvoiceNumber}
                placeholder="INV-001"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                Client Name
              </Text>
              <TextInput
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                value={clientName}
                onChangeText={setClientName}
                placeholder="Client Name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                Client Email
              </Text>
              <TextInput
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                value={clientEmail}
                onChangeText={setClientEmail}
                placeholder="client@example.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
              />
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="w-[48%]">
                <Text className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                  Issue Date
                </Text>
                <TextInput
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  value={issueDate}
                  onChangeText={setIssueDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View className="w-[48%]">
                <Text className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                  Due Date
                </Text>
                <TextInput
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  value={dueDate}
                  onChangeText={setDueDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </View>
        );
      case 3:
        return (
          <View className="p-4">
            <Text className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Line Items
            </Text>

            {lineItems.map((item, index) => (
              <Animated.View
                key={item.id}
                className="mb-4 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                style={index === 0 ? animatedStyle : {}}
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="font-medium text-gray-800 dark:text-white">
                    Item {index + 1}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeLineItem(item.id)}
                    className="p-1"
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                <TextInput
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  value={item.description}
                  onChangeText={(value) =>
                    updateLineItem(item.id, "description", value)
                  }
                  placeholder="Description"
                  placeholderTextColor="#9ca3af"
                />

                <View className="flex-row justify-between">
                  <TextInput
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-[30%] bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    value={item.quantity.toString()}
                    onChangeText={(value) =>
                      updateLineItem(
                        item.id,
                        "quantity",
                        parseFloat(value) || 0,
                      )
                    }
                    placeholder="Qty"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                  />

                  <TextInput
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-[30%] bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                    value={item.rate.toString()}
                    onChangeText={(value) =>
                      updateLineItem(item.id, "rate", parseFloat(value) || 0)
                    }
                    placeholder="Rate"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                  />

                  <View className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-[30%] bg-gray-100 dark:bg-gray-700">
                    <Text className="text-center text-gray-800 dark:text-white">
                      ${item.amount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}

            <TouchableOpacity
              className="flex-row items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4"
              onPress={addLineItem}
            >
              <Plus size={18} color="#14b8a6" />
              <Text className="ml-2 text-teal-600 dark:text-teal-400 font-medium">
                Add Item
              </Text>
            </TouchableOpacity>

            <View className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600 dark:text-gray-300">
                  Subtotal
                </Text>
                <Text className="font-medium text-gray-800 dark:text-white">
                  ${calculateTotal().toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600 dark:text-gray-300">
                  Tax (0%)
                </Text>
                <Text className="font-medium text-gray-800 dark:text-white">
                  $0.00
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-800 dark:text-white font-bold">
                  Total
                </Text>
                <Text className="font-bold text-teal-600 dark:text-teal-400">
                  ${calculateTotal().toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        );
      case 4:
        return (
          <View className="p-4">
            <Text className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Customize Invoice
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                Notes/Terms
              </Text>
              <TextInput
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white h-24"
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes or terms for your client"
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="top"
              />
            </View>

            <View className="mb-4 flex-row justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <Text className="text-gray-800 dark:text-white font-medium">
                Include Logo
              </Text>
              <Switch
                value={includeLogo}
                onValueChange={setIncludeLogo}
                trackColor={{ false: "#d1d5db", true: "#14b8a6" }}
                thumbColor="#ffffff"
              />
            </View>

            {includeLogo && (
              <View className="mb-4 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg items-center justify-center">
                <ImageIcon size={24} color="#9ca3af" />
                <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Tap to upload your logo
                </Text>
              </View>
            )}

            <View className="mb-4 flex-row justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <Text className="text-gray-800 dark:text-white font-medium">
                Include Digital Signature
              </Text>
              <Switch
                value={includeSignature}
                onValueChange={setIncludeSignature}
                trackColor={{ false: "#d1d5db", true: "#14b8a6" }}
                thumbColor="#ffffff"
              />
            </View>

            {includeSignature && (
              <View className="mb-4 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg items-center justify-center h-32">
                <Edit3 size={24} color="#9ca3af" />
                <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Tap to add your signature
                </Text>
              </View>
            )}
          </View>
        );
      case 5:
        return (
          <View className="p-4">
            <Text className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Preview Invoice
            </Text>

            <View className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden mb-4 border border-gray-200 dark:border-gray-700">
              <View
                className="p-4 border-b border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: selectedTemplate.color + "20" }}
              >
                <View className="flex-row justify-between items-center">
                  {includeLogo && (
                    <View className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg items-center justify-center">
                      <ImageIcon size={24} color="#9ca3af" />
                    </View>
                  )}
                  <View>
                    <Text
                      className="text-xl font-bold text-right"
                      style={{ color: selectedTemplate.color }}
                    >
                      INVOICE
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-300 text-right">
                      {invoiceNumber}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="p-4">
                <View className="flex-row justify-between mb-6">
                  <View>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      From
                    </Text>
                    <Text className="font-medium text-gray-800 dark:text-white">
                      Your Business Name
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-300">
                      your@email.com
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      To
                    </Text>
                    <Text className="font-medium text-gray-800 dark:text-white">
                      {clientName}
                    </Text>
                    <Text className="text-gray-600 dark:text-gray-300">
                      {clientEmail}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between mb-6">
                  <View>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Issue Date
                    </Text>
                    <Text className="text-gray-800 dark:text-white">
                      {issueDate}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Due Date
                    </Text>
                    <Text className="text-gray-800 dark:text-white">
                      {dueDate}
                    </Text>
                  </View>
                </View>

                <View className="mb-4">
                  <View className="flex-row bg-gray-100 dark:bg-gray-700 p-2 rounded-t-lg">
                    <Text className="flex-1 font-medium text-gray-800 dark:text-white">
                      Description
                    </Text>
                    <Text className="w-16 text-center font-medium text-gray-800 dark:text-white">
                      Qty
                    </Text>
                    <Text className="w-20 text-center font-medium text-gray-800 dark:text-white">
                      Rate
                    </Text>
                    <Text className="w-20 text-center font-medium text-gray-800 dark:text-white">
                      Amount
                    </Text>
                  </View>

                  {lineItems.map((item, index) => (
                    <View
                      key={item.id}
                      className={`flex-row p-2 ${index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-750"} border-b border-gray-200 dark:border-gray-700`}
                    >
                      <Text className="flex-1 text-gray-800 dark:text-white">
                        {item.description}
                      </Text>
                      <Text className="w-16 text-center text-gray-800 dark:text-white">
                        {item.quantity}
                      </Text>
                      <Text className="w-20 text-center text-gray-800 dark:text-white">
                        ${item.rate.toFixed(2)}
                      </Text>
                      <Text className="w-20 text-center text-gray-800 dark:text-white">
                        ${item.amount.toFixed(2)}
                      </Text>
                    </View>
                  ))}

                  <View className="p-2 bg-gray-100 dark:bg-gray-700 rounded-b-lg">
                    <View className="flex-row justify-end">
                      <Text className="w-24 font-medium text-gray-800 dark:text-white">
                        Total:
                      </Text>
                      <Text
                        className="w-20 text-center font-bold"
                        style={{ color: selectedTemplate.color }}
                      >
                        ${calculateTotal().toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Notes
                  </Text>
                  <Text className="text-gray-800 dark:text-white">{notes}</Text>
                </View>

                {includeSignature && (
                  <View className="items-center mt-6 mb-2">
                    <View className="w-40 h-16 border-b border-gray-300 dark:border-gray-600 items-center justify-center">
                      <Text className="text-gray-400 dark:text-gray-500">
                        Digital Signature
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <BlurView intensity={20} className="flex-1">
        <View className="flex-1 bg-white dark:bg-gray-900 mt-8 rounded-t-3xl overflow-hidden">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#9ca3af" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-800 dark:text-white">
              {previewMode ? "Invoice Preview" : `Step ${currentStep} of 5`}
            </Text>
            <TouchableOpacity
              onPress={() => setPreviewMode(!previewMode)}
              className="p-2"
            >
              <Text className="text-teal-600 dark:text-teal-400">
                {previewMode ? "Edit" : "Preview"}
              </Text>
            </TouchableOpacity>
          </View>

          {previewMode ? (
            <ScrollView className="flex-1">
              <View className="p-4">
                <View className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden mb-4 border border-gray-200 dark:border-gray-700">
                  <View
                    className="p-4 border-b border-gray-200 dark:border-gray-700"
                    style={{ backgroundColor: selectedTemplate.color + "20" }}
                  >
                    <View className="flex-row justify-between items-center">
                      {includeLogo && (
                        <View className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg items-center justify-center">
                          <ImageIcon size={24} color="#9ca3af" />
                        </View>
                      )}
                      <View>
                        <Text
                          className="text-xl font-bold text-right"
                          style={{ color: selectedTemplate.color }}
                        >
                          INVOICE
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-300 text-right">
                          {invoiceNumber}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="p-4">
                    <View className="flex-row justify-between mb-6">
                      <View>
                        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          From
                        </Text>
                        <Text className="font-medium text-gray-800 dark:text-white">
                          Your Business Name
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-300">
                          your@email.com
                        </Text>
                      </View>
                      <View>
                        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          To
                        </Text>
                        <Text className="font-medium text-gray-800 dark:text-white">
                          {clientName}
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-300">
                          {clientEmail}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row justify-between mb-6">
                      <View>
                        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Issue Date
                        </Text>
                        <Text className="text-gray-800 dark:text-white">
                          {issueDate}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Due Date
                        </Text>
                        <Text className="text-gray-800 dark:text-white">
                          {dueDate}
                        </Text>
                      </View>
                    </View>

                    <View className="mb-4">
                      <View className="flex-row bg-gray-100 dark:bg-gray-700 p-2 rounded-t-lg">
                        <Text className="flex-1 font-medium text-gray-800 dark:text-white">
                          Description
                        </Text>
                        <Text className="w-16 text-center font-medium text-gray-800 dark:text-white">
                          Qty
                        </Text>
                        <Text className="w-20 text-center font-medium text-gray-800 dark:text-white">
                          Rate
                        </Text>
                        <Text className="w-20 text-center font-medium text-gray-800 dark:text-white">
                          Amount
                        </Text>
                      </View>

                      {lineItems.map((item, index) => (
                        <View
                          key={item.id}
                          className={`flex-row p-2 ${index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-750"} border-b border-gray-200 dark:border-gray-700`}
                        >
                          <Text className="flex-1 text-gray-800 dark:text-white">
                            {item.description}
                          </Text>
                          <Text className="w-16 text-center text-gray-800 dark:text-white">
                            {item.quantity}
                          </Text>
                          <Text className="w-20 text-center text-gray-800 dark:text-white">
                            ${item.rate.toFixed(2)}
                          </Text>
                          <Text className="w-20 text-center text-gray-800 dark:text-white">
                            ${item.amount.toFixed(2)}
                          </Text>
                        </View>
                      ))}

                      <View className="p-2 bg-gray-100 dark:bg-gray-700 rounded-b-lg">
                        <View className="flex-row justify-end">
                          <Text className="w-24 font-medium text-gray-800 dark:text-white">
                            Total:
                          </Text>
                          <Text
                            className="w-20 text-center font-bold"
                            style={{ color: selectedTemplate.color }}
                          >
                            ${calculateTotal().toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className="mb-4">
                      <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Notes
                      </Text>
                      <Text className="text-gray-800 dark:text-white">
                        {notes}
                      </Text>
                    </View>

                    {includeSignature && (
                      <View className="items-center mt-6 mb-2">
                        <View className="w-40 h-16 border-b border-gray-300 dark:border-gray-600 items-center justify-center">
                          <Text className="text-gray-400 dark:text-gray-500">
                            Digital Signature
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </ScrollView>
          ) : (
            <ScrollView className="flex-1">{renderStepContent()}</ScrollView>
          )}

          <View className="p-4 border-t border-gray-200 dark:border-gray-800">
            {previewMode ? (
              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="flex-row items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-[30%]"
                  onPress={() => {
                    setPreviewMode(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Edit3 size={18} color="#4b5563" />
                  <Text className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                    Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-[30%]"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    // Download functionality would go here
                  }}
                >
                  <Download size={18} color="#4b5563" />
                  <Text className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                    Save
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center justify-center p-3 bg-teal-500 rounded-lg w-[30%]"
                  onPress={handleSend}
                >
                  <Send size={18} color="#ffffff" />
                  <Text className="ml-2 text-white font-medium">Send</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="flex-row items-center justify-center p-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-[48%]"
                  onPress={() => {
                    if (currentStep > 1) {
                      setCurrentStep(currentStep - 1);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                  disabled={currentStep === 1}
                >
                  <Text className="text-gray-700 dark:text-gray-300 font-medium">
                    {currentStep === 1 ? "Cancel" : "Previous"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center justify-center p-3 bg-teal-500 rounded-lg w-[48%]"
                  onPress={() => {
                    if (currentStep < 5) {
                      setCurrentStep(currentStep + 1);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } else {
                      handleSave();
                      setPreviewMode(true);
                    }
                  }}
                >
                  <Text className="text-white font-medium">
                    {currentStep === 5 ? "Save & Preview" : "Next"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default InvoiceCreator;
