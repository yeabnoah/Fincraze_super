import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Switch } from "react-native-paper";
import axios from "axios";
import { router } from "expo-router";
import useCountryStore from "@/state/country";
import useCityNameStore from "@/state/cityName";
import useRateStore from "@/state/rate";

export default function CheckExchange() {
  const { country, setCountry } = useCountryStore();
  const { cityName } = useCityNameStore();
  const { setRate } = useRateStore();
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrencyIndex, setSelectedCurrencyIndex] = useState(null);
  const [rated, setRated] = useState(0);
  const [currencySet, setCurrencySet] = useState(true); // Track if currency rate is set

  const fetchCity = async (id) => {
    try {
      const response = await axios.get(
        `https://fincraze.net/admin/getCountrybyid/${id}`
      );
      setCountry(response.data);
      router.navigate("/Details/Details");
    } catch (err) {
      console.error("Error fetching country:", err);
    }
  };

  const toggleSwitch = (index) => {
    setSelectedCurrencyIndex(index === selectedCurrencyIndex ? null : index);

    if (index !== selectedCurrencyIndex) {
      const selectedCurrency = currencies[index];
      const selectedCity = selectedCurrency.cities.find(
        (each) => each.city === cityName
      );
      if (selectedCity) {
        setRated(selectedCity.balance);
        setCurrencySet(true);
      } else {
        setRated(0);
        setCurrencySet(false);
      }
    } else {
      setRated(0);
      setCurrencySet(false);
    }
  };

  const handleContinue = () => {
    setRate(rated);
    router.navigate("Details/form");
  };

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(
        `https://fincraze.net/admin/getCurrencies`
      );
      setCurrencies(response.data);
    } catch (err) {
      console.error("Error fetching currencies:", err);
    }
  };

  useEffect(() => {
    const fetchCurrenciesInterval = setInterval(() => {
      fetchCurrencies();
    }, 2000);
    return () => clearInterval(fetchCurrenciesInterval);
  }, []);

  // Determine if continue button should be disabled
  const isContinueDisabled = selectedCurrencyIndex === null || !currencySet;

  return (
    <View className="bg-primary flex-1 pt-14">
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 3 }}>
        <Text className="text-4xl text-center font-poppinsBold text-white">
          FinCraze
        </Text>
        <View
          style={{ height: 0.5, backgroundColor: "gray", marginVertical: 10 }}
        />

        <View className="flex-row justify-between mx-5 pt-1 items-center">
          <Text className="text-white font-poppinsMedium text-xl">
            Currency and Exchange Rate
          </Text>
        </View>

        <View className="flex-1 flex-col justify-center items-center">
          <ScrollView className="mb-2 pt-[3%]">
            {currencies.map((each, index) => (
              <View
                key={index}
                className="currency-item flex flex-row items-center"
              >
                <Text className="text-white m-5 text-2xl">{each.name}</Text>
                <Switch
                  value={selectedCurrencyIndex === index}
                  onValueChange={() => toggleSwitch(index)}
                />
              </View>
            ))}

            <Text className="text-2xl font-poppinsBold text-white mt-14">
              Exchange Rate
            </Text>
            <Text className="text-2xl font-bold text-center text-red-300 mt-5">
              {currencySet ? rated : "Currency not set"}
            </Text>
          </ScrollView>
          <View className="flex-row justify-center items-center">
            <TouchableOpacity
              onPress={handleContinue}
              disabled={isContinueDisabled}
              className=" mb-10 px-5 py-2 rounded-md"
              style={{
                backgroundColor: isContinueDisabled ? "gray" : "#FFA500",
                opacity: isContinueDisabled ? 0.6 : 1,
                ...styles.continueButton,
              }}
            >
              <Text className="text-2xl w-fit text-white">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={{ flex: 0.23 }}
        className="h-20 bg-primary flex-row items-center justify-center"
      >
        <TouchableOpacity
          onPress={() => {
            router.navigate("/Home");
          }}
          className="bg-gray-600 h-[100%] flex-row justify-center items-center"
          style={{ flex: 1 }}
        >
          <View className="flex-col justify-center items-center">
            <Entypo name="home" size={18} color="#0ef5e3" />
            <Text className="font-poppins text-center text-base text-secondary mt-1">
              Home
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.navigate("/Transaction");
          }}
          style={{ flex: 1 }}
          className="h-[100%] flex-row justify-center items-center"
        >
          <View className="flex-col justify-center items-center">
            <FontAwesome6 name="money-bill-transfer" size={16} color="white" />
            <Text className="font-poppins text-center text-base text-white mt-2">
              Transaction
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  continueButton: {
    px: 5,
    rounded: "md",
    py: 2,
    mt: 10,
  },
};
