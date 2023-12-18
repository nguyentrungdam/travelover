import tourImg01 from "../images/tour-img01.jpg";
import tourImg02 from "../images/tour-img02.jpg";
import tourImg03 from "../images/tour-img03.jpg";
import tourImg04 from "../images/tour-img04.jpg";
import tourImg05 from "../images/tour-img05.jpg";
import tourImg06 from "../images/tour-img06.jpg";
import tourImg07 from "../images/tour-img07.jpg";

const tours = [
  {
    id: "01",
    title: "Westminister Bridge",
    city: "London",
    distance: 300,
    address: "SomeWhere",
    price: 99,
    maxGroupSize: 10,
    desc: "this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
      {
        name: "jhon doe",
        rating: 5,
      },
    ],
    avgRating: 4.5,
    photo: tourImg01,
    featured: true,
  },
  {
    id: "02",
    title: "Bali, Indonesia",
    city: "Indonesia",
    distance: 400,
    address: "SomeWhere",
    price: 96,
    maxGroupSize: 8,
    desc: "this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg02,
    featured: true,
  },
  {
    id: "03",
    title: "Snowy Mountains, Thailand",
    city: "Thailand",
    distance: 500,
    address: "SomeWhere",
    price: 76,
    maxGroupSize: 8,
    desc: "this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg03,
    featured: true,
  },
  {
    id: "04",
    title: "Beautiful Sunrise, Thailand",
    city: "Thailand",
    distance: 500,
    address: "SomeWhere",
    price: 85,
    maxGroupSize: 8,
    desc: "this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg04,
    featured: true,
  },
  {
    id: "05",
    title: "Nusa Pendia Bali, Indonesia",
    city: "Indonesia",
    distance: 500,
    address: "SomeWhere",
    price: 75,
    maxGroupSize: 8,
    desc: "this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg05,
    featured: false,
  },
  {
    id: "06",
    title: "Cherry Blossoms Spring",
    city: "Japan",
    distance: 500,
    address: "SomeWhere",
    price: 88,
    maxGroupSize: 8,
    desc: "this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.4,
      },
    ],
    avgRating: 4.5,
    photo: tourImg06,
    featured: false,
  },
  {
    id: "07",
    title: "Holmen Lofoten",
    city: "France",
    distance: 500,
    address: "SomeWhere",
    price: 79,
    maxGroupSize: 8,
    desc: "this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.7,
      },
    ],
    avgRating: 4.5,
    photo: tourImg07,
    featured: false,
  },
  {
    id: "08",
    title: "Snowy Mountains, Thailand",
    city: "Thailand",
    distance: 500,
    address: "SomeWhere",
    price: 99,
    maxGroupSize: 8,
    desc: "this is the description",
    reviews: [],
    avgRating: 4.5,
    photo: tourImg03,
    featured: false,
  },
];
// data.js
export const blogData = [
  {
    title: "Du hành ngược thời gian tại làng dân gian Naganeupseong Hàn Quốc",
    image:
      "https://bizweb.dktcdn.net/100/489/447/articles/6-1.jpg?v=1688305324900",
    link: "/du-hanh-nguoc-thoi-gian-tai-lang-dan-gian-naganeupseong-han-quoc",
    date: "02/07/2023",
    author: "Nguyễn Thị Kim Anh",
    summary:
      "Với lịch sử gần 700 năm, ngôi làng pháo đài Naganeupseong của Hàn Quốc khiến người ta ngỡ ngàng bởi thời gian dường như ngừng lại ở nơi đây. Những ngôi nhà xây đơn giản với mái tranh, đá không...",
  },
  {
    title: "Cắm trại ở Chư Nâm ngắm thiên đường mây ở độ cao",
    image:
      "https://bizweb.dktcdn.net/100/489/447/articles/5.jpg?v=1688305387470",
    link: "/cam-trai-o-chu-nam-ngam-thien-duong-may-o-do-cao",
    date: "02/07/2023",
    author: "Nguyễn Thị Kim Anh",
    summary:
      "Đỉnh Chư Nam Gia Lai là địa điểm dừng chân hấp dẫn thu hút những người đam mê trekking, khám phá thiên nhiên và cắm trại ở Chư Nâm chính là một trong những trải nghiệm đang rất được yêu thích thời gian gần đây. Cắm trại ở Chư Nâm ngắm thiên đường mây ở độ cao 1.472m luôn là một trải nghiệm tuyệt vời. Tạm rời xa chốn thị thành náo nhiệt cắm trại ở Chư Nâm và tận hưởng thiên nhiên tuyệt vời, tận hưởng cái nắng, cái gió và vẻ đẹp của núi đồi, bình nguyên xanh thẳm...",
  },
  {
    title:
      "Kinh nghiệm cắm trại trên núi Bà Đen Tây Ninh cuối tuần siêu trải nghiệm",
    image:
      "https://bizweb.dktcdn.net/100/489/447/articles/4.jpg?v=1688305102097",
    link: "/kinh-nghiem-cam-trai-tren-nui-ba-den-tay-ninh-cuoi-tuan-sieu-trai-nghiem",
    date: "02/07/2023",
    author: "Nguyễn Thị Kim Anh",
    summary:
      "Cắm trại núi Bà Đen đang là một trong những hoạt động hấp dẫn được nhiều bạn trẻ quan tâm. Cắm trại tại núi Bà Đen với phong cảnh hùng vĩ, hoang sơ sẽ cho bạn nhiều trải nghiệm thú vị. 1. Định vị tọa độ núi Bà Đen ở đâu Tây Ninh? Núi Bà Đen Tây Ninh (Nguồn hình: Sưu tầm) Núi Bà Đen là địa điểm đã quá nổi tiếng với những người yêu thích du lịch trên núi. Núi thuộc tỉnh Tây Ninh, nằm ở phía Đông Bắc thành phố, cách trung tâm khoảng 11km, thuộc quần thể di tích văn hoá...",
  },
  {
    title: "Tháng 7 nên đi du lịch ở đâu Việt Nam là lý tưởng nhất?",
    image:
      "https://bizweb.dktcdn.net/100/489/447/articles/3.jpg?v=1688304814390",
    link: "/thang-7-nen-di-du-lich-o-dau-viet-nam-la-ly-tuong-nhat",
    date: "02/07/2023",
    author: "Nguyễn Thị Kim Anh",
    summary:
      "Tháng 7 vẫn đang là khoảng thời gian mùa hè nên rất thích hợp cho những chuyến vi vu về các vùng biển vắng với nắng vàng, biển xanh, cát trắng. Còn với những ai yêu thích thiên nhiên, cây cỏ, yêu vẻ đẹp thanh bình, yên ả thì có thể chọn cho mình chuyến hành trình khám phá núi rừng hoang sơ thú vị. Bởi vậy, tháng 7 chính là thời điểm thích hợp để lên ý tưởng cho một hành trình lý tưởng. Đất nước Việt Nam xinh đẹp, bạn cũng có thể",
  },
];
export default tours;
