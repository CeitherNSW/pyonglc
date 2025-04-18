import { useEffect, useRef } from 'react';

interface GoogleMapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    google: typeof google;
  }
}

const GoogleMap = ({ center, zoom, style }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const scriptId = 'google-maps-script';

    const initMap = () => {
      if (mapRef.current && window.google) {
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              featureType: 'poi.business',
              elementType: 'labels',
              stylers: [
                { visibility: 'simplified' },
                { color: '#d0d0d0' },
              ],
            },
            {
              featureType: 'poi.business',
              elementType: 'geometry',
              stylers: [
                { color: '#f0f0f0' },
              ],
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [
                { color: '#999999' },
              ],
            },
            // {
            //   featureType: 'poi',
            //   elementType: 'labels.icon',
            //   stylers: [
            //     { visibility: 'off' }, 
            //   ],
            // },
          ],
        });
        const marker = new window.google.maps.Marker({
          position: center,
          map,
          title: 'Pyong Laser & Skin Clinic',
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="font-family: Arial; font-size: 14px;">
              <strong>Pyong Laser & Skin Clinic</strong><br/>
              Unit 3/226A Coward St, Mascot NSW 2020<br/>
              <a href="https://www.google.com.au/maps/place/Pyong+Laser+%26+Skin+Clinic/@-33.9244236,151.1879973,17z/data=!4m16!1m9!3m8!1s0x6b12b138147eab9f:0x2e89cd7578e44267!2sPyong+Laser+%26+Skin+Clinic!8m2!3d-33.9241104!4d151.1881224!9m1!1b1!16s%2Fg%2F11h9k9ckth!3m5!1s0x6b12b138147eab9f:0x2e89cd7578e44267!8m2!3d-33.9241104!4d151.1881224!16s%2Fg%2F11h9k9ckth?entry=ttu&g_ep=EgoyMDI1MDQxNC4xIKXMDSoASAFQAw%3D%3D" target="_blank">View on Google Maps</a>
            </div>
          `,
        });
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      }
    };

    

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [center, zoom]);

  return <div ref={mapRef} style={style || { height: '400px', width: '100%' }} />;
};

export default GoogleMap;