import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddTours.css";
const LocationSelect = ({ onSelectLocation }) => {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [cityCode, setCityCode] = useState();
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districtCode, setDistrictCode] = useState();
  const [selectedWard, setSelectedWard] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    const host = "https://provinces.open-api.vn/api/";

    const callAPI = (api, setStateFunction, number) => {
      axios.get(api).then((response) => {
        if (number === 1) {
          setStateFunction(response.data);
        }
        if (number === 2) {
          setStateFunction(response.data.districts);
        }
      });
    };

    const callApiWard = (api) => {
      axios.get(api).then((response) => {
        setWards(response.data.wards);
      });
    };

    if (onSelectLocation) {
      onSelectLocation({
        province: selectedCity,
        district: selectedDistrict,
        commune: selectedWard,
      });
    }

    callAPI(host, setCities, 1);

    if (selectedCity) {
      callAPI(`${host}p/${cityCode.code}?depth=2`, setDistricts, 2);
    }
    if (selectedDistrict) {
      callApiWard(`${host}d/${districtCode.code}?depth=2`);
    }
  }, [selectedCity, cityCode, selectedDistrict, districtCode, selectedWard]);

  const handleSetCity = (e) => {
    setSelectedCity(e);
    const cityName = e;
    const cityCode1 = cities.find((city) => city.name === cityName);
    if (cityCode1) {
      setCityCode(cityCode1);
    }
  };

  const handleSetDistrict = (e) => {
    setSelectedDistrict(e);
    const districtName = e;
    const districtCode1 = districts.find(
      (district) => district.name === districtName
    );
    if (districtCode1) {
      setDistrictCode(districtCode1);
    }
  };

  return (
    <div className="select-location">
      <select
        id="city"
        onChange={(e) => handleSetCity(e.target.value)}
        value={selectedCity}
      >
        <option value="">Chọn tỉnh/thành phố</option>
        {cities.map((city) => (
          <option key={city.code} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>

      <select
        id="district"
        onChange={(e) => handleSetDistrict(e.target.value)}
        value={selectedDistrict}
        className="mx-2"
      >
        <option value="">Chọn quận/huyện</option>
        {districts.map((district) => (
          <option key={district.code} value={district.name}>
            {district.name}
          </option>
        ))}
      </select>

      <select
        id="ward"
        onChange={(e) => setSelectedWard(e.target.value)}
        value={selectedWard}
      >
        <option value="">Chọn phường/xã</option>
        {wards.map((ward) => (
          <option key={ward.code} value={ward.name}>
            {ward.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelect;
