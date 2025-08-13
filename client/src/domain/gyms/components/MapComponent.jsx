import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import dummyGyms from "../data/dummyGyms.js";


const MapComponent = () => {
    const mapRef = useRef(null);
    const circleRef = useRef(null);
    const [markers, setMarkers] = useState([]);
    const [userPos, setUserPos] = useState(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [isGeometryReady, setIsGeometryReady] = useState(false);
    const [showRadius, setShowRadius] = useState(true);
    const [radius, setRadius] = useState(1000);
    const [searchTerm, setSearchTerm] = useState("");
    const [onlyInRadius, setOnlyInRadius] = useState(false);
    const navigate = useNavigate();
    const [activeInfoWindow, setActiveInfoWindow] = useState(null);

    useEffect(() => {
        console.log("useEffect - SDK 로드 체크");

        const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');

        if (!existingScript) {
            setIsMapReady(!isMapReady)
            const script = document.createElement("script");
            script.src =
                "https://dapi.kakao.com/v2/maps/sdk.js?appkey=a7829b6eedfe1d85903c6c1e90a99606&autoload=false&libraries=services,geometry";
            script.async = true;

            script.onload = () => {
                console.log("SDK 로드 완료 - 초기화 시작");
                window.kakao.maps.load(() => {
                    initMap();
                    setIsGeometryReady(!!window.kakao.maps.geometry?.spherical);
                }, 1000);    // 100ms 만큼 지연 시킨다.
            };

            document.head.appendChild(script);
            console.log("새로운 SDK 로딩 완료");
        } else {
            if (window.kakao && window.kakao.maps) {
                console.log("이미 SDK 로드됨");
                initMap();
            } else {
                const intervalId = setInterval(() => {
                    if (window.kakao && window.kakao.maps) {
                        initMap();
                        clearInterval(intervalId);
                    }
                }, 1000);
                console.log("초기화 대기 중...");
            }
        }
    }, [isMapReady]);

    // 📌 지도 및 사용자 위치 초기화
    const initMap = () => {
        console.log("initMap 호출");

        const container = document.getElementById("map");
        if (!container) {
            console.warn("지도 컨테이너가 존재하지 않습니다.");
        } else {
            const savedPosition = localStorage.getItem("userPosition");
            const initialPosition = savedPosition
                ? JSON.parse(savedPosition)
                : { lat: 37.5665, lng: 126.978 };

            console.log("초기 위치:", initialPosition);

            const map = new window.kakao.maps.Map(container, {
                center: new window.kakao.maps.LatLng(initialPosition.lat, initialPosition.lng),
                level: 4,
            });
            mapRef.current = map;

            if (navigator.geolocation) {
                console.log("위치 권한 요청");
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        console.log("사용자 위치:", pos.coords);
                        const loc = new window.kakao.maps.LatLng(
                            pos.coords.latitude,
                            pos.coords.longitude
                        );
                        setUserPos(loc);
                        map.setCenter(loc);

                        new window.kakao.maps.Marker({
                            map,
                            position: loc,
                            title: "내 위치",
                            image: new window.kakao.maps.MarkerImage(
                                "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                                new window.kakao.maps.Size(24, 35)
                            ),
                        });

                        localStorage.setItem("userPosition", JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }));
                    },
                    (err) => {
                        console.warn("🚫 위치 권한 거부:", err);
                    }
                );
            }
            setIsMapReady(true);
            console.log("지도 초기화 완료");
        }
    };

    // 📌 반경 원 렌더링
    useEffect(() => {
        console.log("useEffect - 반경 원 렌더링");

        if (userPos && mapRef.current) {
            console.log("사용자 위치:", userPos);

            if (circleRef.current) circleRef.current.setMap(null);
            if (showRadius) {
                circleRef.current = new window.kakao.maps.Circle({
                    center: userPos,
                    radius: radius,
                    strokeWeight: 2,
                    strokeColor: "#3F75FF",
                    strokeOpacity: 0.8,
                    fillColor: "#3F75FF",
                    fillOpacity: 0.2,
                    map: mapRef.current,
                });
                console.log("반경 원 표시됨");
            }
        }
    }, [userPos, showRadius, radius]);

    const filteredGyms = useMemo(() => {
        console.log("useMemo - 헬스장 필터링 실행");

        if (!isMapReady || !mapRef.current || (onlyInRadius && !userPos)) {
            console.log("조건 미충족 - 필터링 중단");
            return [];
        }

        return dummyGyms.filter((gym) => {
            const matchesSearch = gym.name.toLowerCase().includes(searchTerm.toLowerCase());

            if (onlyInRadius) {
                if (!window.kakao.maps.geometry?.spherical) {
                    console.warn("geometry 라이브러리 미사용");
                    return false;
                }

                const gymPos = new window.kakao.maps.LatLng(gym.lat, gym.lng);
                const distance = window.kakao.maps.geometry.spherical.computeDistanceBetween(userPos, gymPos);
                const isInRadius = distance <= radius;
                console.log(`헬스장: ${gym.name}, 거리: ${distance}, 반경 내: ${isInRadius}`);
                return matchesSearch && isInRadius;
            }

            return matchesSearch;
        });
    }, [searchTerm, userPos, onlyInRadius, radius, isMapReady, isGeometryReady]);


    useEffect(() => {
        console.log("useEffect - 필터링된 마커 렌더링");

        if (!mapRef.current || !isMapReady) {
            console.log("지도 준비되지 않음");
            return;
        }

        markers.forEach((marker) => marker.setMap(null));

        const newMarkers = filteredGyms.map((gym) => {
            const position = new window.kakao.maps.LatLng(gym.lat, gym.lng);
            const marker = new window.kakao.maps.Marker({
                map: mapRef.current,
                position,
                title: gym.name,
            });

            const infoWindow = new window.kakao.maps.InfoWindow({
                content: `
              <div style="padding:5px; font-size:13px;">
                <strong>${gym.name}</strong><br/>
                <a href="/gyms/${gym.gymNo}" style="color:blue;">상세 보기</a>
              </div>
            `,
            });

            window.kakao.maps.event.addListener(marker, "click", () => {
                if (activeInfoWindow) {
                    activeInfoWindow.close();
                }

                infoWindow.open(mapRef.current, marker);
                setActiveInfoWindow(infoWindow);
            });

            return marker;
        });

        setMarkers(newMarkers);
        console.log("새로운 마커 추가됨");
    }, [filteredGyms, isMapReady]);

    const handleResetCenter = () => {
        console.log("내 위치로 돌아가기 클릭");
        if (userPos) mapRef.current?.setCenter(userPos);
    };

    const handleToggleRadius = () => {
        console.log("반경 표시 토글");
        setShowRadius((prev) => !prev);
    };

    const handleRadiusChange = (e) => {
        const newRadius = Math.max(Number(e.target.value), 10);
        console.log("반경 크기 변경:", newRadius);
        setRadius(newRadius);
    };


    return (
        <div style={{ position: "relative", width: "100%", height: "100vh", fontFamily: "sans-serif" }}>
            <div style={{
                position: "absolute", top: "12px", left: "50%", transform: "translateX(-50%)",
                zIndex: 10, width: "260px",
            }}>
                <div style={{ position: "relative", width: "100%" }}>
                    <input
                        type="text"
                        placeholder="헬스장 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%", padding: "8px 32px 8px 12px",
                            borderRadius: "8px", border: "1px solid #ccc",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                            fontSize: "14px", backgroundColor: "white",
                        }}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            style={{
                                position: "absolute", top: "50%", right: "8px",
                                transform: "translateY(-50%)", border: "none",
                                background: "none", cursor: "pointer", fontSize: "14px", color: "#888"
                            }}
                        >
                            ❌
                        </button>
                    )}
                </div>
            </div>

            <div id="map" style={{ width: "100%", height: "100%" }}></div>

            <div style={{
                position: "absolute", top: 70, left: 10, zIndex: 10,
                backgroundColor: "white", padding: "12px", borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)", fontSize: "14px", width: "200px"
            }}>
                <button onClick={handleResetCenter} style={{ marginBottom: "10px", width: "100%" }}>
                    📍 내 위치로 돌아가기
                </button>
                <button onClick={handleToggleRadius} style={{ marginBottom: "10px", width: "100%" }}>
                    {showRadius ? "반경 숨기기" : "반경 표시"}
                </button>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                        type="number"
                        value={radius}
                        onChange={handleRadiusChange}
                        min={10}
                        step={10}
                        onFocus={(e) => e.target.style.borderColor = '#3498db'}
                        onBlur={(e) => e.target.style.borderColor = '#fff'}
                        style={{
                            width: "80%",
                            padding: "6px",
                            fontSize: "14px",
                            textAlign: "center",
                            border: "2px solid #fff",
                            borderRadius: "4px",
                            outline: "none",
                            transition: "border-color 0.3s ease-in-out",
                            WebkitAppearance: "none",
                            MozAppearance: "textfield",
                        }}
                    />
                    <span style={{ marginLeft: "5px" }}>m</span>
                </div>
            </div>

            <div style={{
                position: "absolute", bottom: 0, left: 0, width: "100%",
                maxHeight: "22vh", overflowX: "auto", display: "flex",
                backgroundColor: "#f8f8f8", padding: "10px 12px",
                boxShadow: "0 -2px 6px rgba(0,0,0,0.2)", zIndex: 5, gap: "12px"
            }}>
                {filteredGyms.map((gym) => (
                    <div
                        key={gym.gymNo}
                        onClick={() => navigate(`/gyms/${gym.gymNo}`)}
                        style={{
                            minWidth: "200px", padding: "10px", border: "1px solid #ccc",
                            borderRadius: "8px", cursor: "pointer", backgroundColor: "#fff"
                        }}
                    >
                        <strong>{gym.name}</strong>
                        <p style={{ margin: "4px 0", fontSize: "0.9em" }}>{gym.address}</p>
                        <p style={{ margin: "0", fontSize: "0.8em", color: "#888" }}>
                            ({gym.lat.toFixed(4)}, {gym.lng.toFixed(4)})
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MapComponent;