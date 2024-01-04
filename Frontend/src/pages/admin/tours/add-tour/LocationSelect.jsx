import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddTours.css";
const LocationSelect = ({
  onSelectLocation,
  onSelectLocation2,
  onSelectLocation3,
  pickProvince,
  searchProvince,
  searchProvince2,
  searchProvince3,
  english,
}) => {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  // console.log(defaultValue);
  const [selectedCity, setSelectedCity] = useState("");
  const [cityCode, setCityCode] = useState();
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districtCode, setDistrictCode] = useState();
  const [selectedWard, setSelectedWard] = useState("");
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
    if (onSelectLocation3) {
      onSelectLocation3({
        province: selectedCity,
        district: selectedDistrict,
        commune: selectedWard,
      });
    }
    if (onSelectLocation2) {
      onSelectLocation2(selectedCity);
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
    setSelectedDistrict("");
    setSelectedWard("");
    const cityName = e;
    const cityCode1 = cities.find((city) => city.name === cityName);
    if (cityCode1) {
      setCityCode(cityCode1);
    }
  };

  const handleSetDistrict = (e) => {
    setSelectedDistrict(e);
    setSelectedWard("");
    const districtName = e;
    const districtCode1 = districts.find(
      (district) => district.name === districtName
    );
    if (districtCode1) {
      setDistrictCode(districtCode1);
    }
  };
  const sortByName = (object) => {
    return object.slice().sort((a, b) => a.name.localeCompare(b.name));
  };
  return (
    <div className="select-location">
      {pickProvince ? (
        <select
          id="city"
          onChange={(e) => handleSetCity(e.target.value)}
          value={selectedCity}
          className={`select-custom ${searchProvince ? "selectSearch" : ""}`}
        >
          {searchProvince ? (
            <option value={searchProvince}>{searchProvince}</option>
          ) : searchProvince2 ? (
            <option value="">Chọn tuyến đường ?</option>
          ) : searchProvince3 ? (
            <option value="">Nơi bạn bắt đầu ?</option>
          ) : (
            <option value="">Nơi bạn muốn đi ?</option>
          )}

          {sortByName(cities).map((city) => (
            <option key={city?.code} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      ) : (
        <>
          <select
            id="city"
            onChange={(e) => handleSetCity(e.target.value)}
            value={selectedCity}
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {sortByName(cities).map((city) => (
              <option key={city?.code} value={city.name}>
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
            {sortByName(districts).map((district) => (
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
            {sortByName(wards).map((ward) => (
              <option key={ward.code} value={ward.name}>
                {ward.name}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default LocationSelect;
