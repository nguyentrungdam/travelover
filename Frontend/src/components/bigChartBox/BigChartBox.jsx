import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Tick,
} from "recharts";
import "./bigChartBox.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfit, getTurnover } from "../../slices/orderSlice";
import Loading from "../Loading/Loading";

const BigChartBox = () => {
  const dispatch = useDispatch();
  const [inputYear, setInputYear] = useState("");
  const [selectedYear, setSelectedYear] = useState("2023");
  const { loading, turnover, profit } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getTurnover(2023)).unwrap();
    dispatch(getProfit(2023)).unwrap();
  }, []);

  const mergedData = turnover.map((turnoverItem, index) => ({
    name: `Tháng ${turnoverItem?.valueX}`,
    turnover: turnoverItem?.valueY / 1000,
    profit: profit[index]?.valueY / 1000,
  }));
  const calculateRoundedMax = (data, interval) => {
    const maxValue = Math.max(
      ...data.map((item) => item.turnover),
      ...data.map((item) => item.profit)
    );
    const roundedMax = Math.ceil(maxValue / interval) * interval;
    return roundedMax;
  };
  const roundedMax = calculateRoundedMax(mergedData, 5000);

  const handleInputChange = (event) => {
    setInputYear(event.target.value);
  };

  const handleSelectYear = () => {
    setSelectedYear(inputYear);
    dispatch(getTurnover(inputYear)).unwrap();
    dispatch(getProfit(inputYear)).unwrap();
  };
  return (
    <div className="bigChartBox">
      <h1>Thống Kê</h1>
      <div className="w-100 d-flex align-items-center justify-content-between py-4 col-md-3 ">
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control w-50"
            placeholder="VD: 2023"
            onChange={handleInputChange}
          />
          <div className="btn-block ms-2" onClick={handleSelectYear}>
            Chọn
          </div>
        </div>
        <div className="d-flex flex-column">
          <div className="d-flex">
            <div className=" profit"></div>
            <div>Doanh thu (turnover)</div>
          </div>
          <div className="d-flex">
            <div className=" turnover"></div>
            <div>Lợi nhuận (profit)</div>
          </div>
        </div>
      </div>
      {loading ? (
        <Loading isTable />
      ) : (
        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mergedData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis
                domain={[0, roundedMax]}
                allowDataOverflow
                tickFormatter={(value) => new Intl.NumberFormat().format(value)}
                label={{
                  value: "Đơn vị *1000đ",
                  position: "top",
                  offset: -30,
                }}
                width={110}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="profit"
                stackId="1"
                stroke="#F9AB6D"
                fill="#F9AB6D"
              />
              <Area
                type="monotone"
                dataKey="turnover"
                stackId="1"
                stroke="#9B7C82"
                fill="#9B7C82"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      <h4 className="text-center mt-3 mb-1">
        Thống kê doanh thu và lợi nhuận năm {selectedYear}
      </h4>
    </div>
  );
};

export default BigChartBox;
