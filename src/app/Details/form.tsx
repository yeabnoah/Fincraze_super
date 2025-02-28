import {
  View,
  Text,
  StatusBar,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { router } from "expo-router";
import useUserStore from "@/state/user";
import axios from "axios";
import useCityStore from "@/state/city";
import useCountryStore from "@/state/country";
import useRateStore from "@/state/rate";

export default function Details() {
  const { user } = useUserStore();
  const { city } = useCityStore();
  const { rate } = useRateStore();

  const [formData, setFormData] = useState({
    transactionFee: user.transactionFee,
    toCity: city.name,
    from: "",
    to: "",
    phoneNumber: "",
    amount: "",
    sender_message: "",
    exchangedAmount: "",
  });

  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    if (key === "amount") {
      const amount = parseFloat(value) || 0;
      const exchangedAmount = (amount * rate).toFixed(2);
      setFormData((prevState) => ({
        ...prevState,
        amount: value,
        exchangedAmount: exchangedAmount,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    }
  };

  const handleSubmit = () => {
    const postData = {
      amount: formData.exchangedAmount,
      from: formData.from,
      phoneNumber: formData.phoneNumber,
      sender_message: formData.sender_message,
      to: formData.to,
      toCity: city.name, // assuming city._id contains the correct ID
      transactionFee: user.transactionFee,
    };

    axios
      .post(`https://fincraze.net/plus/sendMoney/${user._id}`, postData)
      .then((response) => {
        console.log("Response:", response.data);
        router.navigate("/Home");
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("An error occurred while sending money. Please try again.");
      });

    console.log(postData);
  };

  return (
    <ScrollView className="bg-primary flex-1 pt-14">
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 3 }}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          className="flex-row justify-between mx-5 pt-1 items-center"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View className="mx-5 mt-5">
          <Text className="text-orange-400 text-xl text-right">
            Current Exchange Rate: {rate}
          </Text>

          <Text className="text-white font-poppins text-lg">From</Text>
          <TextInput
            placeholder="from"
            className="text-lg font-poppins bg-gray-300 py-2 rounded-md mt-2 px-3 text-black"
            value={formData.from}
            onChangeText={(text) => handleChange("from", text)}
          />
        </View>

        <View className="mx-5">
          <Text className="text-white font-poppins text-lg mt-5">To</Text>
          <TextInput
            placeholder="money being sent to"
            className="text-lg font-poppins bg-gray-300 py-2 rounded-md mt-2 px-3 text-black"
            value={formData.to}
            onChangeText={(text) => handleChange("to", text)}
          />
        </View>

        <View className="mx-5">
          <Text className="text-white font-poppins text-lg mt-5">Phone No</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="Phone No"
            className="text-lg font-poppins bg-gray-300 py-2 rounded-md mt-2 px-3 text-black"
            value={formData.phoneNumber}
            onChangeText={(text) => handleChange("phoneNumber", text)}
          />
        </View>

        <View className="mx-5">
          <Text className="text-white font-poppins text-lg mt-5">Amount</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="Amount"
            className="text-lg font-poppins bg-gray-300 py-2 rounded-md mt-2 px-3 text-black"
            value={formData.amount}
            onChangeText={(text) => handleChange("amount", text)}
          />
          <Text className="text-orange-400 text-lg mt-2">
            Exchanged Amount: {formData.exchangedAmount}
          </Text>
        </View>

        <View className="mx-5">
          <Text className="text-white font-poppins text-lg mt-5">
            Send a message
          </Text>
          <TextInput
            placeholder="Send a message"
            className="h-36 text-lg font-poppins bg-gray-300 py-2 rounded-md mt-2 px-3 text-black"
            value={formData.sender_message}
            onChangeText={(text) => handleChange("sender_message", text)}
          />
        </View>

        {error ? (
          <Text className="text-red-500 text-lg text-center mt-5">{error}</Text>
        ) : null}

        <View className="flex-row justify-center mt-10 mb-10">
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-secondary w-36 p-3 rounded-md"
          >
            <Text className="text-xl font-poppinsMedium text-center">Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
