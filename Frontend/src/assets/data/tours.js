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
export const blogDataBig = [
  {
    id: 5,
    title:
      "8 đặc sản Tết miền Tây trứ danh ai cũng muốn mua về làm quà năm mới",
    image:
      "https://wiki-travel.com.vn//uploads/picture/camnhi-235601035624-dac-san-tet-mien-tay-mua-ve-lam-qua-1.jpg",
    date: "20/12/2023",
    author: "Travelover",
    summary:
      "Miền Tây Nam Bộ được biết đến là vùng đất trù phú với những món ăn ngon, hấp dẫn. Vào dịp Tết Nguyên Đán, người dân miền Tây lại càng có dịp trổ tài nấu nướng để chuẩn bị những món ăn ngon nhất đãi khách. Trong đó, có những món ăn đặc sản đã trở thành thương hiệu, được nhiều người yêu thích và tìm mua về làm quà Tết sau khi đi du lịch miền Tây trở về.",
  },
  {
    id: 6,
    title:
      "Hang Hung Thoòng - Hang động có vẻ đẹp siêu thực vừa được khám phá tại Quảng Bình",
    image:
      "https://wiki-travel.com.vn//uploads/picture/camnhi-234007054003-hang-hung-thoong-quang-binh-2.jpg",
    date: "20/12/2023",
    author: "Travelover",
    summary:
      "Quảng Bình là một tỉnh miền Trung Việt Nam nổi tiếng với nhiều hang động kỳ vĩ, trong đó có hang Sơn Đoòng, hang động lớn nhất thế giới. Mới đây, các chuyên gia hang động đã phát hiện ra một hệ thống hang động mới mang tên Hung Thoòng, nằm sâu trong vùng lõi Vườn quốc gia Phong Nha - Kẻ Bàng.Hang Hung Thoòng Quảng Bình được đánh giá là một trong những hang động đẹp nhất thế giới với vẻ đẹp siêu thực, kỳ bí. Hang động được hình thành từ hàng triệu năm trước bởi sự bào mòn của nước mưa. Bên trong hang động, du khách sẽ được chiêm ngưỡng những nhũ đá và măng đá với đủ hình thù, màu sắc, tạo nên một khung cảnh vô cùng ấn tượng.",
  },
  {
    id: 7,
    title: "Những điểm check-in đẹp tại Quảng Bình dịp đầu xuân",
    image:
      "https://wiki-travel.com.vn//uploads/picture/camnhi-231828041818-du-lich-quang-binh-dip-dau-mua-xuan-2.jpg",
    date: "20/12/2023",
    author: "Travelover",
    summary:
      "Du lịch Quảng Bình có nhiều danh lam thắng cảnh nổi tiếng, thu hút đông đảo du khách trong và ngoài nước. Dịp đầu xuân, Quảng Bình khoác lên mình một vẻ đẹp mới, tràn đầy sức sống, là thời điểm lý tưởng để du khách khám phá và check-in những địa điểm đẹp này.",
  },
  {
    id: 8,
    title: "5 địa điểm du lịch Quy Nhơn Tết đẹp mê hoặc lòng người",
    image:
      "https://wiki-travel.com.vn//uploads/picture/thanh0310-235221025250-dia-diem-du-lich-quy-nhon-1.jpg",
    date: "20/12/2023",
    author: "Travelover",
    summary:
      "Gây ấn tượng trong lòng du khách bởi thiên đường biển xinh đẹp cùng địa danh nổi tiếng để sống ảo và nghỉ dưỡng, Quy Nhơn luôn là điểm đến hàng đầu của nhiều du khách vào dịp Tết. Cùng “bỏ túi” những địa điểm du lịch Quy Nhơn Tết 2024 đáng trải nghiệm nhất dưới đây nhé.",
  },
];
export const blogDataSmall = [
  {
    id: 2,
    title: "Lưu gấp 8 địa điểm du lịch ngắm bình minh ở Đà Nẵng đẹp mê ly",
    image:
      "https://wiki-travel.com.vn//uploads/picture/camnhi-230819110855-dia-diem-du-lich-ngam-binh-minh-o-da-nang-2.jpg",
    date: "20/12/2023",
    author: "Travelover",
  },
  {
    id: 3,
    title:
      "Tết Dương lịch ở Đà Nẵng nên đi đâu chơi? - Gợi ý những điểm đến thú vị nhất",
    image:
      "https://wiki-travel.com.vn//uploads/picture/camnhi-234111054107-dia-diem-du-lich-da-nang-tet-duong-lich-2.png",
    date: "20/12/2023",
    author: "Travelover",
  },

  {
    id: 4,
    title:
      "Những lý do khiến bạn nhất định phải đón Giáng sinh ở Đà Lạt một lần trong đời",
    image:
      "https://wiki-travel.com.vn//uploads/picture/thanh0310-234901044924-giang-sinh-da-lat-01.jpg",
    date: "20/12/2023",
    author: "Travelover",
  },
];
export const blogDataDetail = [
  {
    id: 1,
    title:
      "Du lịch Huế mùa xuân: tham quan Đại Nội và trải nghiệm đón Tết miền Trung",
    image:
      "https://media.gody.vn//images/thua-thien-hue/cung-dinh-hue/10-2016/20161018050342-cung-dinh-hue-gody%20(3).jpg",
    date: "20/12/2023",
    author: "Travelover",
    province: "Thành phố Đà Nẵng",
    summary:
      "Không chỉ cuốn hút du khách bởi cảnh quan thiên nhiên hữu tình, ẩm thực đặc sắc, Huế còn mang đậm dấu ấn văn hoá lịch sử của dân tộc qua các công trình, kiến trúc tiêu biểu. Để nói về vẻ đẹp Huế mùa xuân, nơi mà thể hiện được văn hoá lịch sử cùng cảnh quan thiên nhiên Huế mùa xuân đặc sắc nhất có lẽ Đại nội Huế là địa điểm nổi bật nhất. Du lịch Huế mùa xuân, hành trình tham quan Đại Nội Huế và những trải nghiệm đón Tết có lẽ là một trong những điều tuyệt vời, hãy cùng khám phá nhé.",
  },
  {
    id: 2,
    title: "Lưu gấp 8 địa điểm du lịch ngắm bình minh ở Đà Nẵng đẹp mê ly",
    image:
      "https://wiki-travel.com.vn//uploads/picture/camnhi-230919110918-dia-diem-du-lich-ngam-binh-minh-o-da-nang-3.jpg",
    date: "20/12/2023",
    province: "Thành phố Đà Nẵng",
    author: "Travelover",
    summary:
      "Du lịch Đà Nẵng được thiên nhiên ưu ái, ban tặng cảnh quan hoang sơ, mỗi bãi biển ở đây mang một vẻ đẹp riêng, đem đến những cảm nhận và nhiều trải nghiệm khác nhau cho du khách. Trong đó, ngắm bình minh là một trải nghiệm khó lòng bỏ qua trong hành trình khám phá vẻ đẹp của thành phố này. Dưới đây là những địa điểm ngắm bình minh Đà Nẵng khiến vạn người mê. Bãi biển Mỹ Khê, đỉnh Bàn Cờ, Bà Nà Hills, Mũi Nghê…. không chỉ là địa điểm check-in sống ảo đẹp được nhiều bạn trẻ yêu thích, mà còn là điểm ngắm bình minh không thể bỏ qua của nhiều du khách du lịch Đà Nẵng.",
  },
  {
    id: 3,
    title:
      "Tết Dương lịch ở Đà Nẵng nên đi đâu chơi? - Gợi ý những điểm đến thú vị nhất",
    province: "Thành phố Đà Nẵng",
    image:
      "https://wiki-travel.com.vn//uploads/picture/camnhi-234011054031-dia-diem-du-lich-da-nang-tet-duong-lich-1.jpeg",
    date: "20/12/2023",
    author: "Travelover",
    summary:
      "Đà Nẵng là một thành phố biển xinh đẹp, nổi tiếng với những bãi biển thơ mộng, những cây cầu độc đáo, và những địa danh lịch sử, văn hóa hấp dẫn. Tết Dương lịch là thời điểm lý tưởng để du lịch Đà Nẵng, tận hưởng không khí vui tươi, nhộn nhịp của những ngày đầu năm mới. Dưới đây là một số gợi ý điểm đến thú vị cho bạn khi du lịch Đà Nẵng Tết Dương lịch: Bãi biển Mỹ Khê được mệnh danh là một trong những bãi biển đẹp nhất hành tinh. Nơi đây có bờ cát trắng mịn, làn nước trong xanh, và không khí trong lành. Bạn có thể thỏa sức tắm biển, vui đùa dưới nắng vàng, hoặc đơn giản là ngồi ngắm cảnh, tận hưởng những giây phút thư thái.",
  },
  {
    id: 4,
    title:
      "Những lý do khiến bạn nhất định phải đón Giáng sinh ở Đà Lạt một lần trong đời",
    image:
      "https://wiki-travel.com.vn//uploads/picture/thanh0310-234901044924-giang-sinh-da-lat-01.jpg",
    date: "20/12/2023",
    province: "Tỉnh Lâm Đồng",
    author: "Travelover",
    summary:
      "Mỗi khi nhắc đến địa điểm du lịch dịp Giáng sinh thích hợp nhất để vừa có thời tiết và không khí ấn tượng nhất có lẽ phải kể đến Đà Lạt. Tiết trời lạnh đặc trưng, khung cảnh tuyệt đẹp, nhiều lễ hội lớn là một vài trong ti tỉ lý do nên đón Giáng Sinh ở Đà Lạt được các tín đồ xê dịch truyền tai nhau, thành phố sương mù đang trở thành một trong những địa điểm check-in hot nhất với các tín đồ xê dịch mùa noel này. Dưới đây là những lý do nhất định bạn không nên bỏ lỡ chuyến du lịch Đà Lạt trong mùa Giáng sinh. Cái rét cắt da xứ cao nguyên hay những nhà thờ lung linh, cảnh sắc mơ mộng sẽ là lý do khiến chuyến du lịch Đà Lạt của bạn mùa Giáng Sinh trở nên thật tuyệt vời.",
  },
  {
    id: 5,
    title:
      "8 đặc sản Tết miền Tây trứ danh ai cũng muốn mua về làm quà năm mới",
    image:
      "https://wiki-travel.com.vn//uploads/picture/camnhi-235601035624-dac-san-tet-mien-tay-mua-ve-lam-qua-1.jpg",
    date: "20/12/2023",
    province: "Thành phố Cần Thơ",
    author: "Travelover",
    summary:
      "Miền Tây Nam Bộ được biết đến là vùng đất trù phú với những món ăn ngon, hấp dẫn. Vào dịp Tết Nguyên Đán, người dân miền Tây lại càng có dịp trổ tài nấu nướng để chuẩn bị những món ăn ngon nhất đãi khách. Trong đó, có những món ăn đặc sản đã trở thành thương hiệu, được nhiều người yêu thích và tìm mua về làm quà Tết sau khi đi du lịch miền Tây trở về. Bánh tét Trà Cuôn là một trong những đặc sản Tết miền Tây trứ danh nhất. Bánh có hình dáng tròn, màu sắc bắt mắt với 4 màu xanh, đỏ, vàng, tím. Nhân bánh được làm từ thịt heo, đậu xanh, trứng muối... mang hương vị thơm ngon, đậm đà. Bánh tét Trà Cuôn thường được dùng để cúng gia tiên trong dịp Tết Nguyên Đán. Bánh tét Trà Cuôn là món quà quý để mọi người có thể tặng cho nhau như để thể hiện những tình cảm dạt dào, ý nghĩa thiết thực, giàu nét văn hóa bản địa, một đặc sản rất đời thường mà ngọt ngào hương vị.",
  },
  {
    id: 6,
    title:
      "Hang Hung Thoòng - Hang động có vẻ đẹp siêu thực vừa được khám phá tại Quảng Bình",
    image:
      "https://wiki-travel.com.vn//uploads/picture/camnhi-234007054003-hang-hung-thoong-quang-binh-2.jpg",
    date: "20/12/2023",
    author: "Travelover",
    province: "Thành phố Đà Nẵng",
    summary:
      "Quảng Bình là một tỉnh miền Trung Việt Nam nổi tiếng với nhiều hang động kỳ vĩ, trong đó có hang Sơn Đoòng, hang động lớn nhất thế giới. Mới đây, các chuyên gia hang động đã phát hiện ra một hệ thống hang động mới mang tên Hung Thoòng, nằm sâu trong vùng lõi Vườn quốc gia Phong Nha - Kẻ Bàng. Hang Hung Thoòng Quảng Bình được đánh giá là một trong những hang động đẹp nhất thế giới với vẻ đẹp siêu thực, kỳ bí.",
  },
  {
    id: 7,
    title: "Những điểm check-in đẹp tại Quảng Bình dịp đầu xuân",
    image:
      "https://wiki-travel.com.vn//uploads/picture/camnhi-231828041818-du-lich-quang-binh-dip-dau-mua-xuan-2.jpg",
    date: "20/12/2023",
    province: "Thành phố Đà Nẵng",
    author: "Travelover",
    summary:
      "Du lịch Quảng Bình có nhiều danh lam thắng cảnh nổi tiếng, thu hút đông đảo du khách trong và ngoài nước. Dịp đầu xuân, Quảng Bình khoác lên mình một vẻ đẹp mới, tràn đầy sức sống, là thời điểm lý tưởng để du khách khám phá và check-in những địa điểm đẹp này. Vũng Chùa - Đảo Yến là một địa điểm du lịch tâm linh nổi tiếng ở Quảng Bình. Nơi đây là nơi an nghỉ của Đại tướng Võ Nguyên Giáp. Dịp đầu xuân, Vũng Chùa - Đảo Yến khoác lên mình một vẻ đẹp bình yên, thanh tịnh là địa điểm lý tưởng để bạn viếng thăm và cầu nguyện. Ngoài ra, du khách cũng có thể tham quan khu vực xung quanh Vũng Chùa - Đảo Yến, ngắm nhìn cảnh biển hùng vĩ, thơ mộng.",
  },
  {
    id: 8,
    title: "5 địa điểm du lịch Quy Nhơn Tết đẹp mê hoặc lòng người",
    image:
      "https://wiki-travel.com.vn//uploads/picture/thanh0310-235221025250-dia-diem-du-lich-quy-nhon-1.jpg",
    date: "20/12/2023",
    author: "Travelover",
    summary:
      "Gây ấn tượng trong lòng du khách bởi thiên đường biển xinh đẹp cùng địa danh nổi tiếng để sống ảo và nghỉ dưỡng, Quy Nhơn luôn là điểm đến hàng đầu của nhiều du khách vào dịp Tết. Cùng “bỏ túi” những địa điểm du lịch Quy Nhơn Tết 2024 đáng trải nghiệm nhất dưới đây nhé. Sơ hữu cảnh quan thiên nhiên tuyệt đẹp với thời tiết thuận lợi quanh năm, Quy Nhơn luôn là điểm đến “hot” vào các tháng trong năm. Tuy nhiên, nếu lựa chọn dịp Tết để du lịch Quy Nhơn cũng là một lựa chọn tuyệt vời bởi, thời tiết ở Quy Nhơn vào dịp Tết mát mẻ, trời nắng đẹp và ít mưa, thích hợp để tham quan, tắm biển, tham gia các trò chơi giải trí hấp dẫn.",
  },
];
export const hotels = [
  {
    id: "1",
    image:
      "https://pix8.agoda.net/hotelImages/304309/-1/7a3989d01b7bed78e6b77bcbadd53258.jpg?ca=19&amp;ce=1",
  },
  {
    id: "2",
    image:
      "https://pix8.agoda.net/hotelImages/568/568125/568125_14041015460019033004.jpg?ca=2&amp;ce=1",
  },
  {
    id: "3",
    image:
      "https://pix8.agoda.net/hotelImages/1519798/-1/2ef8d4933ba430a44e608f1ed5fb64a3.jpg?ca=9&amp;ce=1",
  },
  {
    id: "4",
    image:
      "https://pix8.agoda.net/hotelImages/1158339/-1/9cfe9638c7d9ce5577ec22842c0dd796.jpg?ca=6&ce=1",
  },
  {
    id: "5",
    image:
      "https://pix8.agoda.net/hotelImages/3606056/-1/04c5f91f6acae632be5342ccf725acec.jpg?ca=0&ce=1",
  },
  {
    id: "6",
    image:
      "https://pix8.agoda.net/hotelImages/1603126/-1/dddd40056d6fdfb944bcddd04a33ba21.jpg?ce=0",
  },
];
export default tours;
