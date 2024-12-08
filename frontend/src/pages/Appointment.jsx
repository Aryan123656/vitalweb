import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// const GeocoderMarker = ({ address }) => {
//     const [position, setPosition] = useState(null);
//     const map=useMap();

//     useEffect(() => {
//         const geocodeAddress = async () => {
//             if (!address) return;

//             // Combine address lines for geocoding
//             const fullAddress = `${address.line1}, ${address.line2}`.trim();

//             try {
//                 const response = await axios.get('https://nominatim.openstreetmap.org/search', {
//                     params: {
//                         q: fullAddress,
//                         format: 'json',
//                         limit: 1
//                     }
//                 });

//                 if (response.data && response.data.length > 0) {
//                     const { lat, lon } = response.data[0];
//                     setPosition([parseFloat(lat), parseFloat(lon)]);
//                 } else {
//                     console.error('No coordinates found for address');
//                 }
//             } catch (error) {
//                 console.error('Geocoding error:', error);
//             }
//         };

//         geocodeAddress();
//     }, [address]);

//     if (!position) return null;

//     return (
//         <Marker position={position}>
//             <Popup>
//                 {address.line1}<br />
//                 {address.line2}
//             </Popup>
//         </Marker>
//     );
// };
const GeocoderMarker = ({ address }) => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    const geocodeAddress = async () => {
      if (!address) return;

      const fullAddress = `${address.line1}, ${address.line2}`.trim();

      try {
        const response = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: fullAddress,
              format: "json",
              limit: 1,
            },
          }
        );

        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          const newPosition = [parseFloat(lat), parseFloat(lon)];
          setPosition(newPosition);

          map.setView(newPosition, 15);
        } else {
          console.error("No coordinates found for address");
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    };

    geocodeAddress();
  }, [address, map]);

  if (!position) return null;

  return (
    <Marker position={position}>
      <Popup>
        {address.line1}
        <br />
        {address.line2}
      </Popup>
    </Marker>
  );
};
const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctosData } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(false);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(1);
  const [slotTime, setSlotTime] = useState("");

  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSolts = async () => {
    setDocSlots([]);
    let today = new Date();
    for (let i = 0; i < 15; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);
      if (today.getDate() === currentDate.getDate()) {
        console.log(currentDate.getHours());
        currentDate.setHours(
          currentDate.getHours() >= 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 0 : 30);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      console.log(currentDate);
      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        // console.log(formattedTime);
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;
        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;
        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots((prev) => [...prev, timeSlots]);
    }
    console.log(docSlots);
  };

  const totalAppointment = async () => {
    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = day + "_" + month + "_" + year;
      console.log(slotDate,docInfo);
      const res = await axios.post(
        `${backendUrl}/api/user/count`,
        { slotDate, docId: docInfo._id },
        { headers: { token } }
      );
      console.log(res);
      if (res.data.success == false) {
        
        return false;
      }
      return true;
    } catch (err) {
      console.log(err);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Login to book appointment");
      return navigate("/login");
    }
    const res = await totalAppointment();
    console.log(res);
    if (res == false) {
        toast.error("YOU CAN BOOK MAXIMUM 5 APPOINTMENT IN A DAY");
      return;
    }
    const date = docSlots[slotIndex][0].datetime;
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    const slotDate = day + "_" + month + "_" + year;
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctosData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      console.log(docInfo);
      getAvailableSolts();
    }
  }, [docInfo]);

  return docInfo ? (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-primary w-full sm:max-w-72 rounded-lg"
            src={docInfo.image}
            alt=""
          />
        </div>
        <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {docInfo.name}{" "}
            <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {docInfo.experience}
            </button>
          </div>
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
              About <img className="w-3" src={assets.info_icon} alt="" />
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
              {docInfo.about}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
              Address <img className="w-3" src={assets.info_icon} alt="" />
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
              {docInfo.address.line1}
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
              {docInfo.address.line2}
            </p>
          </div>
          <p className="text-gray-600 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-800">
              {currencySymbol}
              {docInfo.fees}
            </span>{" "}
          </p>
        </div>
      </div>

      {/* Map Section */}
      {docInfo.address && (
        <div className="w-full mt-4">
          <p className="text-2xl text-primary font-medium mb-2">
            Clinic Location
          </p>
          <MapContainer
            center={[0, 0]}
            zoom={15}
            scrollWheelZoom={false}
            className="h-[300px] w-full rounded-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeocoderMarker address={docInfo.address} />
          </MapContainer>
        </div>
      )}

      <div className=" sm:pl-4 mt-8 font-medium text-[#565656]">
        <p>Booking slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.length &&
            docSlots.map((item, index) => (
              <>
                {!item[0] ? (
                  <></>
                ) : (
                  <div
                    onClick={() => setSlotIndex(index)}
                    key={index}
                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                      slotIndex === index
                        ? "bg-primary text-orange-300"
                        : "border border-[#DDDDDD]"
                    }`}
                  >
                    <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                    <p>{item[0] && item[0].datetime.getDate()}</p>
                  </div>
                )}
              </>
            ))}
        </div>
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots.length &&
            docSlots[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                key={index}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime
                    ? "bg-primary text-white"
                    : "text-[#949494] border border-[#B4B4B4]"
                }`}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>
        <button
          onClick={bookAppointment}
          className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6"
        >
          Book an appointment
        </button>
      </div>

      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  ) : null;
};

export default Appointment;
